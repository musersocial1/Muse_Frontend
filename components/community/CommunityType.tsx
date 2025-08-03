import { icons } from "@/constants/icons";
import { CommunityData } from "@/types/community";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ProgressBar from "./ProgressBar";

const CommunityTypeScreen: React.FC<{
  data: CommunityData;
  onUpdate: (data: Partial<CommunityData>) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ data, onUpdate, onNext, onBack }) => {
  const [selectedType, setSelectedType] = useState<"private" | "public" | null>(
    data.isPrivate === true
      ? "private"
      : data.isPrivate === false
      ? "public"
      : null
  );

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleTypeSelect = (type: "private" | "public") => {
    setSelectedType(type);
    onUpdate({ isPrivate: type === "private" });
  };

  const handleContinue = () => {
    if (selectedType) {
      onNext();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        className="flex-1 bg-primary"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <Image
          source={{
            uri:
              data.coverImage ||
              "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400",
          }}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />

        <LinearGradient
          colors={["rgba(255,106,0,0.9)", "#000000", "#000000", "#000000"]}
          locations={[0, 0.35, 0.7, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientOverlay}
        />

        <SafeAreaView className="flex-1">
          <TouchableOpacity
            className="absolute top-3 left-2 h-14 w-14 z-20"
            onPress={onBack}
          >
            <Image source={icons.back_3} className="h-14 w-14 opacity-50" />
          </TouchableOpacity>

          <View className="items-center mt-8 mb-8">
            <Text className="text-[#FFFFFF] text-[19px] font-bold">
              Community type
            </Text>
          </View>

          <View className="flex-1 px-6">
            <ScrollView
              showsVerticalScrollIndicator={false}
              className="flex-1"
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 120 }}
            >
              <View className="mt-8">
                <TouchableOpacity
                  className="mb-12"
                  onPress={() => handleTypeSelect("private")}
                  activeOpacity={0.7}
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1 pr-6">
                      <Text className="text-white text-2xl font-semibold mb-3">
                        Private
                      </Text>
                      <Text className="text-gray-300 text-base leading-6">
                        Private communities require you to verify and accept
                        members to come into your community
                      </Text>
                    </View>

                    <View className="mt-2">
                      <View className="w-7 h-7 rounded-full border-2 border-white justify-center items-center">
                        {selectedType === "private" && (
                          <View className="w-4 h-4 rounded-full bg-white" />
                        )}
                      </View>
                    </View>
                  </View>

                  <View className="w-full h-px bg-gray-600 bg-opacity-50 mt-8" />
                </TouchableOpacity>

                <TouchableOpacity
                  className="mb-8"
                  onPress={() => handleTypeSelect("public")}
                  activeOpacity={0.7}
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1 pr-6">
                      <Text className="text-white text-2xl font-semibold mb-3">
                        Public
                      </Text>
                      <Text className="text-gray-300 text-base leading-6">
                        Public communities gives everyone direct access into the
                        community once payment is made
                      </Text>
                    </View>

                    <View className="mt-2">
                      <View className="w-7 h-7 rounded-full border-2 border-[#D9D9D9] justify-center items-center">
                        {selectedType === "public" && (
                          <View className="w-4 h-4 rounded-full bg-[#D9D9D9]" />
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View className="absolute bottom-0 left-0 right-0 pb-10 px-6  ">
              <ProgressBar currentStep={5} totalSteps={6} />

              <TouchableOpacity
                onPress={handleContinue}
                className="bg-secondary rounded-full py-5 items-center mt-6"
                disabled={!selectedType}
                style={{ opacity: selectedType ? 1 : 0.5 }}
              >
                <Text className="text-white text-lg font-semibold">
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default CommunityTypeScreen;
