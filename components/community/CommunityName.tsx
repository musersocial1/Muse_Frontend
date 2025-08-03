import { icons } from "@/constants/icons";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { CommunityData } from "@/types/community";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProgressBar from "./ProgressBar";

const CommunityNameScreen: React.FC<{
  data: CommunityData;
  onUpdate: (data: Partial<CommunityData>) => void;
  onNext: () => void;
}> = ({ data, onUpdate, onNext }) => {
  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#0368FF", "#703636", "#000000"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.background}
      />

      <TouchableOpacity
        className="absolute top-3 left-2 h-14 w-14 z-20"
        onPress={() => RouterConstantUtil.community.start}
      >
        <Image source={icons.back_2} className="h-14 w-14 opacity-50" />
      </TouchableOpacity>

      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <KeyboardAvoidingView
          className="flex-1 px-6"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
          {/* Main Content */}
          <View className="flex-1 justify-center items-center">
            <View className="w-full">
              <TextInput
                autoFocus
                editable={true}
                value={data.name}
                onChangeText={(text) => onUpdate({ name: text })}
                placeholder="Enter community name"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                className="bg-transparent border-none px-6 py-8 text-white text-[28px] font-bold text-center"
                cursorColor="#FFFFFF"
                style={styles.textInput}
                multiline={false}
                textAlign="center"
              />
            </View>
          </View>

          {/* Bottom Section */}
          <View className="pb-8">
            <ProgressBar currentStep={1} totalSteps={7} />

            <TouchableOpacity
              onPress={onNext}
              className="rounded-full py-4 mt-6"
              disabled={!data.name.trim()}
              style={[
                styles.continueButton,
                {
                  opacity: data.name.trim() ? 1 : 0.5,
                },
              ]}
            >
              <Text className="text-white text-lg font-semibold text-center">
                Save & Continue
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default CommunityNameScreen;

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  textInput: {
    lineHeight: 40,
    minHeight: 80,
    width: "100%",
  },
  continueButton: {
    backgroundColor: "#0368FF",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
