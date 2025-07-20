import { useMemo } from "react";
import { useAuth } from "./useAuth";

export const useAuthState = () => {
  const auth = useAuth();

  return useMemo(
    () => ({
      user: auth.user,
      isLoggedIn: auth.isAuthenticated,
      isLoading: auth.isLoading,
      error: auth.error,

      needsVerification: auth.needsVerification,
      verificationEmail: auth.verificationEmail,

      login: auth.login,
      verifyLogin: auth.verifyLogin,
      register: auth.register,
      logout: auth.logout,
      refreshUser: auth.refreshUser,
      clearError: auth.clearError,
    }),
    [auth]
  );
};
