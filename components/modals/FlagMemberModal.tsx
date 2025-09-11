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

type FlagMemberModalProps = {
  visible: boolean;
  member: {
    avatar: ImageSourcePropType;
    username: string;
    name: string;
  } | null;
  onClose: () => void;
};

type FlagState = "confirm" | "success";

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

const FlagMemberFlowModal: React.FC<FlagMemberModalProps> = ({
  visible,
  member,
  onClose,
}) => {
  const [flagState, setFlagState] = useState<FlagState>("confirm");
  const insets = useSafeAreaInsets();
  const HIDE_OFFSET = 300;
  const sheetY = useRef(new Animated.Value(HIDE_OFFSET)).current;

  useEffect(() => {
    if (visible) {
      setFlagState("confirm");
      sheetY.setValue(HIDE_OFFSET);
      Animated.timing(sheetY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setFlagState("confirm"), 300);
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

  if (!member) return null;

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
              {flagState !== "success" && (
                <DragToClose translateY={sheetY} onClose={onClose} />
              )}
              {flagState === "confirm" && (
                <View>
                  <Text className="text-white text-center text-[20px] font-bold mt-6">
                    @{member.username}
                  </Text>
                  <Text className="text-white/60 text-center text-[16px] font-normal mb-4">
                    {member.name}
                  </Text>
                  <View className="items-center mb-8">
                    <View
                      style={{
                        shadowColor: "#FFFFFF",
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.6,
                        shadowRadius: 20,
                        elevation: 10,
                        borderRadius: 999,
                      }}
                    >
                      <Image
                        source={member.avatar}
                        className="w-[160px] h-[160px] rounded-full"
                        resizeMode="cover"
                      />
                    </View>
                  </View>

                  <Text className="text-white text-center font-bold text-[22px] mb-2">
                    Flag member
                  </Text>
                  <Text className="text-white/50 text-center text-base px-7 mb-8">
                    Are you sure you want to {"\n"} flag this member?
                  </Text>
                  <View className="flex-row justify-between gap-3 px-4 mb-6">
                    <TouchableOpacity
                      className="flex-1 py-4 rounded-full bg-[#0368FF]"
                      activeOpacity={0.85}
                      onPress={() => setFlagState("success")}
                    >
                      <Text className="text-white font-bold text-[18px] text-center">
                        Flag
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 py-4 rounded-full bg-white/10"
                      activeOpacity={0.85}
                      onPress={closeWithSlide}
                    >
                      <Text className="text-white font-bold text-[18px] text-center">
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {/* Success State */}
              {flagState === "success" && (
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

export default FlagMemberFlowModal;
