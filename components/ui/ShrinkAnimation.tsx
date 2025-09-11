import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  StyleSheet,
  View,
} from "react-native";
import CommunitySwitcher from "../modals/CommunitySwitcher";
import CustomNavBar from "./CustomNavBar";

const { height } = Dimensions.get("window");

// --- Config ---
const GESTURE_ACTIVATION_THRESHOLD = 5; // Pixels to move before gesture activates
const RELEASE_THRESHOLD = 0; // Must drag 30% of ACTIVE_HEIGHT to open
const ACTIVE_HEIGHT = 70; // drag distance needed to trigger

export default function ShrinkAnimation({ children, onSwitch }: any) {
  const blurOpacity = useRef(new Animated.Value(0)).current;
  const switcherOpacity = useRef(new Animated.Value(0)).current;
  const [isMounted, setIsMounted] = useState(false);

  const isSwitcherOpen = useRef(false);
  const hasVibrated = useRef(false);

  const openSwitcher = () => {
    console.log("switercher is opened");
    if (isSwitcherOpen.current) return;
    isSwitcherOpen.current = true;
    hasVibrated.current = true;
    console.log("switercher is opened again on there");

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsMounted(true);

    // 👇 first finish the blur, then fade in switcher
    Animated.sequence([
      // Animated.timing(blurOpacity, {
      //   toValue: 1,
      //   duration: 250,
      //   easing: Easing.out(Easing.ease),
      //   useNativeDriver: true,
      // }),
      Animated.timing(switcherOpacity, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => onSwitch?.());
  };

  const closeSwitcher = () => {
    if (!isSwitcherOpen.current) return; // 👈 already closed
    isSwitcherOpen.current = false;
    hasVibrated.current = false; // 👈 reset for next drag

    Animated.parallel([
      Animated.timing(switcherOpacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(blurOpacity, {
        toValue: 0,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsMounted(false);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => {
        const { dx, dy } = g;
        return (
          Math.abs(dy) > Math.abs(dx) &&
          Math.abs(dy) > GESTURE_ACTIVATION_THRESHOLD
        );
      },
      onPanResponderMove: (_, g) => {
        setIsMounted(true);

        const dragDistance = Math.max(0, -g.dy);
        const progress = Math.min(dragDistance / ACTIVE_HEIGHT, 1);

        blurOpacity.setValue(progress);

        if (dragDistance >= ACTIVE_HEIGHT && !isSwitcherOpen.current) {
          openSwitcher(); // 👈 runs once
        }
      },

      onPanResponderRelease: (_, g) => {
        const dragDistance = Math.max(0, -g.dy);
        const progress = Math.min(dragDistance / ACTIVE_HEIGHT, 1);
        const isFlick = Math.abs(g.vy) > 0.5;

        if (!isSwitcherOpen.current) {
          if (progress > RELEASE_THRESHOLD || isFlick) {
            openSwitcher();
          } else {
            closeSwitcher();
          }
        }
        // else {
        //   closeSwitcher();
        // }
      },

      onPanResponderTerminate: () => {
        closeSwitcher();
      },
    })
  ).current;

  const enhancedChildren = React.cloneElement(children, {
    openSwitcher,
    closeSwitcher,
  });

  return (
    <View style={{ flex: 1 }} className=" bg-white">
      {enhancedChildren}
      <CustomNavBar panHandlers={panResponder.panHandlers} />

      {isMounted && (
        <>
          <Animated.View
            style={[StyleSheet.absoluteFill, { opacity: blurOpacity }]}
            className={" z-[1100] "}
          >
            <BlurView
              style={[StyleSheet.absoluteFill]}
              experimentalBlurMethod="dimezisBlurView"
              tint="dark"
              intensity={100}
              className=" flex-1 "
            />
          </Animated.View>
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                opacity: switcherOpacity,
              },
            ]}
            className={"z-[9999]"}
          >
            <CommunitySwitcher onClose={closeSwitcher} />
          </Animated.View>
        </>
      )}
    </View>
  );
}
