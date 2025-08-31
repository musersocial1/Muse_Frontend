// components/ui/CustomTabBar.tsx
import { useSwitcher } from "@/context/SwitcherContext";
import React, { useRef } from "react";
import { PanResponder, View } from "react-native";

export default function CustomTabBar({ state, descriptors, navigation }: any) {
  const { openSwitcher, closeSwitcher } = useSwitcher();

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 10,
      onPanResponderRelease: (_, g) => {
        if (g.dy < -50) {
          openSwitcher(); // swipe up
        } else if (g.dy > 50) {
          closeSwitcher(); // swipe down
        }
      },
    })
  ).current;

  return (
    <View
      {...panResponder.panHandlers}
      style={{
        flexDirection: "row",
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 30,
        marginHorizontal: 34,
        marginBottom: 20,
        height: 60,
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        return (
          <View
            key={route.key}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            {options.tabBarIcon({
              focused: isFocused,
              color: isFocused ? "white" : "gray",
              size: 24,
            })}
          </View>
        );
      })}
    </View>
  );
}
