import { CommunityData } from "@/types/community";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useRef, useState } from "react";
import {
  Dimensions,
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
import CircleProgress from "../ui/CircleProgress";

const { height: screenHeight } = Dimensions.get("window");

const CommunityGuidelinesScreen: React.FC<{
  data: CommunityData;
  onUpdate: (data: Partial<CommunityData>) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ data, onUpdate, onNext, onBack }) => {
  const [guidelinesText, setGuidelinesText] = useState(data.guidelines || "");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const MAX_CHARS = 500;
  const charCount = guidelinesText.length;
  const remainingChars = Math.max(0, MAX_CHARS - charCount);

  const wordCount = guidelinesText
    .split(" ")
    .filter((word) => word.length > 0).length;
  const remainingWords = Math.max(0, 65 - wordCount);

  const handleTextChange = (text: string) => {
    setGuidelinesText(text);
    onUpdate({ guidelines: text });
  };

  const badRef = useRef<ScrollView>(null);

  const handleBioFocus = () => {
    setTimeout(
      () => {
        badRef.current?.scrollTo({ y: 10000, animated: true });
      },
      Platform.OS === "ios" ? 250 : 350
    ); // adjust as needed
  };

  return (
    <TouchableWithoutFeedback>
      <SafeAreaView className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          // className="flex-1"
          // keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            {
              // flexGrow: 1,
            }
          }
          ref={badRef}
        >
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            className="ml-5 h-14 left-0 w-14  top-0  overflow-hidden border-white/30 border rounded-full bg-black/20 items-center justify-center z-20"
          >
            <BlurView style={[StyleSheet.absoluteFill]} />
            <Feather
              name="chevron-left"
              size={20}
              color="#fff"
              style={{ opacity: 0.7 }}
            />
          </TouchableOpacity>

          <View className="flex-1 mt-16 pb-14 px-3">
            <View className="rounded-[20px] px-8 py-8 overflow-hidden">
              <BlurView
                style={[StyleSheet.absoluteFill]}
                tint="light"
                intensity={28}
              />
              <Text className="text-white text-base font-sfpro-bold">
                Enter community guideline
              </Text>

              <TextInput
                value={guidelinesText}
                onChangeText={handleTextChange}
                // placeholder="Set rules and guidelines for your community members to follow..."
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                multiline
                textAlignVertical="top"
                className="text-white aspect-video text-base leading-6 "
                maxLength={500}
                onFocus={handleBioFocus}
              />

              <View className="flex-row justify-between items-center ">
                <View className="flex-row items-center ">
                  <Text className="text-[13px] font-neutral-regular mr-3 text-white/40">
                    {remainingChars} characters remaining
                  </Text>
                  {/* CircleProgress, pass charCount/MAX_CHARS */}
                  <CircleProgress
                    progress={Math.min(charCount / MAX_CHARS, 1)}
                  />
                </View>

                <TouchableOpacity
                  className="w-10 h-10  rounded-full justify-center items-center"
                  activeOpacity={0.8}
                  style={{
                    // If you want more shadow/subtle effect
                    shadowColor: "#F7F7F7",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.08,
                    shadowRadius: 2,
                    elevation: 1,
                  }}
                >
                  <Feather name="info" size={25} color="#f7f7f774" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
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
