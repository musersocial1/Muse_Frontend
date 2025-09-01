import React, { useRef } from "react";
import { Animated, PanResponder, TouchableOpacity, View } from "react-native";

export default function DragToClose({ onClose }: { onClose: () => void }) {
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          // drag down enough → close
          onClose();
        } else {
          // reset back if not enoughly  dragged lolll
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={{ transform: [{ translateY }] }}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity onPress={onClose} className="items-center py-4">
        <View className="w-12 h-1 bg-white/30 rounded-full" />
      </TouchableOpacity>
    </Animated.View>
  );
}
