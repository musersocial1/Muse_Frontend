import { icons } from "@/constants/icons";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { useAuthState } from "@/hooks/useAuthState";
import { useProfileActions } from "@/hooks/useProfile";
import { authAPI } from "@/lib/api/auth";
import { showError, showInfo, showSuccess } from "@/lib/toast";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

const ChangeUsername = () => {
  const [newUsername, setNewUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { user } = useAuthState();
  const { refetchProfile } = useProfileActions();

  const currentUsername = user?.username || "";
  const usernameChangeCount = user?.usernameChangeCount || 0;

  const maxChanges = 3;
  const remaining = maxChanges - usernameChangeCount;
  const progress = (usernameChangeCount / maxChanges) * 100;

  useEffect(() => {
    if (currentUsername && !newUsername) {
      setNewUsername(currentUsername);
    }
  }, [currentUsername]);

  const validateUsername = (username: string): boolean => {
    if (!username || username.trim().length < 3) {
      showInfo("Invalid Username", "Username must be at least 3 characters");
      return false;
    }

    if (username.length > 20) {
      showInfo("Invalid Username", "Username must be less than 20 characters");
      return false;
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      showInfo(
        "Invalid Username",
        "Username can only contain letters, numbers, and underscores"
      );
      return false;
    }

    return true;
  };

  const handleChangeUsername = async () => {
    if (remaining <= 0) {
      showInfo(
        "Limit Reached",
        "You have reached the maximum number of username changes allowed."
      );
      return;
    }

    if (newUsername.trim() === currentUsername) {
      showInfo("No Changes", "Please enter a different username.");
      return;
    }

    if (!validateUsername(newUsername.trim())) {
      return;
    }

    const usernameChangeData = {
      newUsername: newUsername.trim(),
    };

    setIsLoading(true);

    try {
      await authAPI.changeUsername(usernameChangeData);
      await refetchProfile();
      showSuccess("Success!", "Username changed successfully");

      setTimeout(() => {
        router.replace(RouterConstantUtil.tabs.profile as any);
      }, 1500);
    } catch (error: any) {
      console.error("Username change error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to change username. Please try again.";
      showError("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges =
    newUsername.trim() !== currentUsername && newUsername.trim().length > 0;
  const isButtonDisabled = !hasChanges || isLoading || remaining <= 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#121212" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? -50 : -55}
    >
      <View className="flex-1 bg-[#121212]">
        <StatusBar barStyle="light-content" />
        <SafeAreaView className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pb-4">
            <TouchableOpacity
              onPress={() =>
                router.replace(RouterConstantUtil.tabs.profile as any)
              }
              className="w-10 h-10 rounded-full items-center justify-center"
              disabled={isLoading}
            >
              <Image source={icons.back} className="w-14 h-14" />
            </TouchableOpacity>
            <Text className="text-[#FFFFFF] text-[20px] font-bold">
              Change username
            </Text>
            <View className="w-10" />
          </View>

          {/* Content */}
          <View className="flex-1 px-6 pt-8">
            <View className="bg-[#2A2A2A] rounded-full h-[60px] px-[5%] mb-6">
              <TextInput
                className="text-white font-bold h-full text-[15px] font-sfpro-bold"
                value={newUsername}
                onChangeText={setNewUsername}
                placeholder="Enter new username"
                placeholderTextColor="#666"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading && remaining > 0}
                maxLength={20}
              />
            </View>

            <View className="flex-row items-center justify-between mb-3 px-1">
              <Text className="text-gray-400 text-sm font-medium">
                You can change usernames {maxChanges} times
              </Text>
              <View className="flex-row items-center">
                <Text
                  className={`text-[15px] font-bold mr-2 ${
                    remaining > 0 ? "text-white" : "text-red-400"
                  }`}
                >
                  {usernameChangeCount}/{maxChanges}
                </Text>
                <View style={{ width: 28, height: 28 }}>
                  <Svg height={28} width={28}>
                    <Circle
                      stroke="#333"
                      fill="none"
                      cx={14}
                      cy={14}
                      r={12}
                      strokeWidth={4}
                    />
                    <Circle
                      stroke={remaining > 0 ? "#22C55E" : "#EF4444"}
                      fill="none"
                      cx={14}
                      cy={14}
                      r={12}
                      strokeWidth={4}
                      strokeDasharray={2 * Math.PI * 12}
                      strokeDashoffset={
                        2 *
                        Math.PI *
                        12 *
                        (1 - usernameChangeCount / maxChanges)
                      }
                      strokeLinecap="round"
                      rotation={-90}
                      origin="14,14"
                    />
                  </Svg>
                </View>
              </View>
            </View>

            <View className="px-1 mb-4">
              <Text
                className={`text-sm ${
                  remaining > 0 ? "text-gray-400" : "text-red-400"
                }`}
              >
                {remaining > 0
                  ? `${remaining} change${remaining !== 1 ? "s" : ""} remaining`
                  : "No changes remaining"}
              </Text>
            </View>
          </View>

          {/* Change Button */}
          <View className="px-6 pb-8">
            <TouchableOpacity
              className={`py-4 rounded-full items-center justify-center ${
                isButtonDisabled ? "bg-gray-600" : "bg-secondary"
              }`}
              onPress={handleChangeUsername}
              disabled={isButtonDisabled}
              style={{ minHeight: 56 }}
            >
              {isLoading ? (
                <View className="flex-row items-center">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white ml-2 font-semibold text-lg">
                    Changing...
                  </Text>
                </View>
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  Change Username
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChangeUsername;
