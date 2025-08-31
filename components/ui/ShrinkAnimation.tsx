import CommunitySwitcher from "@/components/community/CommunitySwitcher";
import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  View,
} from "react-native";

const { height } = Dimensions.get("window");

export default function ShrinkAnimation({ children, onSwitch }: any) {
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const switcherTranslateY = useRef(new Animated.Value(height)).current;

  // Expose an "open" function so TabsLayout or children can trigger programmatically
  const openSwitcher = () => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 0.85,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 60,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(switcherTranslateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => onSwitch?.());
  };

  const closeSwitcher = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
      Animated.spring(overlayOpacity, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.spring(switcherTranslateY, {
        toValue: height,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Gesture handlers stay the same…
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_, g) => g.y0 > height - 120,
      onMoveShouldSetPanResponder: (_, g) =>
        g.y0 > height - 120 && Math.abs(g.dy) > 10,

      onPanResponderMove: (_, g) => {
        const progress = Math.min(Math.max(-g.dy / height, 0), 1);
        scale.setValue(1 - progress * 0.15);
        translateY.setValue(progress * 60);
        overlayOpacity.setValue(progress);
        switcherTranslateY.setValue(height * (1 - progress));
      },

      onPanResponderRelease: (_, g) => {
        if (g.dy < -100) {
          openSwitcher();
        } else {
          closeSwitcher();
        }
      },
    })
  ).current;

  // Inject control props into children
  const enhancedChildren = React.cloneElement(children, {
    openSwitcher,
    closeSwitcher,
    panHandlers: panResponder.panHandlers, // 👈 add this
  });

  // inside ShrinkAnimation return
  return (
    <View style={{ flex: 1 }}>
      {/* Switcher */}
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          transform: [{ translateY: switcherTranslateY }],
        }}
      >
        <CommunitySwitcher />
      </Animated.View>

      {/* Dim background */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: "rgba(0,0,0,0.5)", opacity: overlayOpacity },
        ]}
      />

      {/* Tabs */}
      <Animated.View
        style={{
          flex: 1,
          transform: [{ scale }, { translateY }],
          borderRadius: overlayOpacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 20],
          }),
          overflow: "hidden",
        }}
      >
        {enhancedChildren}
      </Animated.View>
    </View>
  );
}
