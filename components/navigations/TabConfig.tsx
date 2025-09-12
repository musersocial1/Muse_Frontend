import { icons } from "@/constants/icons";
import { BlurView } from "expo-blur";
import { useEffect, useRef } from "react";
import { Animated, Image, View } from "react-native";

export const tabsConfig = [
  { name: "home", title: "Home", icon: icons.home, isProfile: false },
  { name: "search", title: "Search", icon: icons.search, isProfile: false },
  {
    name: "community",
    title: "Community",
    icon: icons.asana,
    isProfile: false,
  },
  { name: "group", title: "Groups", icon: icons.star, isProfile: false },
  { name: "profile", title: "Profile", icon: icons.user, isProfile: true },
];

export function TabIcon({ focused, icon, title, isProfile }: any) {
  const scaleValue = useRef(new Animated.Value(focused ? 1.05 : 1)).current;
  const opacityValue = useRef(new Animated.Value(focused ? 1 : 0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: focused ? 1.1 : 1,
        useNativeDriver: true,
        tension: 120,
        friction: 8,
      }),
      Animated.timing(opacityValue, {
        toValue: focused ? 1 : 0.7,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  if (isProfile) {
    return (
      <View className="w-14 h-14 overflow-hidden rounded-full">
        <BlurView
          intensity={70}
          tint={focused ? "extraLight" : "dark"}
          className="w-full h-full"
          experimentalBlurMethod="dimezisBlurView"
        >
          <Animated.View
            style={{
              transform: [{ scale: scaleValue }],
              opacity: opacityValue,
            }}
            className="w-14 h-14 rounded-full overflow-hidden"
          >
            <Image source={icon} className="w-full h-full" resizeMode="cover" />
          </Animated.View>
        </BlurView>
      </View>
    );
  }

  return (
    <View className="w-16 h-16 overflow-hidden rounded-full">
      <BlurView
        intensity={70}
        tint={focused ? "extraLight" : "dark"}
        className="w-full h-full"
        experimentalBlurMethod="dimezisBlurView"
      >
        <Animated.View
          style={{ transform: [{ scale: scaleValue }], opacity: opacityValue }}
          className={`w-full h-full rounded-full justify-center items-center border ${
            focused
              ? "bg-white border-white"
              : "bg-[#808080]/10 border-[#FFFFFF]/50"
          }`}
        >
          <Image
            source={icon}
            style={{ tintColor: focused ? "#151312" : "#ffffff" }}
            className="w-[50%] h-fit"
            resizeMode="contain"
          />
        </Animated.View>
      </BlurView>
    </View>
  );
}
