import OTPModal from "@/components/modals/OTPModal";
import { icons } from "@/constants/icons";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { useAuth } from "@/hooks/useAuth";
import { authAPI } from "@/lib/api/auth";
import { showError, showSuccess } from "@/lib/toast";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
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

const ChangeEmail = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setIsEmailValid(validateEmail(text));
  };

  const handleChangeEmail = async () => {
    if (!validateEmail(email)) {
      setIsEmailValid(false);
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.requestEmailChange({
        newEmail: email,
      });

      if (response) {
        showSuccess(
          "Verification Code Sent",
          "Please check your new email for the verification code"
        );
        setShowOTP(true);
      }
    } catch (error: any) {
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

  const handleOTPConfirm = async (otp: string) => {
    setOtpLoading(true);

    try {
      const response = await authAPI.confirmEmailChange({
        newEmail: email,
        code: otp,
      });

      if (response) {
        showSuccess("Success", "Email changed successfully");
        setShowOTP(false);
        router.replace(RouterConstantUtil.tabs.profile as any);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send verification code";
      showError("Error", errorMessage);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await authAPI.resendEmailVerificationCode({
        email,
      });

      if (response) {
        showSuccess(
          "Code Resent",
          "A new verification code has been sent to your email"
        );
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send verification code";
      showError("Error", errorMessage);
    }
  };

  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#121212" }}
      behavior={"padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? -50 : -55}
    >
      <View className="flex-1 bg-[#121212]">
        <StatusBar barStyle="light-content" />
        <SafeAreaView className="flex-1">
          <View className="flex-row items-center justify-between px-6 pb-4">
            <TouchableOpacity
              onPress={() =>
                router.replace(RouterConstantUtil.tabs.profile as any)
              }
              className="w-10 h-10 rounded-full items-center justify-center"
            >
              <Image source={icons.back} className="w-14 h-14" />
            </TouchableOpacity>
            <Text className="text-[#FFFFFF] text-[20px] font-bold">
              Change email
            </Text>
            <View className="w-10" />
          </View>

          <View className="flex-1 px-6 pt-8">
            <View
              className={`bg-[#2A2A2A] rounded-full h-[60px] px-[5%] mb-6 ${
                !isEmailValid ? "border border-red-500" : ""
              }`}
            >
              <TextInput
                className="text-white/50 font-bold h-full text-[15px] font-sfpro-bold "
                value={email}
                onChangeText={handleEmailChange}
                placeholder="Enter your email"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {!isEmailValid && (
              <Text className="text-red-500 text-sm mb-4 px-2">
                Please enter a valid email address
              </Text>
            )}
          </View>

          <View className="px-6 pb-8">
            <TouchableOpacity
              className={`py-4 rounded-full items-center ${
                validateEmail(email) && !isLoading
                  ? "bg-secondary"
                  : "bg-gray-600"
              }`}
              onPress={handleChangeEmail}
              disabled={!validateEmail(email) || isLoading}
            >
              <Text className="text-white text-center font-semibold text-lg">
                {isLoading ? "Sending..." : "Change"}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <OTPModal
          visible={showOTP}
          onClose={() => setShowOTP(false)}
          onConfirm={handleOTPConfirm}
          onResend={handleResendOTP}
          title="Confirm code"
          subtitle="Enter the 6-digits code we sent to your mail"
          email={email}
          // isLoading={otpLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChangeEmail;
