import { icons } from "@/constants/icons";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HelpDesk() {
  const [email, setEmail] = useState("");
  const [complaint, setComplaint] = useState("");
  const router = useRouter();

  const handleSend = () => {
    if (email.trim() && complaint.trim()) {
      console.log("Email:", email);
      console.log("Complaint:", complaint);

      setEmail("");
      setComplaint("");
    }
  };

  const insets = useSafeAreaInsets(); // Handles iPhone home indicator space

  return (
    <SafeAreaView
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 10 }}
      className="flex-1 bg-[#121212]"
    >
      <View
        style={{ paddingTop: insets.top }}
        className="flex-row items-center justify-between px-6 "
      >
        <TouchableOpacity
          onPress={() =>
            router.replace(RouterConstantUtil.profile.settings as any)
          }
          className="w-10 h-10 rounded-full items-center justify-center"
        >
          <Image source={icons.back} className="w-14 h-14" />
        </TouchableOpacity>
        <Text className="text-[#FFFFFF] text-[20px]   font-bold">
          Help desk
        </Text>
        <View className="w-10" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={20} // or adjust for your header height
        className="flex-1"
      >
        <View className="flex-1">
          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <Text className="text-white text-[18px] font-medium mt-8 mb-8">
              Leave us a message
            </Text>

            <View className="mb-6">
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#6B7280"
                keyboardType="email-address"
                autoComplete="email" // <-- NEW (expo 48+, RN 0.71+)
                textContentType="emailAddress" // <-- iOS hint
                importantForAutofill="yes" // <-- Android hint
                autoCapitalize="none"
                autoCorrect={false}
                className="bg-grayish-100 text-white px-4 py-4 rounded-full text-[16px]"
              />
            </View>

            <View className="flex-1 mb-8">
              <TextInput
                value={complaint}
                onChangeText={setComplaint}
                placeholder="Write your complaint"
                placeholderTextColor="#6B7280"
                multiline
                textAlignVertical="top"
                className="bg-grayish-100 h-[50%] shrink-0 text-brandWhite px-4 py-4 rounded-[20px] text-[16px] w-full"
                style={{ minHeight: 150 }}
              />
            </View>
          </ScrollView>

          {/* Button Container */}
          <View className="px-6  pt-4">
            <TouchableOpacity
              onPress={handleSend}
              className="bg-secondary py-4 rounded-full items-center justify-center"
              activeOpacity={0.8}
            >
              <Text className="text-white text-base font-medium">Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
