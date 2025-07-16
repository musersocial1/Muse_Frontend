import { icons } from "@/constants/icons";
import { Tabs } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Image } from "react-native";

function TabIcon({ focused, icon, title, isProfile }: any) {
  const scaleValue = useRef(new Animated.Value(focused ? 1.1 : 1)).current;
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
      <Animated.View
        style={{
          transform: [{ scale: scaleValue }],
          opacity: opacityValue,
          // ...shadowStyle,
        }}
        className="w-16 h-16 rounded-full overflow-hidden"
      >
        <Image source={icon} className="w-full h-full" resizeMode="cover" />
      </Animated.View>
    );
  }

  // Regular tabs - icon in circle
  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleValue }],
        opacity: opacityValue,
        // ...shadowStyle,
      }}
      className={`w-16 h-16 rounded-full justify-center items-center border-2 ${
        focused
          ? "bg-white border-white"
          : "bg-[#808080]/50 border-[#FFFFFF]/50"
      }`}
    >
      <Image
        source={icon}
        style={{ tintColor: focused ? "#151312" : "#ffffff" }} // <-- Use style prop for tintColor!
        className="w-6 h-6"
        resizeMode="contain"
      />
    </Animated.View>
  );
}

export default function TabsLayout() {
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
          marginHorizontal: 10,
          marginBottom: 36,
          height: 60,
          position: "absolute",
          borderWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          paddingHorizontal: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.home}
              title="Home"
              isProfile={false}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.search}
              title="Search"
              isProfile={false}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.asana}
              title="Community"
              isProfile={false}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="group"
        options={{
          title: "Group",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.star}
              title="Groups"
              isProfile={false}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.user}
              title="Profile"
              isProfile={true}
            />
          ),
        }}
      />
    </Tabs>
  );
}
