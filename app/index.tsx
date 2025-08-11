import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { tokenManager } from "@/lib/api/apiClient";
import { authAPI } from "@/lib/api/auth";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkProfileInBackground = async () => {
      try {
        const token = await tokenManager.getToken();

        if (!token) {
          console.log("no token found");
          router.replace(RouterConstantUtil.auth.login as any);
          return;
        }

        await authAPI.getUserProfile();
      } catch (error) {
        await tokenManager.removeTokens();
        router.replace(RouterConstantUtil.auth.login as any);
      }
    };

    router.replace(RouterConstantUtil.tabs.home as any);

    checkProfileInBackground();
  }, [router]);

  return null;
}
