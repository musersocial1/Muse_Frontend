import { icons } from "@/constants/icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Image, View } from "react-native";
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
    name: "community",
    title: "Community",
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

  // If you want to animate a "shadow" on focus, you can add that too
  // (Optional: Uncomment the below for a shadow pop effect)
  // const shadowStyle = focused
  //   ? { shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }
  //   : {};

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
        className=" w-full h-full  "
        // style={[StyleSheet.absoluteFill, { borderRadius: 999 }]}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
            // ...shadowStyle,
          }}
          className={`w-full h-full rounded-full justify-center items-center border ${
            focused
              ? "bg-white border-white"
              : "bg-[#808080]/10 border-[#FFFFFF]/50"
          }`}
        >
          <Image
            source={icon}
            style={{ tintColor: focused ? "#151312" : "#ffffff" }} // <-- Use style prop for tintColor!
            className="w-[50%] h-fit"
            resizeMode="contain"
          />
        </Animated.View>
      </BlurView>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          height: 60,
          flex: 1,
        },
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          borderRadius: 30,
          marginHorizontal: 34,
          gap: 0,
          marginBottom: insets.bottom,
          height: 60,
          position: "absolute",
          borderWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          paddingHorizontal: 0,
        },
      }}
    >
      {tabsConfig.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={tab.icon}
                title={tab.title}
                isProfile={tab.isProfile}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
