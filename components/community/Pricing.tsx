import { images } from "@/constants/images";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useRef, useState } from "react";
import {
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
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
import ProgressiveBlur from "../ui/progressiveBlur";

interface PricingScreenProps {
  onClose: () => void;
}

const Pricing: React.FC<PricingScreenProps> = ({ onClose }) => {
  const [isPaidCommunity, setIsPaidCommunity] = useState(false);
  const [price, setPrice] = useState("0");
  const [displayValue, setDisplayValue] = useState("0");

  const priceInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleInputFocus = () => {
    setTimeout(
      () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      },
      Platform.OS === "ios" ? 250 : 350
    );
  };

  const formatPriceInput = (text: string) => {
    let clean = text.replace(/[^0-9]/g, "");
    clean = clean.replace(/^0+/, "");
    if (!clean) clean = "0";
    const formatted = Number(clean).toLocaleString();
    return formatted;
  };

  const handlePriceChange = (text: string) => {
    let clean = text.replace(/[^0-9]/g, "").replace(/^0+/, "");
    if (!clean) clean = "0";

    setDisplayValue(formatPriceInput(clean));
    setPrice(clean);
  };

  const handleSwitchChange = (val: boolean) => {
    setIsPaidCommunity(val);
    if (val) {
      setTimeout(() => priceInputRef.current?.focus(), 150);
    } else {
      priceInputRef.current?.blur?.();
      setPrice("0");
      setDisplayValue("0");
    }
  };

  const handleSave = () => {
    const pricingData = {
      isPaidCommunity,
      price: isPaidCommunity ? price : "0",
    };

    console.log("Saving pricing data:", pricingData);
    onClose();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View className="flex-1 bg-black rounded-3xl overflow-hidden">
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFillObject,
              {
                zIndex: 1,
                height: 1500,
              },
            ]}
          >
            <ProgressiveBlur useAlt={true} />
            <View className="w-full aspect-[1/3] rounded-3xl">
              <Image
                source={images.bg_2}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </Animated.View>

          <View
            style={{ paddingTop: insets.top + 16 }}
            className="flex-row relative items-center px-6 py-4 z-[200]"
          >
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
            className="flex-1 relative z-[100]"
          >
            <View className="px-6 mt-20">
              <View className="flex-row justify-between items-center mb-10">
                <Text className="text-white text-xl font-semibold">
                  Paid community
                </Text>
                <Switch
                  value={isPaidCommunity}
                  onValueChange={handleSwitchChange}
                  trackColor={{ false: "#767577", true: "#4ADE80" }}
                  thumbColor={isPaidCommunity ? "#ffffff" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                />
              </View>

              <View
                className="w-full items-center rounded-[30px] overflow-hidden"
                style={{ backgroundColor: "#1C1C1C" }}
              >
                <Text className="text-white/40 text-xl font-sfpro-bold py-5 pb-7 w-full text-center border-b border-b-white/5">
                  Enter pricing
                </Text>

                <TouchableOpacity
                  className="items-center py-20 w-full"
                  activeOpacity={1}
                  onPress={() => {
                    if (isPaidCommunity) {
                      priceInputRef.current?.focus();
                    }
                  }}
                >
                  <View className="flex-row items-center justify-center">
                    <Text className="text-white text-6xl font-sfpro-medium pt-2">
                      $
                    </Text>
                    <TextInput
                      ref={priceInputRef}
                      editable={isPaidCommunity}
                      onFocus={handleInputFocus}
                      onChangeText={handlePriceChange}
                      value={displayValue}
                      placeholder="0"
                      placeholderTextColor="white"
                      keyboardType="numeric"
                      className="text-white text-6xl font-sfpro-medium mt-4"
                      style={{
                        maxWidth: width * 0.6,
                        minWidth: 60,
                        textAlign: "left",
                        opacity: isPaidCommunity ? 1 : 0.4,
                        backgroundColor: "transparent",
                      }}
                      selectTextOnFocus={true}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{ height: 120 }} />
            </View>
          </ScrollView>

          <View
            className="px-6 pb-8 relative z-[200] "
            style={{
              paddingBottom: Math.max(insets.bottom, 20) + 16,
            }}
          >
            <TouchableOpacity
              onPress={handleSave}
              className="rounded-full bg-[#0368FF] py-4"
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

export default Pricing;
