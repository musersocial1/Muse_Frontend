import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { tokenManager } from "@/lib/api/apiClient";
import { authAPI } from "@/lib/api/auth"; // <-- assumes you have this
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
          // No token at all
          router.replace(RouterConstantUtil.auth.login as any);
          return;
        }

        // There is a token, let's check if it's valid
        try {
          const daveis = await authAPI.getUserProfile(); // This should throw if token is invalid/expired
          // Success: token is valid
          console.log(daveis);
          router.replace(RouterConstantUtil.tabs.home as any);
        } catch (err) {
          // Token is invalid, clear it and redirect to login
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
