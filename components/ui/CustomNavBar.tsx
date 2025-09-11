import { icons } from "@/constants/icons";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { BlurView } from "expo-blur";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

import { Animated, Easing, Image, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabsConfig = [
  {
    name: "home",
    title: "Home",
    icon: icons.home,
    isProfile: false,
  },
  {
    name: "search",
    title: "Search",
    icon: icons.search,
    isProfile: false,
  },
  {
    name: "exclusiveContent",
    title: "exclusiveContent",
    icon: icons.asana,
    isProfile: false,
  },
  {
    name: "group",
    title: "Groups",
    icon: icons.star,
    isProfile: false,
  },
  {
    name: "profile",
    title: "Profile",
    icon: icons.user,
    isProfile: true,
  },
];
function TabIcon({ focused, icon, title, isProfile }: any) {
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
          intensity={70} // Change for more/less blur
          tint={focused ? "extraLight" : "dark"}
          className=" w-full h-full  "
          // style={[StyleSheet.absoluteFill, { borderRadius: 999 }]}
        >
          <Animated.View
            style={{
              transform: [{ scale: scaleValue }],
              opacity: opacityValue,
              // ...shadowStyle,
            }}
            className="w-14 h-14 rounded-full overflow-hidden"
          >
            <Image source={icon} className="w-full h-full" resizeMode="cover" />
          </Animated.View>
        </BlurView>
      </View>
    );
  }

  // Regular tabs - icon in circle
  return (
    <View className="w-16 h-16 overflow-hidden rounded-full">
      <BlurView
        intensity={70} // Change for more/less blur
        tint={focused ? "extraLight" : "dark"}
        className=" w-full h-full   "
        experimentalBlurMethod="dimezisBlurView" // For Android
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
          }}
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

export default function CustomNavBar({ panHandlers }: any) {
  const insets = useSafeAreaInsets();

  const fabRef = useRef<View>(null);

  // start from 0 so it animates in on mount
  const fabScale = useRef(new Animated.Value(0)).current;
  const [showModal, setShowModal] = useState(false);

  // default mount animation
  useEffect(() => {
    Animated.timing(fabScale, {
      toValue: 1,
      useNativeDriver: true,
      duration: 500,
      delay: 800, // 👈 wait 500ms before starting
      easing: Easing.out(Easing.back(1.7)), // 👈 overshoot pop effect
    }).start();
  }, []);

  // const navigation = useNavigation();
  const pathname = usePathname(); // 👈 current route path

  const router = useRouter();
  console.log(panHandlers);
  return (
    <View
      style={{ paddingBottom: insets.bottom + 5, marginHorizontal: 0 }}
      // pointerEvents="none"
      {...panHandlers} // 👈 spread here
      className="absolute  bottom-0 gap-3   px-[34px]  pb-[100px] left-[0px] right-[0px] flex-row justify-center "
    >
      {/* {tabsConfig.map((tab) => (
            <TouchableOpacity
              key={tab.name}
              // onPress={() => router.push(`/${tab.name}`)} // 👈 navigate manually
            >
              <TabIcon
                // focused={router.pathname === `/${tab.name}`} // 👈 check active
                icon={tab.icon}
                title={tab.title}
                isProfile={tab.isProfile}
              />
            </TouchableOpacity>
          ))} */}

      {tabsConfig.map((tab) => {
        const route =
          RouterConstantUtil.tabs[
            tab.name as keyof typeof RouterConstantUtil.tabs
          ];
        // const focused = pathname === route;
        const focused = `/(tabs)${pathname}` === route;

        return (
          <TouchableOpacity
            key={tab.name}
            activeOpacity={100}
            onPress={() => router.replace(route)} // 👈 navigates to /(tabs)/name
          >
            <TabIcon
              focused={focused}
              icon={tab.icon}
              title={tab.title}
              isProfile={tab.isProfile}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
