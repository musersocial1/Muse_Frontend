import { icons } from "@/constants/icons";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TermsOfUse() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Handles iPhone home indicator space

  return (
    <SafeAreaView
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      className="flex-1 bg-[#121212]"
    >
      <StatusBar barStyle="light-content" />

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
          Terms of use
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Last Updated */}
        <Text className=" font-sfpro-medium text-white text-[16px] font-medium mt-6 mb-2">
          Last Updated: 01/04/2025 02:43pm
        </Text>

        {/* Introduction */}
        <Text className=" font-sfpro-medium text-white text-[16px] font-medium mb-8 leading-6">
          Welcome to muse By using our platform, you agree to the following
          terms. Please read them carefully.
        </Text>

        {/* Section 1 */}
        <Text className=" font-sfpro-medium text-white/50  text-[16px] font-medium mb-4">
          1. Acceptance of Terms
        </Text>

        <Text className=" font-sfpro-medium text-white/50  text-[16px] mb-8 leading-6">
          By accessing or using [Community App Name], you agree to these Terms
          of Service and our Privacy Policy. If you do not agree, please do not
          use the app.
        </Text>

        {/* Section 2 */}
        <Text className=" font-sfpro-medium text-white/50  text-[16px] font-medium mb-4">
          2. User Eligibility
        </Text>

        <Text className=" font-sfpro-medium text-white/50  text-[16px] mb-8 leading-6">
          You must be at least [Minimum Age] years old to use this app. By
          signing up, you confirm that you meet this requirement.
        </Text>

        {/* Section 3 */}
        <Text className=" font-sfpro-medium text-white/50  text-[16px] font-medium mb-4">
          3. Account & Privacy Settings
        </Text>

        <View className="mb-8">
          <View className="flex-row items-start mb-3">
            <Text className=" font-sfpro-medium text-white/50  text-[16px] mr-2">
              •
            </Text>
            <Text className=" font-sfpro-medium text-white/50  text-[16px] flex-1 leading-6">
              Users can choose between public and private accounts.
            </Text>
          </View>

          <View className="flex-row items-start mb-3">
            <Text className=" font-sfpro-medium text-white/50  text-[16px] mr-2">
              •
            </Text>
            <Text className=" font-sfpro-medium text-white/50  text-[16px] flex-1 leading-6">
              Private accounts limit who can view your content, while public
              accounts allow wider engagement.
            </Text>
          </View>

          <View className="flex-row items-start mb-3">
            <Text className=" font-sfpro-medium text-white/50  text-[16px] mr-2">
              •
            </Text>
            <Text className=" font-sfpro-medium text-white/50  text-[16px] flex-1 leading-6">
              You are responsible for maintaining the security of your account.
            </Text>
          </View>
        </View>

        {/* Section 4 */}
        <Text className=" font-sfpro-medium text-white/50  text-[16px] font-medium mb-4">
          4. Community Guidelines
        </Text>

        <Text className=" font-sfpro-medium text-white/50  text-[16px] mb-4 leading-6">
          To keep the community safe and enjoyable, users must follow these
          rules:
        </Text>

        {/* Guidelines with checkmarks */}
        <View className="mb-6">
          <View className="flex-row items-start mb-3">
            <Text className="text-green-500 text-[16px] mr-2">✅</Text>
            <Text className=" font-sfpro-medium text-white text-[16px] flex-1 leading-6">
              Respect others – No hate speech, harassment, or bullying.
            </Text>
          </View>

          <View className="flex-row items-start mb-3">
            <Text className="text-green-500 text-[16px] mr-2">✅</Text>
            <Text className=" font-sfpro-medium text-white text-[16px] flex-1 leading-6">
              No inappropriate content – Avoid posting harmful, illegal, or
              explicit material.
            </Text>
          </View>

          <View className="flex-row items-start mb-3">
            <Text className="text-green-500 text-[16px] mr-2">✅</Text>
            <Text className=" font-sfpro-medium text-white text-[16px] flex-1 leading-6">
              No spam or scams – Do not share misleading, promotional, or
              fraudulent content.
            </Text>
          </View>

          <View className="flex-row items-start mb-3">
            <Text className="text-green-500 text-[16px] mr-2">✅</Text>
            <Text className=" font-sfpro-medium text-white text-[16px] flex-1 leading-6">
              Follow copyright laws – Share only content that you own or have
              permission to use.
            </Text>
          </View>
        </View>

        <Text className=" font-sfpro-medium text-white/50  text-[16px] leading-6">
          Failure to comply may result in warnings, account suspension, or
          permanent bans.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
