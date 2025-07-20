import { STORAGE_CONFIG } from "@/config/app";
import { ApiClient, tokenManager } from "@/lib/api/apiClient";
import { authAPI } from "@/lib/api/auth";
import { AuthState, RegisterRequest } from "@/types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useEffect, useState } from "react";

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
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
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

  const handleAuthError = useCallback(async () => {
    await clearAuthData();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
      error: "Session expired. Please login again.",
    });
    setNeedsVerification(false);
    setVerificationEmail(null);
  }, []);

  useEffect(() => {
    // Registering the auth error handler with ApiClient on here
    ApiClient.setAuthErrorHandler(handleAuthError);

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
        });
      } else {
        await clearAuthData();
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      await clearAuthData();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
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

      // This returns the actual tokens and user data
      const response = await authAPI.verifyLogin({ email, code });

      // Store the token and user data
      await tokenManager.setToken(response.token);

      // If there's a refresh token in the response, store it
      if ("refreshToken" in response && response.refreshToken) {
        await tokenManager.setRefreshToken(response.token);
      }

      await AsyncStorage.setItem(
        STORAGE_CONFIG.keys.USER_DATA,
        JSON.stringify(response.user)
      );

      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Clear verification state
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

      // Assuming register still works the same way with tokens
      await tokenManager.setToken(response.token);
      await tokenManager.setRefreshToken(response.token);

      await AsyncStorage.setItem(
        STORAGE_CONFIG.keys.USER_DATA,
        JSON.stringify(response.user)
      );

      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
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
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      setNeedsVerification(false);
      setVerificationEmail(null);
    }
  };

  const refreshUser = async () => {
    try {
      if (!authState.isAuthenticated) return;

      const userData = await authAPI.getUserProfile();
      await AsyncStorage.setItem(
        STORAGE_CONFIG.keys.USER_DATA,
        JSON.stringify(userData)
      );

      setAuthState((prev) => ({
        ...prev,
        user: userData,
        error: null,
      }));
    } catch (error: any) {
      // Allowing ApiClient handle 401/403 errors automatically
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        setAuthState((prev) => ({
          ...prev,
          error: error.response?.data?.message || "Failed to refresh user data",
        }));
      }
    }
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
