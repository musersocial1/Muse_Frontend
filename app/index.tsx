import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { tokenManager } from "@/lib/api/apiClient";
import { authAPI } from "@/lib/api/auth";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      setIsCheckingAuth(true);
      try {
        const token = await tokenManager.getToken();

        if (!token) {
          router.replace(RouterConstantUtil.auth.login as any);
          return;
        }

        try {
          await authAPI.getUserProfile();
          // router.replace(RouterConstantUtil.tabs.home as any);
          router.replace(RouterConstantUtil.community.create as any);
        } catch (err) {
          await tokenManager.removeTokens();
          router.replace(RouterConstantUtil.auth.login as any);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.replace(RouterConstantUtil.auth.login as any);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  if (isCheckingAuth) {
    return (
      <View className="flex-1 bg-[#121212] items-center justify-center">
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return null;
}
