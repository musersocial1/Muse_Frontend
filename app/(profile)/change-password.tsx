import OTPModal from "@/components/modals/OTPModal";
import { icons } from "@/constants/icons";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { useRouter } from "expo-router";
import { CheckCircle, XCircle } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ResetPassword = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const router = useRouter();

  const validatePassword = (password: string) => {
    return {
      hasUppercase: /[A-Z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasMinLength: password.length >= 8,
    };
  };

  const passwordValidation = validatePassword(newPassword);

  const handleResetPassword = () => {
    if (!currentPassword || !newPassword) {
      Alert.alert("Missing fields", "Please fill in both fields");
      return;
    }

    const allValid = Object.values(passwordValidation).every(Boolean);

    if (!allValid) {
      Alert.alert("Invalid Password", "Please meet all password requirements");
      return;
    }

    setShowOTP(true);
  };

  const handleOTPConfirm = (otp: string) => {
    Alert.alert("Success", "Password changed successfully", [
      {
        text: "OK",
        onPress: () => {
          setShowOTP(false);
          router.replace(RouterConstantUtil.profile.settings as any);
        },
      },
    ]);
  };

  const handleResendOTP = () => {
    Alert.alert("Code Resent", "A new verification code has been sent.");
  };

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
      <Text className="text-white text-sm ml-1">{label}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-[#121212]">
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity
            onPress={() =>
              router.replace(RouterConstantUtil.profile.settings as any)
            }
            className="w-10 h-10 rounded-full items-center justify-center"
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
          <View className="bg-[#2A2A2A] rounded-full p-5 mb-4">
            <TextInput
              className="text-gray-200 font-medium text-[18px]"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Current Password"
              placeholderTextColor="#666"
              secureTextEntry
            />
          </View>

          <View className="bg-[#2A2A2A] rounded-full p-5 mb-4">
            <TextInput
              className="text-gray-200 font-medium text-[18px]"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="New Password"
              placeholderTextColor="#666"
              secureTextEntry
            />
          </View>

          <View className="mt-4">
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
            className={`py-4 rounded-full items-center ${
              newPassword ? "bg-secondary" : "bg-grayish-100"
            }`}
            onPress={handleResetPassword}
            disabled={!newPassword}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Reset Password
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
        subtitle="Enter the 6-digit code sent to your email"
        email="your@email.com"
      />
    </View>
  );
};

export default ResetPassword;
