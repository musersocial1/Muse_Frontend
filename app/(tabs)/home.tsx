import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { tokenManager } from "@/lib/api/apiClient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Animated, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await tokenManager.getToken();
      if (!token) {
        router.replace(RouterConstantUtil.auth.login as any);
      }
    };

    checkAuth();
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <Animated.View className="flex-1">
        <View className="flex-row flex-1 justify-center items-center gap-3">
          <Text className="text-white text-4xl">Tukbuddy home</Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Home;
