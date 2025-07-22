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
    return await refetchProfile();
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
  const queryClient = useQueryClient();

  const refetchProfile = () => {
    return queryClient.refetchQueries({
      queryKey: USER_PROFILE_QUERY_KEY,
    });
  };

  const invalidateProfile = () => {
    return queryClient.invalidateQueries({
      queryKey: USER_PROFILE_QUERY_KEY,
    });
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
