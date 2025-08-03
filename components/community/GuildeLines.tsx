import { icons } from "@/constants/icons";
import { CommunityData } from "@/types/community";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ProgressBar from "./ProgressBar";

const { height: screenHeight } = Dimensions.get("window");

const CommunityGuidelinesScreen: React.FC<{
  data: CommunityData;
  onUpdate: (data: Partial<CommunityData>) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ data, onUpdate, onNext, onBack }) => {
  const [guidelinesText, setGuidelinesText] = useState(data.guidelines || "");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription?.remove();
      hideSubscription?.remove();
    };
  }, []);

  const wordCount = guidelinesText
    .split(" ")
    .filter((word) => word.length > 0).length;
  const remainingWords = Math.max(0, 65 - wordCount);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleTextChange = (text: string) => {
    setGuidelinesText(text);
    onUpdate({ guidelines: text });
  };

  const getContentMarginTop = () => {
    if (isKeyboardVisible) {
      return 60; // Move content up when keyboard is open
    }
    return 80; // Normal position when keyboard is closed
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        className="flex-1 bg-black"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
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
            <Image source={icons.back_3} className="h-14 w-14 opacity-90" />
          </TouchableOpacity>

          <View className="flex-1 px-3">
            <ScrollView
              showsVerticalScrollIndicator={false}
              className="flex-1"
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingBottom: isKeyboardVisible ? 100 : 120,
                flexGrow: 1,
              }}
            >
              <View
                className="bg-[#1C1C1CB2]/[70%] rounded-[40px] overflow-hidden"
                style={{
                  marginTop: getContentMarginTop(),
                  minHeight: isKeyboardVisible ? 240 : 300,
                }}
              >
                <View className="px-6 pt-8 pb-4">
                  <Text className="text-white text-xl font-semibold">
                    Enter community guideline
                  </Text>
                </View>

                <View className="flex-1 px-6 pb-6">
                  <TextInput
                    value={guidelinesText}
                    onChangeText={handleTextChange}
                    placeholder="Set rules and guidelines for your community members to follow..."
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    multiline
                    textAlignVertical="top"
                    className="text-white text-base leading-6 flex-1"
                    style={{
                      minHeight: isKeyboardVisible ? 100 : 180,
                    }}
                    maxLength={500}
                  />
                </View>

                <View className="flex-row justify-between items-center px-6 pb-6">
                  <View className="flex-row gap-2">
                    <Text className="text-white/60 text-[14px]">
                      {remainingWords} words remaining
                    </Text>
                    <View className="relative w-6 h-6">
                      <View className="w-6 h-6 rounded-full border-2 border-white/30" />
                      <View
                        className="absolute top-0 left-0 w-6 h-6 rounded-full border-2 border-transparent"
                        style={{
                          borderTopColor:
                            wordCount <= 65 ? "#10B981" : "#EF4444",
                          borderTopWidth: 2,
                          transform: [
                            { rotate: `${(wordCount / 65) * 360 - 90}deg` },
                          ],
                        }}
                      />
                    </View>
                  </View>

                  <TouchableOpacity className="w-8 h-8 rounded-full bg-white/20 justify-center items-center">
                    <Text className="text-white text-sm font-medium">i</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <LinearGradient
                colors={[
                  "rgba(18,18,18,0.3)",
                  "rgba(0,0,0,0.4)",
                  "rgba(0,0,0,0.9)",
                ]}
                start={{ x: 0.5, y: 1 }}
                end={{ x: 0.5, y: 0 }}
                style={{ borderRadius: 50 }}
                className="rounded-3xl"
              >
                {!isKeyboardVisible && (
                  <View className="mt-12 items-center">
                    <View className="w-12 h-12 rounded-full justify-center items-center mb-6">
                      <Image source={icons.warn} className="h-20 w-20" />
                    </View>

                    <View className="items-center px-4">
                      <Text className="text-white text-[22px] font-bold mb-3">
                        Community guideline
                      </Text>
                      <Text className="text-white/70 text-[16px] font-bold text-center leading-6">
                        Community guidelines are set rules{"\n"}
                        your community members have to{"\n"}
                        follow
                      </Text>
                    </View>
                  </View>
                )}

                <View className="px-6 pb-6 mt-28">
                  <ProgressBar currentStep={5} totalSteps={6} />
                  <TouchableOpacity
                    onPress={onNext}
                    className="rounded-full overflow-hidden bg-secondary py-5"
                    disabled={!guidelinesText.trim()}
                    style={{ opacity: guidelinesText.trim() ? 1 : 0.5 }}
                  >
                    <Text className="text-white text-lg font-semibold text-center">
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
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

export default CommunityGuidelinesScreen;
