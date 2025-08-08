import { CommunityData } from "@/types/community";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const [hasFocused, setHasFocused] = useState(false);

  const { width, height } = useWindowDimensions();

  const insets = useSafeAreaInsets();

  const badRef = useRef<ScrollView>(null);

  const handleBioFocus = () => {
    setTimeout(
      () => {
        badRef.current?.scrollTo({ y: 10000, animated: true });
      },
      Platform.OS === "ios" ? 250 : 350
    ); // adjust as needed
  };

  const [displayValue, setDisplayValue] = useState(
    formatPriceInput(data.price || "0")
  );

  useEffect(() => {
    // Sync display if data.price changes outside this component
    setDisplayValue(formatPriceInput(data.price || "0"));
  }, [data.price]);

  // Call this when the user types
  const handlePriceChange = (text: string) => {
    // Remove all non-digits and leading zeros
    let clean = text.replace(/[^0-9]/g, "").replace(/^0+/, "");
    if (!clean) clean = "0";
    setDisplayValue(formatPriceInput(clean));
    // Save raw value to data
    onUpdate({ price: clean });
  };
  // Helper: Remove leading zeros, non-digits, format with commas, always ".00"
  function formatPriceInput(text: string) {
    // Remove all non-digits
    let clean = text.replace(/[^0-9]/g, "");

    // Remove leading zeros
    clean = clean.replace(/^0+/, "");
    // If empty, treat as 0
    if (!clean) clean = "0";

    // Format with commas
    const formatted = Number(clean).toLocaleString();

    // Always show ".00"
    return formatted;
  }

  // Helper: Extract only digits, for saving to db (if needed)
  function unformatPriceInput(text: string) {
    return text.replace(/[^0-9]/g, "").replace(/^0+/, "") || "0";
  }

  return (
    <TouchableWithoutFeedback>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top }}
        ref={badRef}
      >
        <View className=" pb-12 gap-[5rem] flex-col flex relative">
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
          <View className="flex-row  justify-between items-center px-6 mt-[8rem]">
            <Text className="text-white text-xl font-semibold">
              Paid community
            </Text>
            <Switch
              value={isPaidCommunity}
              onValueChange={(val) => {
                setIsPaidCommunity(val);
                onUpdate({ isPaidCommunity: val });
                if (val) {
                  // Focus the input when switching ON
                  setTimeout(() => priceInputRef.current?.focus(), 150); // Add a slight delay so the UI is ready
                } else {
                  // Blur the input when switching OFF
                  priceInputRef.current?.blur?.();
                }
              }}
              trackColor={{ false: "#767577", true: "#4ADE80" }}
              thumbColor={isPaidCommunity ? "#ffffff" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
          <View className="flex-1 px-6">
            <View className="w-full items-center  bg-[#1C1C1C]  rounded-[30px]">
              <Text className="text-white/40 border-b border-b-white/5 text-xl font-sfpro-bold py-5 w-full text-center">
                Enter pricing
              </Text>

              <TouchableOpacity
                className="items-center py-20"
                activeOpacity={1}
              >
                <View className="flex-row  items-center justify-center ">
                  <Text className="text-white leading-[62px]   text-6xl font-sfpro-medium ">
                    $
                  </Text>
                  <TextInput
                    ref={priceInputRef}
                    editable={isPaidCommunity}
                    onFocus={handleBioFocus}
                    onChangeText={handlePriceChange}
                    value={displayValue}
                    placeholder="0"
                    placeholderTextColor="white"
                    keyboardType="numeric"
                    className="text-white  leading-[62px] text-6xl font-sfpro-medium "
                    style={{
                      maxWidth: width * 0.7,
                      // minHeight: 70,
                      textAlign: "left",
                      opacity: isPaidCommunity ? 1 : 0.4,
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default PricingScreen;
