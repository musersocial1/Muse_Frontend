import { STORAGE_CONFIG } from "@/config/app";
import { ServiceApiClient, tokenManager } from "@/lib/api/apiClient";
import { authAPI } from "@/lib/api/auth";
import { AuthState, RegisterRequest } from "@/types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { createContext, useCallback, useEffect, useState } from "react";

export const USER_PROFILE_QUERY_KEY = ["user", "profile"];

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  verifyLogin: (email: string, code: string) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  handleAuthError: () => Promise<void>;
  needsVerification: boolean;
  verificationEmail: string | null;
  refetchProfile: () => Promise<any>;
  invalidateProfile: () => Promise<void>;
  isProfileLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();

  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    token: null,
  });

  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(
    null
  );

  const {
    data: profileData,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
    error: profileError,
  } = useQuery({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: async () => {
      if (!authState.isAuthenticated) {
        throw new Error("Not authenticated");
      }
      const response = await authAPI.getUserProfile();

      const profile = response.user || response;
      return profile;
    },
    enabled: authState.isAuthenticated,
    retry: (failureCount, error: any) => {
      console.log(`⚠️ Profile fetch retry ${failureCount}:`, error?.message);
      // Don't retry on auth errors
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: !authState.user,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (profileData && authState.isAuthenticated) {
      setAuthState((prev) => ({
        ...prev,
        user: profileData,
      }));

      AsyncStorage.setItem(
        STORAGE_CONFIG.keys.USER_DATA,
        JSON.stringify(profileData)
      );
    }
  }, [profileData, authState.isAuthenticated]);

  useEffect(() => {
    if (profileError && authState.isAuthenticated) {
      const error = profileError as any;
      console.error(" Profile query error:", error);
      // Let ApiClient handle 401/403 errors automatically
      if (error?.response?.status !== 401 && error?.response?.status !== 403) {
        setAuthState((prev) => ({
          ...prev,
          error: error?.response?.data?.message || "Failed to load profile",
        }));
      }
    }
  }, [profileError, authState.isAuthenticated]);

  const handleAuthError = useCallback(async () => {
    console.log("🚨 Auth error - logging out user");
    await clearAuthData();
    queryClient.clear();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
      error: "Session expired. Please login again.",
    });
    setNeedsVerification(false);
    setVerificationEmail(null);
  }, [queryClient]);

  useEffect(() => {
    ServiceApiClient.setAuthErrorHandler(handleAuthError);
    initializeAuth();
  }, [handleAuthError]);

  const initializeAuth = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const token = await tokenManager.getToken();
      if (!token) {
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        return;
      }

      const cachedUserData = await AsyncStorage.getItem(
        STORAGE_CONFIG.keys.USER_DATA
      );

      if (cachedUserData) {
        const user = JSON.parse(cachedUserData);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          token,
        });
        // Set cached data in React Query
        queryClient.setQueryData(USER_PROFILE_QUERY_KEY, user);
      } else {
        setAuthState({
          user: null,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          token,
        });
      }
    } catch (error) {
      await clearAuthData();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        token: null,
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      setNeedsVerification(false);
      setVerificationEmail(null);

      await authAPI.login({ email, password });

      setNeedsVerification(true);
      setVerificationEmail(email);

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || "Login failed",
      }));
      setNeedsVerification(false);
      setVerificationEmail(null);
      throw error;
    }
  };

  const verifyLogin = async (email: string, code: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await authAPI.verifyLogin({ email, code });

      await tokenManager.setToken(response.jwtToken);
      await tokenManager.setRefreshToken(response.jwtToken);

      await AsyncStorage.setItem(
        STORAGE_CONFIG.keys.USER_DATA,
        JSON.stringify(response.user)
      );

      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        token: response.jwtToken,
      });

      queryClient.setQueryData(USER_PROFILE_QUERY_KEY, response.user);

      setNeedsVerification(false);
      setVerificationEmail(null);
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || "Login verification failed",
      }));
      throw error;
    }
  };

  const register = async (payload: RegisterRequest) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await authAPI.register(payload);

      await tokenManager.setToken(response.jwtToken);
      await tokenManager.setRefreshToken(response.jwtToken);

      await AsyncStorage.setItem(
        STORAGE_CONFIG.keys.USER_DATA,
        JSON.stringify(response.user)
      );

      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        token: response.jwtToken,
      });

      queryClient.setQueryData(USER_PROFILE_QUERY_KEY, response.user);
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || "Registration failed",
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      await authAPI.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      await clearAuthData();
      queryClient.clear();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        token: null,
      });
      setNeedsVerification(false);
      setVerificationEmail(null);
    }
  };

  const refreshUser = async () => {
    try {
      if (!authState.isAuthenticated) return;

      const response = await authAPI.getUserProfile();
      const userData = response.user || response;

      await AsyncStorage.setItem(
        STORAGE_CONFIG.keys.USER_DATA,
        JSON.stringify(userData)
      );

      setAuthState((prev) => ({
        ...prev,
        user: userData,
        error: null,
      }));

      queryClient.setQueryData(USER_PROFILE_QUERY_KEY, userData);
    } catch (error: any) {
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        setAuthState((prev) => ({
          ...prev,
          error: error.response?.data?.message || "Failed to refresh user data",
        }));
      }
    }
  };

  const invalidateProfile = async () => {
    await queryClient.invalidateQueries({
      queryKey: USER_PROFILE_QUERY_KEY,
    });
  };

  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  const clearAuthData = async () => {
    await Promise.all([
      tokenManager.removeTokens(),
      AsyncStorage.removeItem(STORAGE_CONFIG.keys.USER_DATA),
    ]);
  };

  const value: AuthContextType = {
    ...authState,
    login,
    verifyLogin,
    register,
    logout,
    refreshUser,
    clearError,
    handleAuthError,
    needsVerification,
    verificationEmail,
    refetchProfile,
    invalidateProfile,
    isProfileLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
