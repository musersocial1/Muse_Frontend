import { icons } from "@/constants/icons";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { useAuthState } from "@/hooks/useAuthState";
import { useProfileActions } from "@/hooks/useProfile";
import { authAPI } from "@/lib/api/auth";
import { showError, showInfo, showSuccess } from "@/lib/toast";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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

const ChangeUsername = () => {
  const [newUsername, setNewUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- new state for liveness check ---
  const [isChecking, setIsChecking] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const usernameCheckTimeout = useRef<any>(null);
  // ------------------------------------

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

  // --- Username liveness check handler ---
  useEffect(() => {
    // Reset all feedback if blank
    if (
      !newUsername ||
      newUsername.trim() === "" ||
      newUsername.trim().length < 3
    ) {
      setUsernameError("");
      setUsernameAvailable(false);
      setIsChecking(false);
      return;
    }

    // Only check if username has changed and is at least 3 chars
    if (newUsername.trim() === currentUsername) {
      setUsernameError(""); // don't show "taken" for current
      setUsernameAvailable(false);
      setIsChecking(false);
      return;
    }

    // Local validation
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(newUsername)) {
      setUsernameError(
        "Username can only contain letters, numbers, and underscores"
      );
      setUsernameAvailable(false);
      setIsChecking(false);
      return;
    }

    // Debounce API call (500ms after last keystroke)
    if (usernameCheckTimeout.current)
      clearTimeout(usernameCheckTimeout.current);

    setIsChecking(true);
    setUsernameError("");
    setUsernameAvailable(false);

    usernameCheckTimeout.current = setTimeout(async () => {
      try {
        const uname = newUsername.trim().toLowerCase();
        const { exists } = await authAPI.checkUsernameExists(uname);
        if (exists) {
          setUsernameError("Username is already taken");
          setUsernameAvailable(false);
          // Focus the input and highlight red
          inputRef.current?.focus();
        } else {
          setUsernameError("");
          setUsernameAvailable(true);
        }
      } catch (err) {
        setUsernameError("Could not check username. Try again.");
        setUsernameAvailable(false);
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(usernameCheckTimeout.current);
  }, [newUsername, currentUsername]);
  // ------------------------------------------

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

    // --- Must not allow change if error or not available ---
    if (!usernameAvailable || isChecking || !!usernameError) {
      showInfo("Invalid Username", usernameError || "Username not available");
      return;
    }
    // ------------------------------------------------------

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
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send verification code";
      showError("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges =
    newUsername.trim() !== currentUsername && newUsername.trim().length > 0;
  // --- updated: button disabled if checking, taken, or not available
  const isButtonDisabled =
    !hasChanges ||
    isLoading ||
    remaining <= 0 ||
    isChecking ||
    !!usernameError ||
    !usernameAvailable;

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
            <View
              className={`bg-[#2A2A2A] rounded-full h-[60px] px-[5%] mb-2 border-2 ${
                usernameError
                  ? "border-red-500"
                  : usernameAvailable
                  ? "border-green-500"
                  : "border-transparent"
              }`}
            >
              <TextInput
                ref={inputRef}
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
              {/* Spinner on the right inside input */}
              {isChecking && (
                <View style={{ position: "absolute", right: 24, top: 18 }}>
                  <ActivityIndicator size="small" color="#36f" />
                </View>
              )}
            </View>

            {/* Username error or available message */}
            {usernameError ? (
              <Text className="text-red-500 text-sm mb-2 px-2">
                {usernameError}
              </Text>
            ) : usernameAvailable && newUsername.trim().length >= 3 ? (
              <Text className="text-green-500 text-sm mb-2 px-2">
                Username is available
              </Text>
            ) : null}

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
                <View
                  style={{
                    width: 28,
                    height: 28,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather
                    name={remaining > 0 ? "check-circle" : "x-circle"}
                    size={26}
                    color={remaining > 0 ? "#22C55E" : "#EF4444"}
                  />
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
