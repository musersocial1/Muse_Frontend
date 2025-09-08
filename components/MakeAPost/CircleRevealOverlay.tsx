// components/MakeAPost/CircleRevealOverlay.tsx
import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Dimensions, StyleSheet } from "react-native";

type Point = { x: number; y: number };
type Mode = "expand" | "shrink";

interface Props {
  visible: boolean;
  origin: Point | null;
  color?: string;
  duration?: number;
  mode?: Mode; // 👈 new
  onDone?: () => void;
}

export default function CircleRevealOverlay({
  visible,
  origin,
  color = "#121212",
  duration = 450,
  mode = "expand",
  onDone,
}: Props) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get("window");

  // const { width, height } = Dimensions.get("window");

  const { radius, top, left } = useMemo(() => {
    // if origin not provided, default to extreme right-center INSIDE the screen
    const forcedOrigin = origin ?? { x: width - 1, y: height / 2 };

    const dTL = Math.hypot(forcedOrigin.x - 0, forcedOrigin.y - 0);
    const dTR = Math.hypot(forcedOrigin.x - width, forcedOrigin.y - 0);
    const dBL = Math.hypot(forcedOrigin.x - 0, forcedOrigin.y - height);
    const dBR = Math.hypot(forcedOrigin.x - width, forcedOrigin.y - height);

    const maxR = Math.max(dTL, dTR, dBL, dBR);

    return {
      radius: maxR,
      top: forcedOrigin.y - maxR,
      left: forcedOrigin.x - maxR,
    };
  }, [origin, width, height]);

  useEffect(() => {
    if (!visible || !origin) return;

    if (mode === "expand") {
      opacity.setValue(0);
      scale.setValue(0.01);
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(scale, { toValue: 1, duration, useNativeDriver: true }),
      ]).start(({ finished }) => finished && onDone?.());
    } else {
      // shrink
      opacity.setValue(1);
      scale.setValue(1);
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 0.01,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => finished && onDone?.());
    }
  }, [visible, origin, mode, duration, onDone, opacity, scale]);

  if (!visible || !origin) return null;

  const size = radius * 2;

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { opacity }]}
    >
      <Animated.View
        style={{
          position: "absolute",
          top,
          left,
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: color,
          transform: [{ scale }],
        }}
      />
    </Animated.View>
  );
}
