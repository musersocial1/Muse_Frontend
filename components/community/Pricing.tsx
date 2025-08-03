import { icons } from "@/constants/icons";
import { CommunityData } from "@/types/community";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ProgressBar from "./ProgressBar";

const PricingScreen: React.FC<{
  data: CommunityData;
  onUpdate: (data: Partial<CommunityData>) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ data, onUpdate, onNext, onBack }) => {
  const [isPaidCommunity, setIsPaidCommunity] = useState(
    data?.isPaidCommunity ?? false
  );
  const priceInputRef = useRef<TextInput>(null);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (isPaidCommunity && priceInputRef.current) {
      priceInputRef.current.focus();
    }
  }, [isPaidCommunity]);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        className="flex-1 bg-primary"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
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
          locations={[0, 0.4, 0.7, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientOverlay}
        />

        <SafeAreaView className="flex-1">
          <TouchableOpacity
            className="absolute top-4 left-4 z-30 w-12 h-12 rounded-full justify-center items-center"
            onPress={onBack}
          >
            <Image source={icons.back_3} className="h-14 w-14 opacity-90" />
          </TouchableOpacity>

          <View className="flex-row justify-between items-center px-6 mt-[7rem]">
            <Text className="text-white text-xl font-semibold">
              Paid community
            </Text>
            <Switch
              value={isPaidCommunity}
              onValueChange={(val) => {
                setIsPaidCommunity(val);
                onUpdate({ isPaidCommunity: val });
              }}
              trackColor={{ false: "#767577", true: "#4ADE80" }}
              thumbColor={isPaidCommunity ? "#ffffff" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
            />
          </View>

          <View className="flex-1 px-6">
            <ScrollView
              showsVerticalScrollIndicator={false}
              className="flex-1"
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 120 }}
            >
              <View className="flex-1 justify-center items-center h-60 bg-[#1C1C1C] mt-[10rem] rounded-[40px]">
                <Text className="text-white/40 text-xl font-medium pb-2">
                  Enter pricing
                </Text>
                <View className="border-[1px] w-full border-white/20 mb-16" />

                <TouchableOpacity className="items-center" activeOpacity={1}>
                  <View className="flex-row items-center justify-center ml-20">
                    <Text className="text-white text-6xl font-bold ">$</Text>
                    <TextInput
                      ref={priceInputRef}
                      editable={isPaidCommunity}
                      value={data.price || "0"}
                      onChangeText={(text) =>
                        onUpdate({ price: text.replace(/[^0-9]/g, "") })
                      }
                      placeholder="0"
                      placeholderTextColor="white"
                      keyboardType="numeric"
                      className="text-white text-6xl font-bold "
                      style={{
                        minWidth: 120,
                        minHeight: 70,
                        textAlign: "left",
                        opacity: isPaidCommunity ? 1 : 0.4,
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View className="pb-0 px-2">
              <ProgressBar currentStep={4} totalSteps={6} />
              <TouchableOpacity
                onPress={onNext}
                className="bg-secondary rounded-full py-5 items-center mt-2"
                disabled={!isPaidCommunity}
                style={{ opacity: isPaidCommunity ? 1 : 0.5 }}
              >
                <Text className="text-white text-lg font-semibold">
                  Save & Continue
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

export default PricingScreen;
