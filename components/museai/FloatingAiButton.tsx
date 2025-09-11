import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

const FloatingAIButton = ({
  setShowAIModal,
}: {
  setShowAIModal: (val: boolean) => void;
}) => {
  const insets = useSafeAreaInsets();
  const { height: SCREEN_H } = Dimensions.get("window");

  const BUTTON_HEIGHT = 75;

  const TOP_LIMIT = insets.top + 20;
  const BOTTOM_LIMIT = SCREEN_H - BUTTON_HEIGHT - insets.bottom;

  // Absolute Y (in pixels from top). Start at 40% of screen height.
  const y = useRef(new Animated.Value(SCREEN_H * 0.4)).current;

  // Keep the last committed Y here so we never read from Animated during move
  const startYRef = useRef(SCREEN_H * 0.4);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_e, g) => Math.abs(g.dy) > 2,
      onPanResponderTerminationRequest: () => false,

      onPanResponderGrant: () => {
        // Get the *current* animated value once at the start (safe & fast)
        // stopAnimation returns the current value in the callback.
        y.stopAnimation((val) => {
          startYRef.current = typeof val === "number" ? val : startYRef.current;
        });

        // Haptic feedback (don’t block the UI thread)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      },

      onPanResponderMove: (_e, g) => {
        // Follow finger exactly: startY + deltaY, then clamp
        const next = clamp(startYRef.current + g.dy, TOP_LIMIT, BOTTOM_LIMIT);
        y.setValue(next);
      },

      onPanResponderRelease: (_e, g) => {
        const finalY = clamp(startYRef.current + g.dy, TOP_LIMIT, BOTTOM_LIMIT);
        startYRef.current = finalY; // commit new position

        // Smooth settle (very gentle)
        Animated.spring(y, {
          toValue: finalY,
          useNativeDriver: true,
          speed: 18,
          bounciness: 2,
        }).start();
      },

      onPanResponderTerminate: (_e, g) => {
        // Gesture cancelled — settle where it is
        const finalY = clamp(startYRef.current + g.dy, TOP_LIMIT, BOTTOM_LIMIT);
        startYRef.current = finalY;
        Animated.spring(y, {
          toValue: finalY,
          useNativeDriver: true,
          speed: 18,
          bounciness: 2,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        position: "absolute",
        right: 0, // stick to the right edge
        zIndex: 1000,
        transform: [{ translateY: y }],
      }}
      // makes it easier to grab
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <TouchableOpacity
        onPress={() => setShowAIModal(true)}
        activeOpacity={0.9}
        style={{
          width: 25,
          height: BUTTON_HEIGHT,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderTopLeftRadius: 9,
          borderBottomLeftRadius: 9,
          justifyContent: "center",
          paddingLeft: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
        className="overflow-hidden"
      >
        <BlurView
          style={StyleSheet.absoluteFill}
          intensity={50}
          experimentalBlurMethod="dimezisBlurView"
          tint={"light"}
        />
        <View
          style={{
            width: 4,
            height: 28,
            backgroundColor: "white",
            borderRadius: 2,
            alignSelf: "flex-start",
          }}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default FloatingAIButton;
