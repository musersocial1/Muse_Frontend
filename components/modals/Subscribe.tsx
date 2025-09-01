import { icons } from "@/constants/icons";
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

interface SubscriptionFlowProps {
  visible: boolean;
  onClose: () => void;
  onPay: (selectedPlan: string) => void;
}

type PaymentState = "subscriptions" | "processing" | "success";

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

const PlanSelector: React.FC<{
  selectedPlan: "monthly" | "annually";
  onPlanChange: (plan: "monthly" | "annually") => void;
}> = ({ selectedPlan, onPlanChange }) => {
  return (
    <View className="flex-row bg-[#272727] rounded-full p-1 w-[130px] h-[42px]">
      <TouchableOpacity
        onPress={() => onPlanChange("monthly")}
        className={`flex-1 justify-center items-center rounded-full ${
          selectedPlan === "monthly" ? "bg-[#353535]" : ""
        }`}
        activeOpacity={0.8}
      >
        <Text
          className={`text-sm font-medium ${
            selectedPlan === "monthly" ? "text-white" : "text-gray-400"
          }`}
        >
          Monthly
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onPlanChange("annually")}
        className={`flex-1 justify-center items-center rounded-full ${
          selectedPlan === "annually" ? "bg-[#353535]" : ""
        }`}
        activeOpacity={0.8}
      >
        <Text
          className={`text-sm font-medium ${
            selectedPlan === "annually" ? "text-white" : "text-gray-400"
          }`}
        >
          Annually
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const SubscriptionFlow: React.FC<SubscriptionFlowProps> = ({
  visible,
  onClose,
  onPay,
}) => {
  const [paymentState, setPaymentState] =
    useState<PaymentState>("subscriptions");
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annually">(
    "monthly"
  );

  useEffect(() => {
    if (!visible) {
      setTimeout(() => setPaymentState("subscriptions"), 300);
    }
  }, [visible]);

  const handlePayment = async () => {
    setPaymentState("processing");

    try {
      await onPay(selectedPlan);
      // Simulate payment processing
      setTimeout(() => {
        setPaymentState("success");

        // Auto-transition to subscription after success
        setTimeout(() => {
          setPaymentState("subscriptions");
        }, 2000);
      }, 3000);
    } catch (error) {
      console.log("error occured");
    } finally {
      console.log("on finish");
    }
  };

  const handleCancel = () => {
    if (paymentState === "processing") {
      setPaymentState("subscriptions");
    } else {
      onClose();
    }
  };

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
          <View className="px-6 py-8">
            <Text className="text-white text-[28px] font-bold text-center mb-8">
              Subscribe
            </Text>

            <View className="mb-8 bg-[#00000040]/[25%] rounded-[30px] p-6 flex-row items-center justify-between">
              <View>
                <Text className="text-gray-400 text-[16px]">Monthly plan</Text>
                <Text className="text-white text-[28px] font-bold">
                  $100.00
                </Text>
              </View>

              <PlanSelector
                selectedPlan={selectedPlan}
                onPlanChange={setSelectedPlan}
              />
            </View>

            <TouchableOpacity
              onPress={handlePayment}
              className="bg-[#0368FF] rounded-full py-5 mb-4"
              activeOpacity={0.8}
            >
              <Text className="text-white text-center text-[18px] font-bold">
                Continue
              </Text>
            </TouchableOpacity>
          </View>
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
              <View className="bg-[#1E1E1E] rounded-[40px] overflow-hidden mb-[10vw]">
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

export default SubscriptionFlow;
