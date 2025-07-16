import OTPModal from "@/components/modals/OTPModal";
import { icons } from "@/constants/icons";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { useRouter } from "expo-router";
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

const ChangeEmail = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [email, setEmail] = useState("Dreyajames@gmail.com");
  const [isEmailValid, setIsEmailValid] = useState(true);

  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setIsEmailValid(validateEmail(text));
  };

  const handleChangeEmail = () => {
    if (!validateEmail(email)) {
      setIsEmailValid(false);
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }
    setShowOTP(true);
  };

  const handleOTPConfirm = (otp: string) => {
    Alert.alert("Success", "Email changed successfully", [
      {
        text: "OK",
        onPress: () => {
          setShowOTP(false);
          router.replace(RouterConstantUtil.tabs.profile as any);
        },
      },
    ]);
  };

  const handleResendOTP = () => {
    Alert.alert(
      "Code Resent",
      "A new verification code has been sent to your email"
    );
  };

  return (
    <View className="flex-1 bg-[#121212]">
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center justify-between px-6 py-4">
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
            className={`bg-[#2A2A2A] rounded-2xl p-5 mb-6 ${
              !isEmailValid ? "border border-red-500" : ""
            }`}
          >
            <TextInput
              className="text-gray-400 font-medium text-[18px]"
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
              validateEmail(email) ? "bg-secondary" : "bg-gray-600"
            }`}
            onPress={handleChangeEmail}
            disabled={!validateEmail(email)}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Change
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
      />
    </View>
  );
};

export default ChangeEmail;
