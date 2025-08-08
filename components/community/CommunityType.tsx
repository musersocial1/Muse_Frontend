import { CommunityData } from "@/types/community";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        className="flex-1 "
        style={{ paddingTop: insets.top }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <SafeAreaView className="flex-1">
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            className="ml-5 h-14 left-0 w-14 absolute top-0  overflow-hidden border-white/30 border rounded-full bg-black/20 items-center justify-center z-20"
            // bg-white/10 = white at 10% opacity, matches that soft look in your image
          >
            <BlurView style={[StyleSheet.absoluteFill]} />
            <Feather
              name="chevron-left"
              size={20}
              color="#fff"
              style={{ opacity: 0.7 }}
            />
          </TouchableOpacity>

          <View className="items-center mt-16 mb-8">
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
                  <View
                    style={{ opacity: selectedType === "private" ? 1 : 0.8 }}
                    className="flex-row justify-between items-start"
                  >
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
                  <View
                    style={{ opacity: selectedType !== "private" ? 1 : 0.8 }}
                    className="flex-row justify-between items-start"
                  >
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
