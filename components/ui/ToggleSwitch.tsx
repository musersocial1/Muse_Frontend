import React, { useEffect, useRef } from "react";
import { Animated, Platform, Pressable } from "react-native";

export default function ToggleSwitch({
  value,
  onChange,
  width = 48,
  height = 28,
  activeColor = "#0368FF",
  inactiveColor = "#4B5563",
  disabled = false,
}: any) {
  // For animation between on/off
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const circleSize = height - 6;
  const padding = 3;

  // Interpolations for position and color
  const circlePosition = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [padding, width - circleSize - padding],
  });

  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor],
  });

  return (
    <Pressable
      onPress={() => !disabled && onChange(!value)}
      disabled={disabled}
      style={{
        width,
        height,
        justifyContent: "center",
        opacity: disabled ? 0.2 : 1,
      }}
      hitSlop={10}
    >
      {/* Track */}
      <Animated.View
        style={{
          backgroundColor: trackColor,
          borderRadius: height / 2,
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      />
      {/* Thumb */}
      <Animated.View
        style={{
          position: "absolute",
          left: circlePosition,
          width: circleSize,
          height: circleSize,
          borderRadius: circleSize / 2,
          backgroundColor: "#fff",
          elevation: Platform.OS === "android" ? 3 : 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.18,
          shadowRadius: 2,
        }}
      />
    </Pressable>
  );
}
