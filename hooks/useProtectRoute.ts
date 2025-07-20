import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuthState } from "./useAuthState";

export const useProtectedRoute = (
  redirectTo: string = RouterConstantUtil.auth.login as any
) => {
  const { isLoggedIn, isLoading } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace(redirectTo as any);
    }
  }, [isLoading, isLoggedIn, router, redirectTo]);

  return { isLoading, isLoggedIn };
};
