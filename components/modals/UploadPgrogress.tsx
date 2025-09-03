import { icons } from "@/constants/icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DragToClose from "../navigations/DragToClose";
import { FadingBlurBackground } from "../ui/FadingBlurBackground";

interface UploadProgress {
  visible: boolean;
  onClose: () => void;
}

const UploadProgressModal: React.FC<UploadProgress> = ({
  visible,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const HIDE_OFFSET = 300;
  const sheetY = useRef(new Animated.Value(HIDE_OFFSET)).current;
  const [state, setState] = useState<"posting" | "done">("posting");

  const progressAnim = useRef(new Animated.Value(0)).current;

  const blurOpacity = sheetY.interpolate({
    inputRange: [0, HIDE_OFFSET],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  useEffect(() => {
    if (visible) {
      // slide up
      sheetY.setValue(HIDE_OFFSET);
      Animated.timing(sheetY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();

      progressAnim.setValue(0);

      // animate bar for 7 seconds
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 7000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(() => {
        setState("done");
      });
    } else {
      sheetY.setValue(HIDE_OFFSET);
      setTimeout(() => setState("posting"), 300);
    }
  }, [visible]);

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

  const closeWithSlide = () => {
    Animated.timing(sheetY, {
      toValue: HIDE_OFFSET,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => onClose());
  };

  // progress bar style
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const Posting = () => {
    return (
      <View className="items-center p-6">
        <LoadingRing />
        <Text className="text-white text-2xl font-sfpro-bold mb-8">
          Posting...
        </Text>
        {/* Progress Bar */}
        <View className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <Animated.View
            style={{
              width: progressWidth,
              height: "100%",
              backgroundColor: "#0368FF",
            }}
          />
        </View>
      </View>
    );
  };

  const Done = () => {
    return (
      <View className="items-center p-6">
        <SuccessIcon />
        <Text className="text-white text-2xl font-sfpro-bold mb-8">
          Post successful
        </Text>
        <TouchableOpacity
          onPress={onClose}
          className="py-5 px-8 bg-[#0368FF] rounded-full w-full max-w-lg text-center"
          activeOpacity={0.8}
        >
          <Text className="text-white text-[18px] font-bold text-center">
            Done
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1">
      <TouchableOpacity
        activeOpacity={1}
        style={StyleSheet.absoluteFill}
        onPress={closeWithSlide}
      >
        <FadingBlurBackground opacity={blurOpacity} />
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
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
            <View className="bg-[#1D1D1C] w-full border border-white/10 rounded-[30px] overflow-hidden">
              <DragToClose translateY={sheetY} onClose={onClose} />
              {state === "posting" ? Posting() : Done()}
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default UploadProgressModal;
