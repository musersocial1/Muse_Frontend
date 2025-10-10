import React from "react";
import { View } from "react-native";

export default function StackedBar({
  segments,
  height = 16,
  radius = 8,
}: {
  segments: { color: string; value: number }[];
  height?: number;
  radius?: number;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;

  return (
    <View
      className="w-full overflow-hidden"
      style={{ height, borderRadius: radius, backgroundColor: "#2A2A2A" }}
    >
      <View className="flex-row w-full h-full">
        {segments.map((s, i) => {
          const flexValue = s.value / total;
          return (
            <View
              key={i}
              style={{
                flex: flexValue,
                backgroundColor: s.color,
              }}
            />
          );
        })}
      </View>
    </View>
  );
}