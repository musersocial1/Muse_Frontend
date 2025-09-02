import { icons } from "@/constants/icons";
import { LongFormContent } from "@/types/community";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DragToClose from "../navigations/DragToClose";
import { FadingBlurBackground } from "../ui/FadingBlurBackground";

const { width } = Dimensions.get("window");

interface PaymentFlowProps {
  visible: boolean;
  content: LongFormContent | null;
  onClose: () => void;
  onPay: (content: LongFormContent) => void;
}

type PaymentState = "initial" | "processing" | "success";

const LoadingRing: React.FC = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const bubble = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.2, // expand
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.7, // fade a bit
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1, // shrink back
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1, // full opacity again
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    bubble.start();
    return () => bubble.stop();
  }, []);

  return (
    <View className="items-center justify-center mb-8">
      <Animated.Image
        source={icons.bubbling}
        style={{
          width: 110,
          height: 110,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }}
        resizeMode="contain"
      />
    </View>
  );
};

// Success Icon Component
const SuccessIcon: React.FC = () => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
      }}
      className="items-center justify-center mb-8"
    >
      <View className="relative h-[180px] w-[180px]">
        <Image
          source={icons.done}
          className="h-full w-full "
          resizeMode="cover"
        />
      </View>
    </Animated.View>
  );
};

const PaymentFlow: React.FC<PaymentFlowProps> = ({
  visible,
  content,
  onClose,
  onPay,
}) => {
  const [paymentState, setPaymentState] = useState<PaymentState>("initial");

  useEffect(() => {
    if (!visible) {
      setTimeout(() => setPaymentState("initial"), 300);
    }
  }, [visible]);

  const handlePayment = async (content: LongFormContent) => {
    setPaymentState("processing");

    setTimeout(() => {
      setPaymentState("success");

      setTimeout(() => {
        onClose();
      }, 2000);
    }, 3000);
  };

  const handleCancel = () => {
    if (paymentState === "processing") {
      setPaymentState("initial");
    } else {
      onClose();
    }
  };
  const insets = useSafeAreaInsets();
  const HIDE_OFFSET = 300; // how far we start below

  // Shared translateY for the sheet
  const sheetY = useRef(new Animated.Value(HIDE_OFFSET)).current;

  // Animate sheet up when opening
  useEffect(() => {
    if (visible) {
      sheetY.setValue(HIDE_OFFSET);
      Animated.timing(sheetY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      sheetY.setValue(HIDE_OFFSET);
    }
  }, [visible]);

  // Blur opacity follows sheet position (down → fade out)
  const blurOpacity = sheetY.interpolate({
    inputRange: [0, HIDE_OFFSET],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  // Optional programmatic close (slide down then onClose)
  const closeWithSlide = () => {
    Animated.timing(sheetY, {
      toValue: HIDE_OFFSET,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => onClose());
  };

  if (!content) return null;

  const renderContent = () => {
    switch (paymentState) {
      case "processing":
        return (
          <View className="items-center py-8 bg-[#121212CC]">
            <LoadingRing />
            <Text className="text-white text-[24px] font-bold mb-8">
              Processing payment
            </Text>
            <TouchableOpacity
              onPress={handleCancel}
              className="py-5 px-8 bg-[#1E1E1E] rounded-full w-full max-w-[340px] mx-auto"
              activeOpacity={0.8}
            >
              <Text className="text-white text-[18px] font-bold text-center">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        );

      case "success":
        return (
          <View className="items-center py-8 bg-[#121212CC]">
            <SuccessIcon />
            <Text className="text-white text-[24px] font-bold mb-8">
              Payment successful
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="py-5 px-8 bg-[#1E1E1E] rounded-full w-full max-w-[340px] mx-auto text-center"
              activeOpacity={0.8}
            >
              <Text className="text-white text-[18px] font-bold text-center">
                Done
              </Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return (
          <>
            <Text className="text-white text-[18px] font-sfpro-bold text-center mb-6">
              Locked content
            </Text>

            <View className="px-6 mb-6">
              <View className="relative rounded-[13px] overflow-hidden mb-2">
                <Image
                  source={{ uri: content.thumbnail }}
                  style={{
                    width: "100%",
                    height: 160,
                  }}
                  blurRadius={10}
                  resizeMode="cover"
                  className="rounded-[13px] "
                />

                {/* Blur overlay */}

                {/* Play button overlay */}

                <View className="absolute inset-0 items-center justify-center">
                  <View className="w-20 h-20 rounded-full items-center justify-center  overflow-hidden border-white border-2">
                    <BlurView
                      style={StyleSheet.absoluteFill}
                      tint="light"
                      intensity={80}
                      className=" rounded-full"
                    />
                    <View className="w-10  h-10 rounded-full  items-center justify-center">
                      <Image
                        source={icons.lockedContent}
                        alt="icons"
                        className="w-full "
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                </View>

                {/* Duration */}
                <View className="absolute bottom-3 right-3 bg-black/60 rounded-lg px-2 py-1">
                  <Text className="text-white text-[12px] font-medium">
                    {content.duration}
                  </Text>
                </View>
              </View>

              <Text className="text-white/50 font-sfpro-medium text-center text-sm">
                {content.title}
              </Text>
            </View>

            <View className="bg-[#38383857]/30  p-3 m-2 rounded-[25px]">
              <Text className="text-white text-center   text-lg leading-6 font-sfpro-bold pb-6 pt-6 ">
                This content is locked and {"\n"} costs ${content.price} to open
              </Text>
              <View className=" pb-2">
                <TouchableOpacity
                  onPress={() => handlePayment(content)}
                  className="bg-[#0368FF] w-full rounded-full py-5 "
                  activeOpacity={0.8}
                >
                  <Text className="text-white text-center text-[16px] font-sfpro-bold">
                    Pay ${content.price} to unlock
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 ">
        {/* Blur that fades with drag */}
        <TouchableOpacity
          activeOpacity={1}
          style={StyleSheet.absoluteFill}
          onPress={closeWithSlide}
        >
          <FadingBlurBackground opacity={blurOpacity} />
        </TouchableOpacity>
        <View
          pointerEvents="box-none" // 👈 lets touches reach children
          style={{ marginBottom: insets.bottom }}
          className="flex-1 pb-3 px-3  items-center justify-end"
        >
          <Animated.View
            style={{
              transform: [{ translateY: sheetY }],
              width: "100%",
            }}
            className="w-full max-w-lg"
          >
            <View className="bg-[#1D1D1C]  w-full  border border-white/10  rounded-[30px] overflow-hidden ">
              {paymentState !== "processing" && paymentState !== "success" && (
                <DragToClose translateY={sheetY} onClose={onClose} />
              )}

              {renderContent()}
            </View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

export default PaymentFlow;
