import { icons } from "@/constants/icons";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  SafeAreaView,
  Text,
  View,
} from "react-native";

const DoneCreating: React.FC = () => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const breathingAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.3,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    const rotationAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    breathingAnimation.start();
    rotationAnimation.start();

    const timeout = setTimeout(() => {
      router.replace(RouterConstantUtil.tabs.home as any);
    }, 5000);

    return () => {
      breathingAnimation.stop();
      rotationAnimation.stop();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-1 justify-center items-center px-8">
        <Image source={icons.person_morph} />

        <Text className="text-white text-2xl font-semibold text-center">
          Creating community
        </Text>

        <View className="flex-row space-x-1 mt-4">
          <LoadingDot delay={0} />
          <LoadingDot delay={200} />
          <LoadingDot delay={400} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const LoadingDot: React.FC<{ delay: number }> = ({ delay }) => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Start with delay
    const timeout = setTimeout(() => {
      pulseAnimation.start();
    }, delay);

    return () => {
      clearTimeout(timeout);
      pulseAnimation.stop();
    };
  }, [delay]);

  return (
    <Animated.View
      className="w-2 h-2 rounded-full bg-white"
      style={{ opacity: fadeAnim }}
    />
  );
};

export default DoneCreating;
