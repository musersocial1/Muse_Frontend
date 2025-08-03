import { CommunityData } from "@/types/community";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProgressBar from "./ProgressBar";

const PrivacyScreen: React.FC<{
  data: CommunityData;
  onUpdate: (data: Partial<CommunityData>) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ data, onUpdate, onNext, onBack }) => {
  return (
    <LinearGradient
      colors={["#1F2937", "#374151", "#4B5563"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 px-6">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={onBack} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ProgressBar currentStep={5} totalSteps={6} />

        <View className="flex-1">
          <Text className="text-white text-2xl font-bold mb-8">
            Community type
          </Text>

          <View className="space-y-6">
            <View className="bg-white/10 rounded-2xl p-6">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white text-lg font-semibold">
                  Private
                </Text>
                <Switch
                  value={data.isPrivate}
                  onValueChange={(value) => onUpdate({ isPrivate: value })}
                  trackColor={{ false: "#374151", true: "#3B82F6" }}
                  thumbColor={data.isPrivate ? "#FFFFFF" : "#9CA3AF"}
                />
              </View>
              <Text className="text-gray-300 text-sm">
                Only approved members can see who's in the group and what they
                post.
              </Text>
            </View>

            <View className="bg-white/10 rounded-2xl p-6">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white text-lg font-semibold">Public</Text>
                <Switch
                  value={!data.isPrivate}
                  onValueChange={(value) => onUpdate({ isPrivate: !value })}
                  trackColor={{ false: "#374151", true: "#3B82F6" }}
                  thumbColor={!data.isPrivate ? "#FFFFFF" : "#9CA3AF"}
                />
              </View>
              <Text className="text-gray-300 text-sm">
                Anyone can see who's in the group and what they post.
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={onNext}
          className="bg-blue-600 rounded-2xl py-4 mb-6"
        >
          <Text className="text-white text-lg font-semibold text-center">
            Continue
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PrivacyScreen;
