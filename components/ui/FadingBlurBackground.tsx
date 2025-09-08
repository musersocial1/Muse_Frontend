// components/ui/FadingBlurBackground.tsx
import { BlurView } from "expo-blur";
import React from "react";
import { Animated, StyleSheet } from "react-native";

const AnimatedBlur = Animated.createAnimatedComponent(BlurView);

export function FadingBlurBackground({
  opacity,
}: {
  opacity: Animated.AnimatedInterpolation<number> | Animated.Value;
}) {
  return (
    <>
      <AnimatedBlur
        style={[StyleSheet.absoluteFillObject, { opacity }]}
        tint="dark"
        intensity={100}
        pointerEvents="none"
        experimentalBlurMethod="dimezisBlurView" // For Android
      />
    </>
  );
}
