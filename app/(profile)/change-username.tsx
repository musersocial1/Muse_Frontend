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
import Svg, { Circle } from "react-native-svg";

const ChangeUsername = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [username, setUsername] = useState("Dreyajames");
  const [changesMade, setChangesMade] = useState(1);

  const maxChanges = 3;
  const remaining = maxChanges - changesMade;
  const progress = (remaining / maxChanges) * 100;
  const radius = 18;
  const stroke = 4;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const router = useRouter();

  const handleChangeUsername = () => {
    if (remaining <= 0) {
      Alert.alert("Limit reached", "You can’t change your username anymore.");
      return;
    }

    if (!username || username.length < 3) {
      Alert.alert("Invalid Username", "Username must be at least 3 characters");
      return;
    }

    setShowOTP(true);
  };

  const handleOTPConfirm = (otp: string) => {
    Alert.alert("Success", "Username changed successfully", [
      {
        text: "OK",
        onPress: () => {
          setShowOTP(false);
          // Increment changes made for this example
          setChangesMade((prev) => Math.min(maxChanges, prev + 1));
          router.replace(RouterConstantUtil.tabs.profile as any);
        },
      },
    ]);
  };

  const handleResendOTP = () => {
    Alert.alert("Code Resent", "A new verification code has been sent.");
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
            Change username
          </Text>
          <View className="w-10" />
        </View>

        <View className="flex-1 px-6 pt-8">
          <View className="bg-[#2A2A2A] rounded-2xl p-5 mb-6">
            <TextInput
              className="text-gray-200 font-medium text-[18px]"
              value={username}
              onChangeText={setUsername}
              placeholder="Enter new username"
              placeholderTextColor="#666"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <View className="flex-row justify-between items-center mb-3 px-1">
            <Text className="text-gray-400 text-sm font-medium">
              You can only change your username 3 times
            </Text>

            <View className="w-10 h-10">
              <Svg height="40" width="40">
                <Circle
                  stroke="#333"
                  fill="none"
                  cx="20"
                  cy="20"
                  r={normalizedRadius}
                  strokeWidth={stroke}
                />
                <Circle
                  stroke="#22C55E"
                  fill="none"
                  cx="20"
                  cy="20"
                  r={normalizedRadius}
                  strokeWidth={stroke}
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  rotation={-90}
                  origin="20,20"
                />
              </Svg>
              <View className="absolute inset-0 items-center justify-center text-center">
                <Text className="text-white text-xs font-bold text-center">
                  {remaining}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-6 pb-8">
          <TouchableOpacity
            className={`py-4 rounded-full items-center ${
              username ? "bg-secondary" : "bg-gray-600"
            }`}
            onPress={handleChangeUsername}
            disabled={!username}
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
        subtitle="Enter the 6-digit code sent to your email"
        email={username}
      />
    </View>
  );
};

export default ChangeUsername;
