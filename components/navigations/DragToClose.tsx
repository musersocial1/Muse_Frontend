import React from "react";
import { Animated, View } from "react-native";

export default function DragToClose({ translateY, onClose }: any) {
  return (
    <View className="w-full items-center py-4" style={{ minHeight: 40 }}>
      <Animated.View
        style={{
          width: 58,
          height: 4,
          borderRadius: 2,
        }}
        className={`bg-white/30`}
      />
    </View>
  );
}
