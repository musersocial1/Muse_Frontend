import { icons } from "@/constants/icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageSourcePropType,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DragToClose from "../navigations/DragToClose";
import { FadingBlurBackground } from "../ui/FadingBlurBackground";

type FlagPostModalProps = {
  visible: boolean;
  post: {
    image: ImageSourcePropType;
    description: string;
  } | null;
  onClose: () => void;
};
type FlagState = "reason" | "submitted";

const FLAG_REASONS = [
  "+18 Contents",
  "Harmful language",
  "Stolen content",
  "Dont want to see post",
  "Not age appropiate",
  "Hate speech",
];

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
          className="h-full w-full"
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );
};

const FlagPostFlowModal: React.FC<FlagPostModalProps> = ({
  visible,
  post,
  onClose,
}) => {
  const [flagState, setFlagState] = useState<FlagState>("reason");
  const [selected, setSelected] = useState<number>(0);
  const insets = useSafeAreaInsets();
  const HIDE_OFFSET = 300;
  const sheetY = useRef(new Animated.Value(HIDE_OFFSET)).current;

  useEffect(() => {
    if (visible) {
      setFlagState("reason");
      setSelected(0);
      sheetY.setValue(HIDE_OFFSET);
      Animated.timing(sheetY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setFlagState("reason"), 300);
      sheetY.setValue(HIDE_OFFSET);
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

  if (!post) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1">
        <TouchableOpacity
          activeOpacity={1}
          style={StyleSheet.absoluteFill}
          onPress={closeWithSlide}
        >
          <FadingBlurBackground opacity={blurOpacity} />
        </TouchableOpacity>
        <View
          pointerEvents="box-none"
          style={{ marginBottom: insets.bottom }}
          className="flex-1 pb-3 px-3 items-center justify-end"
        >
          <Animated.View
            style={{
              transform: [{ translateY: sheetY }],
              width: "100%",
            }}
            className="w-full max-w-lg"
          >
            <View className="bg-[#231f1e]/90 w-full border border-white/10 rounded-[38px] overflow-hidden">
              {flagState !== "submitted" && (
                <DragToClose translateY={sheetY} onClose={onClose} />
              )}
              {/* Reason Selection */}
              {flagState === "reason" && (
                <View className="pb-5">
                  <Text className="text-white text-center text-[22px] font-bold mb-7 mt-6">
                    Reason for flagging post
                  </Text>
                  <View className="mb-7 px-5 ">
                    {FLAG_REASONS.map((reason, idx) => (
                      <TouchableOpacity
                        key={reason}
                        className={`flex-row items-center px-5 py-5 mb-2 bg-white/5 rounded-2xl `}
                        activeOpacity={0.9}
                        onPress={() => setSelected(idx)}
                      >
                        <Text
                          className={`text-[17px] font-semibold flex-1 ${
                            selected === idx ? "text-white" : "text-white/60"
                          }`}
                        >
                          {reason}
                        </Text>
                        <View
                          className={`w-6 h-6 rounded-full border-2 ${
                            selected === idx
                              ? "border-white bg-transparent"
                              : "bg-white/10 border-white/5"
                          } items-center justify-center`}
                        >
                          {selected === idx && (
                            <View className="w-3 h-3 rounded-full bg-white" />
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TouchableOpacity
                    className="bg-[#0368FF] mx-3 mb-2 rounded-full py-5"
                    activeOpacity={0.9}
                    onPress={() => setFlagState("submitted")}
                  >
                    <Text className="text-white text-[17px] font-semibold text-center">
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Submission Success */}
              {flagState === "submitted" && (
                <View className="items-center py-12">
                  <SuccessIcon />
                  <Text className="text-white font-bold text-[21px] mb-6 text-center">
                    Flagging request submitted
                  </Text>
                  <TouchableOpacity
                    className="w-full max-w-[90%] mx-auto py-4 rounded-full bg-white/10 mt-2"
                    onPress={closeWithSlide}
                    activeOpacity={0.8}
                  >
                    <Text className="text-white text-[18px] font-bold text-center">
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

export default FlagPostFlowModal;
