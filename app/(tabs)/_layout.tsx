import CreatePostStart from "@/components/modals/create-post-startup";
import ShrinkAnimation from "@/components/ui/ShrinkAnimation";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics"; // 👈 add this
import { Tabs, usePathname, useRouter } from "expo-router";
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
          experimentalBlurMethod="dimezisBlurView"
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

export default function TabsLayout({ panHandlers }: any) {
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

  // OPEN flow
  const openPost = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    setShowModal(true);
    // grow back
    Animated.timing(fabScale, {
      toValue: 0,
      useNativeDriver: true,
      duration: 1000,
      delay: 100, // 👈 wait 500ms before starting
      easing: Easing.out(Easing.back(1.7)), // 👈 overshoot pop effect
    }).start();
  };

  // CLOSE flow (from modal ✕)
  const handleModalRequestClose = () => {
    setShowModal(false);

    // grow back
    Animated.timing(fabScale, {
      toValue: 1,
      useNativeDriver: true,
      duration: 400,
      delay: 50, // 👈 wait 500ms before starting
      easing: Easing.out(Easing.back(1.7)), // 👈 overshoot pop effect
    }).start();
  };

  const [showCommunities, setShowCommunities] = useState(true);
  // const navigation = useNavigation();
  const pathname = usePathname(); // 👈 current route path

  const router = useRouter();
  return (
    <ShrinkAnimation onSwitch={() => console.log("Open community switcher")}>
      <View style={{ flex: 1 }} className="">
        <Tabs
          screenOptions={{
            headerShown: false, // 👈 hide the "home" title header
            tabBarStyle: { display: "none" }, // 👈 this kills the white strip
            tabBarShowLabel: false,
            tabBarItemStyle: {
              justifyContent: "center",
              alignItems: "center",
              height: 0,
              flex: 1,
            },
            // tabBarStyle: {
            //   // backgroundColor: "transparent",
            //   // borderTopWidth: 0,
            //   // borderRadius: 30,
            //   marginHorizontal: 34,
            //   // gap: 0,
            //   marginBottom: insets.bottom,
            //   height: 0,
            //   position: "absolute",
            //   // borderWidth: 0,
            //   // elevation: 0,
            //   // shadowOpacity: 0,
            //   // paddingHorizontal: 0,
            // },
          }}
        />
        {/* {tabsConfig.map((tab) => (
            <Tabs.Screen
              key={tab.name}
              name={tab.name}
              options={{
                tabBarIcon: () => null, // 👈 disables icons + triangles
                // title: tab.title,
                headerShown: false,
                // tabBarIcon: ({ focused }) => (
                //   <TabIcon
                //     focused={focused}
                //     icon={tab.icon}
                //     title={tab.title}
                //     isProfile={tab.isProfile}
                //   />
                // ),
              }}
            />
          ))}
        </Tabs> */}

        {/* Now build your own bar */}
        {/* <View
          style={{ bottom: insets.bottom + 5, marginHorizontal: 34 }}
          // pointerEvents="none"
          {...panHandlers} // 👈 attach PanResponder to nav bar container
          className="absolute h-[60px] gap-3  left-[0px] right-[0px] flex-row justify-center "
        >
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
        </View> */}

        {/* Transparent modal layered above, content opacity controlled via prop */}

        {/* <CommunitySwitcher
          visible={showCommunities}
          onClose={() => setShowCommunities(false)}
        /> */}

        {showModal && (
          <CreatePostStart
            showModal={showModal}
            onClose={handleModalRequestClose}
          />
        )}
        <Animated.View
          style={{
            // transform: [{ scale: fabScale }],
            transform: [{ scale: fabScale }],
            position: "absolute",
            bottom: insets.bottom + 80,
            right: 10,
            // opacity: fabOpacity, // 👈 fade effect
            zIndex: 1000,
          }}
        >
          <TouchableOpacity
            ref={fabRef}
            // onPress={() => setShowModal(true)}
            onPress={openPost}
            activeOpacity={100}
            className="w-16 h-16   rounded-full items-center justify-center shadow-lg"
          >
            <Image source={images.postIcon} className="h-full w-full" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ShrinkAnimation>
  );
}
