import React, { useRef } from "react";
import { Animated, PanResponder, View } from "react-native";

export default function DragToClose({
  translateY,
  onClose,
}: {
  translateY: Animated.Value;
  onClose: () => void;
}) {
  const shineAnim = useRef(new Animated.Value(0)).current;

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,

      onPanResponderGrant: () => {
        console.log("👉 Drag started");

        // Animate to pure white
        Animated.timing(shineAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false, // color animation can’t use native driver
        }).start();
      },

      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },

      onPanResponderRelease: (_, g) => {
        // Animate back to faded
        Animated.timing(shineAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }).start();

        if (g.dy > 120) {
          Animated.timing(translateY, {
            toValue: 600,
            duration: 220,
            useNativeDriver: true,
          }).start(() => onClose());
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            bounciness: 6,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Interpolate shine effect
  const barColor = shineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255,255,255,0.3)", "rgba(255,255,255,1)"],
  });

  return (
    <View
      {...responder.panHandlers}
      className="w-full items-center py-4"
      style={{ minHeight: 40 }}
    >
      <Animated.View
        style={{
          width: 58,
          height: 4,
          borderRadius: 2,
          backgroundColor: barColor,
        }}
      />
    </View>
  );
}
