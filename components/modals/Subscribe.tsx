import { icons } from "@/constants/icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DragToClose from "../navigations/DragToClose";
import { FadingBlurBackground } from "../ui/FadingBlurBackground";

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
    <View className="flex-row bg-[#272727]  rounded-full p-1 w-[130px] h-[35px]">
      <TouchableOpacity
        onPress={() => onPlanChange("monthly")}
        className={`flex-1 justify-center items-center rounded-full ${
          selectedPlan === "monthly" ? "bg-[#353535]" : ""
        }`}
        activeOpacity={0.8}
      >
        <Text
          className={`text-xs font-sfpro-medium ${
            selectedPlan === "monthly" ? "text-white" : "text-white/50"
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
          className={`text-xs font-sfpro-medium ${
            selectedPlan === "annually" ? "text-white" : "text-white/50"
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
    // switch ("processing") {
    switch (paymentState) {
      case "processing":
        return (
          <View className="items-center p-6 ">
            <LoadingRing />
            <Text className="text-white text-2xl font-sfpro-bold mb-8">
              Processing payment
            </Text>
            <TouchableOpacity
              onPress={handleCancel}
              className="py-5 px-8 bg-[#121212CC] rounded-full w-full max-w-lg mx-auto"
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
          <View className="items-center p-6">
            <SuccessIcon />
            <Text className="text-white text-2xl font-sfpro-bold mb-8">
              Payment successful
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="py-5 px-8 bg-[#121212CC] rounded-full w-full max-w-lg text-center"
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
          <View className="p-5  gap-8">
            <Text className="text-white text-2xl font-sfpro-bold text-center ">
              Subscribe
            </Text>

            <View className=" bg-[#00000040]/[25%] rounded-[20px] p-4 flex-row items-center justify-between">
              <View>
                <Text className="text-white/50 text-lg font-sfpro-medium">
                  Monthly plan
                </Text>
                <Text className="text-white  font-sfpro-bold">$100.00</Text>
              </View>

              <PlanSelector
                selectedPlan={selectedPlan}
                onPlanChange={setSelectedPlan}
              />
            </View>

            <TouchableOpacity
              onPress={handlePayment}
              className="bg-[#0368FF] rounded-full py-5"
              activeOpacity={0.8}
            >
              <Text className="text-white text-center text-base font-sfpro-bold">
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  const insets = useSafeAreaInsets();

  // get full device height
  const SCREEN_HEIGHT = 400;

  // instead of hardcoding 700
  const HIDE_OFFSET = SCREEN_HEIGHT;
  const sheetY = useRef(new Animated.Value(HIDE_OFFSET)).current;

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
      setTimeout(() => {
        setTimeout(() => setPaymentState("subscriptions"), 300);
      }, 300);
    }
  }, [visible]);

  const blurOpacity = sheetY.interpolate({
    inputRange: [0, HIDE_OFFSET],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const closeWithSlide = () => {
    Animated.timing(sheetY, {
      toValue: HIDE_OFFSET,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,

      onPanResponderMove: (_, g) => {
        if (g.dy > 0) sheetY.setValue(g.dy);
      },

      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          Animated.timing(sheetY, {
            toValue: 600,
            duration: 220,
            useNativeDriver: true,
          }).start(() => onClose());
        } else {
          Animated.spring(sheetY, {
            toValue: 0,
            bounciness: 6,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1 ">
        {/* animated blur */}
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
            {...responder.panHandlers}
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

export default SubscriptionFlow;
