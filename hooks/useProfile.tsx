import { AuthContext } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";

export const USER_PROFILE_QUERY_KEY = ["user", "profile"];

export const useProfile = () => {
  const authContext = useContext(AuthContext);
  const queryClient = useQueryClient();

  if (!authContext) {
    throw new Error("useProfile must be used within an AuthProvider");
  }

  const {
    user,
    isAuthenticated,
    refetchProfile,
    invalidateProfile,
    isProfileLoading,
  } = authContext;

  const refetchUserProfile = async () => {
    if (!isAuthenticated) {
      throw new Error("Not authenticated");
    }
    const result = await refetchProfile();
    return result;
  };

  const invalidateUserProfile = async () => {
    await invalidateProfile();
  };

  const setProfileData = (userData: any) => {
    queryClient.setQueryData(USER_PROFILE_QUERY_KEY, userData);
  };

  const clearProfileCache = () => {
    queryClient.removeQueries({ queryKey: USER_PROFILE_QUERY_KEY });
  };

  return {
    user,
    isAuthenticated,
    isLoading: isProfileLoading,

    refetch: refetchUserProfile,
    invalidate: invalidateUserProfile,
    setData: setProfileData,
    clearCache: clearProfileCache,

    hasUser: !!user,
    needsProfile: isAuthenticated && !user,
  };
};

export const useProfileActions = () => {
  const authContext = useContext(AuthContext);
  const queryClient = useQueryClient();

  if (!authContext) {
    throw new Error("useProfileActions must be used within an AuthProvider");
  }

  const refetchProfile = async () => {
    if (!authContext.isAuthenticated) {
      throw new Error("Not authenticated");
    }

    const result = await authContext.refetchProfile();
    return result;
  };

  const invalidateProfile = async () => {
    await authContext.invalidateProfile();
  };

  const setProfileData = (userData: any) => {
    queryClient.setQueryData(USER_PROFILE_QUERY_KEY, userData);
  };

  return {
    refetchProfile,
    invalidateProfile,
    setProfileData,
  };
};

export const useProfileUpdate = () => {
  const { refetchProfile, setProfileData } = useProfileActions();

  const updateProfile = async (newProfileData?: any) => {
    if (newProfileData) {
      console.log(" Instant profile update with new data");
      setProfileData(newProfileData);
    }

    await refetchProfile();
  };

  return { updateProfile };
};
