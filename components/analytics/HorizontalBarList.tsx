import React from "react";
import { View, Text } from "react-native";

interface Item {
  label: string;
  value: number;
  color: string;
}

export default function HorizontalBarList({
  items,
  maxValue,
  showAxis = false,
}: {
  items: Item[];
  maxValue: number;
  showAxis?: boolean;
}) {
  return (
    <View>
      {items.map((item, idx) => {
        const pct = (item.value / (maxValue || 1)) * 100;

        return (
          <View key={idx} className="mb-4">
            <View className="flex-row items-center justify-between mb-1">
              <Text
                className="text-white/90"
                style={{ fontFamily: "SFProDisplay-Medium" }}
              >
                {item.label}
              </Text>
              <View className="px-2 py-1 rounded-md" style={{ backgroundColor: "#222" }}>
                <Text
                  className="text-white/85 text-[12px]"
                  style={{ fontFamily: "SFProDisplay-Semibold" }}
                >
                  {item.value.toLocaleString()}
                </Text>
              </View>
            </View>
            <View className="w-full h-3 rounded-full bg-[#2A2A2A] overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{ width: `${pct}%`, backgroundColor: item.color }}
              />
            </View>
            {showAxis ? (
              <View className="flex-row justify-between mt-2">
                {[0, 2, 4, 6, 8, 10].map((t) => (
                  <Text
                    key={t}
                    className="text-white/35 text-[10px]"
                    style={{ fontFamily: "SFProDisplay-Regular" }}
                  >
                    {t === 0 ? "0" : `${t}K`}
                  </Text>
                ))}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}