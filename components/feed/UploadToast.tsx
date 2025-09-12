import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Circle, Svg } from "react-native-svg";

type Props = {
  visible: boolean;
  progress: number; // 0..1
  title?: string; // e.g. "Uploading your posts"
  avatars?: string[]; // show up to 2
  onCancel?: () => void;
  onRequestClose?: () => void;
};

export default function UploadToast({
  visible,
  progress,
  title = "Uploading your posts",
  avatars = [],
  onCancel,
  onRequestClose,
}: Props) {
  // slide-up animation
  const slide = useRef(new Animated.Value(60)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slide, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(fade, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slide.setValue(60);
      fade.setValue(0);
    }
  }, [visible]);

  // progress ring calc
  const size = 42;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = useMemo(
    () => circumference * (1 - Math.min(Math.max(progress ?? 0, 0), 1)),
    [progress, circumference]
  );

  const percentLabel = `${Math.round((progress ?? 0) * 100)}%`;

  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ bottom: insets.bottom + 150 }}
      className="absolute z-[1000000]  left-0 right-0 justify-end items-center"
      pointerEvents="box-none"
    >
      <Animated.View
        className="w-[95%] max-w-[520px] rounded-full border-white/10 border overflow-hidden"
        style={{
          transform: [{ translateY: slide }],
          opacity: fade,
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 10,
        }}
      >
        {/* Background tint + blur */}
        <BlurView
          style={StyleSheet.absoluteFill}
          intensity={100}
          tint="dark"
          experimentalBlurMethod="dimezisBlurView"
        />

        {/* Content */}
        <View className="flex-row items-center  p-2.5">
          <View className="w-12 h-12  rounded-full overflow-hidden flex-row border-2 border-white/50 mr-2">
            {/* Left half */}
            <Image
              source={{ uri: avatars[0] }}
              className="w-1/2 h-full"
              resizeMode="cover"
            />
            {/* Right half */}
            <Image
              source={{ uri: avatars[1] }}
              className="w-1/2 h-full"
              resizeMode="cover"
            />
          </View>

          {/* Title */}
          <Text
            numberOfLines={1}
            className="flex-1 text-[white]/50 font-sfpro-medium text-[14px]"
          >
            {title}
          </Text>

          {/* Progress ring */}
          <View className="w-12 h-12 items-center justify-center ml-[10px]">
            <Svg width={size} height={size}>
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="rgba(255,255,255,0.18)"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#69E482"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                rotation={-90}
                originX={size / 2}
                originY={size / 2}
              />
            </Svg>

            <View className="absolute items-center justify-center">
              <Text className="text-white  text-[11px] font-sfpro-bold">
                {percentLabel}
              </Text>
            </View>
          </View>

          {/* Close */}
          <TouchableOpacity
            className=" rounded-full ml-2 items-center justify-center "
            onPress={onCancel}
          >
            <Ionicons name="close" size={22} color="#ffffff77" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
