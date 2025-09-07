import AIModal from "@/components/modals/AiModal";
import CreatePostStart from "@/components/modals/create-post-startup";
import FloatingAIButton from "@/components/museai/FloatingAiButton";
import ShrinkAnimation from "@/components/ui/ShrinkAnimation";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { BlurView } from "expo-blur";
import { Tabs, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
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
    name: "communities",
    title: "Communities",
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
function TabIcon({ focused, icon, title, isProfile, panHandlers }: any) {
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
      <View
        {...panHandlers} // 👈 swipe gestures on the icon
        className="w-14 h-14 overflow-hidden rounded-full"
      >
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
    <View
      {...panHandlers} // 👈 swipe gestures on the icon
      className="w-16 h-16 overflow-hidden rounded-full"
    >
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
            style={{ tintColor: focused ? "#151312" : "#ffffff" }}
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
  const { width, height } = Dimensions.get("window");
  const router = useRouter();
  const fabAnimated = useRef(new Animated.Value(0)).current;
  const [showAIModal, setShowAIModal] = useState(false);

  const fabScale = fabAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  useEffect(() => {
    Animated.timing(fabAnimated, {
      toValue: 1,
      duration: 600,
      delay: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const [showModal, setShowModal] = useState(false);

  return (
    <ShrinkAnimation onSwitch={() => console.log("Open community switcher")}>
      <View style={{ flex: 1 }}>
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
        <FloatingAIButton setShowAIModal={setShowAIModal} />

        <AIModal showAIModal={showAIModal} setShowAIModal={setShowAIModal} />
        <CreatePostStart
          showModal={showModal}
          onClose={() => setShowModal(false)}
        />
        <Animated.View
          style={{
            transform: [{ scale: fabScale }],
            position: "absolute",
            bottom: insets.bottom + 80,
            right: 10,
            zIndex: 1000,
          }}
        >
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            className="w-16 h-16   rounded-full items-center justify-center shadow-lg"
          >
            <Image source={images.muse} className="h-full w-full" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ShrinkAnimation>
  );
}
