import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CircleProgress from "../ui/CircleProgress";

interface CommunityGuidelinesScreenProps {
  onClose: () => void;
}

const CommunityGuidelines: React.FC<CommunityGuidelinesScreenProps> = ({
  onClose,
}) => {
  const [guidelinesText, setGuidelinesText] = useState("");
  const insets = useSafeAreaInsets();

  const MAX_CHARS = 500;
  const charCount = guidelinesText.length;
  const remainingChars = Math.max(0, MAX_CHARS - charCount);

  const wordCount = guidelinesText
    .split(" ")
    .filter((word) => word.length > 0).length;
  const remainingWords = Math.max(0, 65 - wordCount);

  const scrollViewRef = useRef<ScrollView>(null);

  const handleTextChange = (text: string) => {
    setGuidelinesText(text);
  };

  const handleTextInputFocus = () => {
    setTimeout(
      () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      },
      Platform.OS === "ios" ? 250 : 350
    );
  };

  const handleSave = () => {
    const guidelinesData = {
      guidelines: guidelinesText,
      wordCount: wordCount,
      charCount: charCount,
    };

    console.log("Saving guidelines data:", guidelinesData);
    onClose();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const showGuidelinesInfo = () => {
    console.log("Guidelines info requested");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View className="flex-1 bg-primary rounded-3xl overflow-hidden">
          <View className="flex-row relative  items-center px-6 py-4 ">
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              className="h-14 w-14 overflow-hidden border-white/30 border rounded-full bg-black/20 items-center justify-center"
            >
              <BlurView style={[StyleSheet.absoluteFill]} />
              <Feather
                name="chevron-left"
                size={20}
                color="#fff"
                style={{ opacity: 0.7 }}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
            className="flex-1 relative z-[200]"
          >
            <View className="px-5 mt-20">
              <View className="rounded-[20px] px-8 py-8 overflow-hidden">
                <BlurView
                  style={[StyleSheet.absoluteFill]}
                  tint="light"
                  intensity={10}
                />

                <Text className="text-white text-base font-sfpro-bold mb-4">
                  Enter community guideline
                </Text>

                <TextInput
                  value={guidelinesText}
                  onChangeText={handleTextChange}
                  placeholder="Set rules and guidelines for your community members to follow..."
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  multiline
                  textAlignVertical="top"
                  className="text-white text-base leading-6 min-h-[200px] mb-4"
                  maxLength={500}
                  onFocus={handleTextInputFocus}
                  style={{
                    backgroundColor: "transparent",
                  }}
                />

                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <Text className="text-[13px] font-neutral-regular mr-3 text-white/40">
                      {remainingChars} characters remaining
                    </Text>
                    <CircleProgress
                      progress={Math.min(charCount / MAX_CHARS, 1)}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={showGuidelinesInfo}
                    className="w-10 h-10 rounded-full justify-center items-center"
                    activeOpacity={0.8}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      shadowColor: "#F7F7F7",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.08,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  >
                    <Feather
                      name="info"
                      size={20}
                      color="rgba(255, 255, 255, 0.7)"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="mt-6 px-4">
                <Text className="text-white/60 text-sm leading-5 text-center">
                  Guidelines help create a positive environment for your
                  community members. Be clear about what's acceptable and what
                  isn't.
                </Text>
              </View>

              {/* <View style={{ height: 120 }} /> */}
            </View>
          </ScrollView>

          <View
            className="px-6 pb-8 relative z-[200]"
            style={{
              paddingBottom: Math.max(insets.bottom, 20) + 16,
              // backgroundColor: "rgba(21, 17, 21, 0.95)",
            }}
          >
            <TouchableOpacity
              onPress={handleSave}
              className="rounded-full py-5"
              style={{ backgroundColor: "#0368FF" }}
              activeOpacity={0.8}
            >
              <Text className="text-white text-xl font-sfpro-bold text-center">
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default CommunityGuidelines;
