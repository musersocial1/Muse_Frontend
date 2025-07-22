import OTPModal from "@/components/modals/OTPModal";
import { icons } from "@/constants/icons";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { useAuth } from "@/hooks/useAuth";
import { authAPI } from "@/lib/api/auth";
import { showError, showSuccess } from "@/lib/toast";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { CheckCircle, XCircle } from "lucide-react-native";
import React, { useState } from "react";
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

const ValidationItem = ({
  label,
  passed,
}: {
  label: string;
  passed: boolean;
}) => (
  <View className="flex-row items-center mb-2">
    {passed ? (
      <CheckCircle size={18} color="green" className="mr-2" />
    ) : (
      <XCircle size={18} color="red" className="mr-2" />
    )}
    <Text className="text-white text-[20px] font-sfpro-regular capitalize text-sm ml-1">
      {label}
    </Text>
  </View>
);

const ResetPassword = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const router = useRouter();
  const { user } = useAuth();

  const validatePassword = (password: string) => {
    return {
      hasUppercase: /[A-Z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasMinLength: password.length >= 8,
    };
  };

  const passwordValidation = validatePassword(newPassword);

  const handleResetPassword = async () => {
    if (!oldPassword || !newPassword) {
      showError("Missing Fields", "Please fill in both fields");
      return;
    }

    const allValid = Object.values(passwordValidation).every(Boolean);

    if (!allValid) {
      showError("Invalid Password", "Please meet all password requirements");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.requestPasswordChange({
        oldPassword,
        newPassword,
      });

      console.log("Password change request response:", response);

      if (response) {
        showSuccess(
          "Verification Code Sent",
          "Please check your email for the verification code"
        );
        setShowOTP(true);
      }
    } catch (error: any) {
      console.error("Password change request error:", error);
      let errorMessage = "Failed to send verification code";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showError("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPConfirm = async (otp: string) => {
    setOtpLoading(true);

    try {
      const response = await authAPI.confirmPasswordChange(otp, newPassword);

      console.log("Password change confirm response:", response);

      if (response && response.success !== false) {
        showSuccess("Success", "Password changed successfully");
        setShowOTP(false);

        // Clear form fields
        setOldPassword("");
        setNewPassword("");

        setTimeout(() => {
          router.replace(RouterConstantUtil.profile.settings as any);
        }, 1500);
      } else {
        showError(
          "Invalid Code",
          response?.message || "Please check your verification code"
        );
      }
    } catch (error: any) {
      console.error("Password change confirm error:", error);

      let errorMessage = "Failed to verify code";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showError("Error", errorMessage);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!user?.email) {
      showError("Error", "User email not found");
      return;
    }

    try {
      const response = await authAPI.resendEmailVerificationCode({
        email: user.email,
      });

      console.log("Resend OTP response:", response);

      if (response) {
        showSuccess(
          "Code Resent",
          "A new verification code has been sent to your email"
        );
      }
    } catch (error: any) {
      console.error("Resend OTP error:", error);

      let errorMessage = "Failed to resend code";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showError("Error", errorMessage);
    }
  };

  const insets = useSafeAreaInsets();

  // Check if all validations pass and fields are filled
  const allValid = Object.values(passwordValidation).every(Boolean);
  const isFormValid = oldPassword && newPassword && allValid && !isLoading;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#121212" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? -20 : -36}
    >
      <View style={{ paddingTop: insets.top }} className="flex-1 bg-[#121212]">
        <StatusBar barStyle="light-content" />
        <SafeAreaView className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pb-4">
            <TouchableOpacity
              onPress={() =>
                router.replace(RouterConstantUtil.profile.settings as any)
              }
              className="w-10 h-10 rounded-full items-center justify-center"
              disabled={isLoading}
            >
              <Image source={icons.back} className="w-14 h-14" />
            </TouchableOpacity>
            <Text className="text-[#FFFFFF] text-[20px] font-bold">
              Reset Password
            </Text>
            <View className="w-10" />
          </View>

          {/* Inputs */}
          <View className="flex-1 px-6 pt-8">
            <View className="bg-[#1C1C1C] rounded-full h-[60px] px-[5%] mb-4 flex-row items-center">
              <TextInput
                className="text-white  h-full leading-[15px] font-bold flex-1 text-[15px] font-sfpro-bold"
                value={oldPassword}
                onChangeText={setOldPassword}
                placeholder="Old password"
                placeholderTextColor="#666"
                secureTextEntry={!showOldPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowOldPassword(!showOldPassword)}
                className="ml-3 p-2"
                disabled={isLoading}
              >
                {showOldPassword ? (
                  <Feather name="eye-off" size={24} color="#666" />
                ) : (
                  <Feather name="eye" size={24} color="#666" />
                )}
              </TouchableOpacity>
            </View>

            <View className="bg-[#1C1C1C] rounded-full h-[60px] px-[5%] mb-4 flex-row items-center">
              <TextInput
                className="text-white  h-full leading-[15px] flex-1 font-bold text-[15px] font-sfpro-bold"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New Password"
                placeholderTextColor="#666"
                secureTextEntry={!showNewPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                className="ml-3 p-2"
                disabled={isLoading}
              >
                {showNewPassword ? (
                  <Feather name="eye-off" size={24} color="#666" />
                ) : (
                  <Feather name="eye" size={24} color="#666" />
                )}
              </TouchableOpacity>
            </View>

            <View className="mt-4 w-full p-2">
              <ValidationItem
                label="At least 1 uppercase letter"
                passed={passwordValidation.hasUppercase}
              />
              <ValidationItem
                label="At least 1 special character"
                passed={passwordValidation.hasSpecialChar}
              />
              <ValidationItem
                label="Minimum 8 characters"
                passed={passwordValidation.hasMinLength}
              />
            </View>
          </View>

          {/* Button */}
          <View className="px-6 pb-8">
            <TouchableOpacity
              className={`py-4 rounded-full items-center justify-center ${
                isFormValid ? "bg-secondary" : "bg-gray-600"
              }`}
              onPress={handleResetPassword}
              disabled={!isFormValid}
              style={{ minHeight: 56 }}
            >
              {isLoading ? (
                <View className="flex-row items-center">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white ml-2 font-semibold text-lg">
                    Sending...
                  </Text>
                </View>
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  Reset Password
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <OTPModal
          visible={showOTP}
          onClose={() => setShowOTP(false)}
          onConfirm={handleOTPConfirm}
          onResend={handleResendOTP}
          title="Confirm code"
          subtitle="Enter the 6-digit code sent to your email"
          email={user?.email || "your email"}
          // isLoading={otpLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ResetPassword;
