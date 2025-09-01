import { icons } from "@/constants/icons";
import { LongFormContent } from "@/types/community";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DragToClose from "../navigations/DragToClose";

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
            <Text className="text-white text-[18px] font-bold text-center mb-6">
              Locked content
            </Text>

            <View className="px-6 mb-6">
              <View className="relative rounded-2xl overflow-hidden mb-4">
                <Image
                  source={{ uri: content.thumbnail }}
                  style={{
                    width: "100%",
                    height: 160,
                  }}
                  resizeMode="cover"
                  className="rounded-2xl"
                />

                {/* Blur overlay */}
                <BlurView
                  intensity={15}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 16,
                  }}
                />

                {/* Play button overlay */}
                <View className="absolute inset-0 items-center justify-center">
                  <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center border border-white/30">
                    <Feather name="lock" size={20} color="white" />
                  </View>
                </View>

                {/* Duration */}
                <View className="absolute bottom-3 right-3 bg-black/60 rounded-lg px-2 py-1">
                  <Text className="text-white text-[12px] font-medium">
                    {content.duration}
                  </Text>
                </View>
              </View>

              <Text className="text-gray-300 text-center text-[15px]">
                {content.title}
              </Text>
            </View>

            <View className="bg-[#38383857]/30 m-2 rounded-3xl">
              <Text className="text-white text-center text-[17px] font-bold pb-1 pt-8">
                This content is locked and
              </Text>
              <Text className="text-white text-center text-[17px] font-bold mb-5">
                costs ${content.price} to open
              </Text>
              <View className="px-6 pb-2">
                <TouchableOpacity
                  onPress={() => handlePayment(content)}
                  className="bg-[#0368FF] rounded-full py-5 mb-4"
                  activeOpacity={0.8}
                >
                  <Text className="text-white text-center text-[16px] font-bold">
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
      <View className="flex-1 bg-black/50">
        <View className="flex-1 justify-end">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <View className="w-[90vw] max-w-[400px]">
              <View className="bg-[#1E1E1E] rounded-3xl overflow-hidden mb-[6vw]">
                {paymentState !== "processing" &&
                  paymentState !== "success" && (
                    <DragToClose onClose={onClose} />
                  )}

                {renderContent()}
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
};

export default PaymentFlow;
