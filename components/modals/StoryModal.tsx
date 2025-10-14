import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get("window");
const USER_ITEM_WIDTH = 80;
const USER_ITEM_SPACING = 10;
const TOTAL_ITEM_WIDTH = USER_ITEM_WIDTH + USER_ITEM_SPACING;

interface StoryItem {
  id: number;
  uri: string;
  caption?: string;
}

interface StoryUser {
  id: number;
  name: string;
  avatar: string;
  items: StoryItem[];
}

interface StoryModalFullProps {
  visible: boolean;
  onClose: () => void;
  stories: StoryUser[];
  initialUserIndex?: number;
}

export default function StoryModalFull({
  visible,
  onClose,
  stories,
  initialUserIndex = 0,
}: StoryModalFullProps) {
  const insets = useSafeAreaInsets();
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const progress = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<any>(null);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const currentUser = stories[currentUserIndex];
  const currentStory = currentUser?.items[currentStoryIndex];

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!scrollViewRef.current) return;

      const xOffset =
        currentUserIndex * TOTAL_ITEM_WIDTH -
        screenWidth / 2 +
        TOTAL_ITEM_WIDTH / 2;

      const scrollInstance =
        scrollViewRef.current.getNode?.() || scrollViewRef.current;

      scrollInstance?.scrollTo?.({ x: xOffset, animated: true });
    }, 100);

    return () => clearTimeout(timeout);
  }, [currentUserIndex]);

  useEffect(() => {
    if (visible) {
      setCurrentUserIndex(initialUserIndex);
      setCurrentStoryIndex(0);
      progress.setValue(0);
    }
  }, [visible, initialUserIndex]);

  useEffect(() => {
    if (!currentUser) return;

    progress.setValue(0);

    const startAnimation = () => {
      animationRef.current = Animated.timing(progress, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      });

      animationRef.current.start(({ finished }) => {
        if (finished && !isPaused) {
          goToNextStory();
        }
      });
    };

    if (!isPaused) {
      startAnimation();
    }

    return () => {
      animationRef.current?.stop();
    };
  }, [currentStoryIndex, currentUserIndex, isPaused]);

  // --- Navigation ---
  const goToNextStory = () => {
    if (currentStoryIndex < currentUser.items.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else if (currentUserIndex < stories.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
      setCurrentStoryIndex(0);
    } else {
      onClose();
    }
  };

  const goToPreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else if (currentUserIndex > 0) {
      const prevUser = stories[currentUserIndex - 1];
      setCurrentUserIndex(currentUserIndex - 1);
      setCurrentStoryIndex(prevUser.items.length - 1);
    } else {
      progress.setValue(0);
    }
  };

  const handleUserPress = (index: number) => {
    if (index === currentUserIndex) {
      progress.setValue(0);
    } else {
      setCurrentUserIndex(index);
      setCurrentStoryIndex(0);
    }
  };

  const handlePressIn = () => {
    setIsPaused(true);
    animationRef.current?.stop();
  };

  const handlePressOut = () => {
    setIsPaused(false);
  };

  if (!currentUser) return null;

  const renderProgressBar = () => (
    <View
      style={{
        top: insets.top + 15,
        left: 20,
      }}
      className="absolute flex-row items-center justify-start z-20"
    >
      {currentUser.items.map((item, index) => {
        const isViewed = index < currentStoryIndex;
        const isActive = index === currentStoryIndex;

        const scale = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.25],
          extrapolate: "clamp",
        });

        const opacity = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={`${currentUser.id}-${item.id}-${index}`}
            style={{
              transform: isActive ? [{ scale }] : [],
              opacity: isActive ? opacity : 1,
              marginHorizontal: 6,
            }}
          >
            <BlurView
              intensity={40}
              tint="dark"
              style={{
                width: 18,
                height: 18,
                borderRadius: 9999,
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9999,
                  backgroundColor: isViewed
                    ? "white"
                    : isActive
                    ? "white"
                    : "rgba(255,255,255,0.3)",
                }}
              />
            </BlurView>
          </Animated.View>
        );
      })}
    </View>
  );

  const renderHeader = () => (
    <View
      style={{ top: insets.top + 50 }}
      className="absolute w-full px-4 flex-row items-center justify-between z-20"
    >
      <View className="flex-row items-center space-x-3 gap-2">
        <Image
          source={{ uri: currentUser.avatar }}
          className="w-10 h-10 rounded-full"
        />
        <Text className="text-white font-sfpro-bold text-[16px]">
          {currentUser.name}
        </Text>
      </View>
    </View>
  );

  const renderBottomUsers = () => (
    <Animated.ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true }
      )}
      contentContainerStyle={{
        paddingHorizontal: screenWidth / 2 - TOTAL_ITEM_WIDTH / 2,
        paddingBottom: insets.bottom + 20,
      }}
      className="absolute bottom-0 z-[9999]"
    >
      {stories.map((user, index) => {
        const inputRange = [
          (index - 2) * TOTAL_ITEM_WIDTH,
          (index - 1) * TOTAL_ITEM_WIDTH,
          index * TOTAL_ITEM_WIDTH,
          (index + 1) * TOTAL_ITEM_WIDTH,
          (index + 2) * TOTAL_ITEM_WIDTH,
        ];

        const translateY = scrollX.interpolate({
          inputRange,
          outputRange: [40, 15, 0, 15, 40],
          extrapolate: "clamp",
        });

        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.7, 0.85, 1, 0.85, 0.7],
          extrapolate: "clamp",
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.5, 0.7, 1, 0.7, 0.5],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={`user-${user.id}-${index}`}
            style={{
              width: TOTAL_ITEM_WIDTH,
              transform: [{ translateY }, { scale }],
              opacity,
            }}
            className="items-center"
          >
            <TouchableOpacity onPress={() => handleUserPress(index)}>
              <View className="items-center space-y-2">
                <Image
                  source={{ uri: user.avatar }}
                  className="w-20 h-20 rounded-full border-2"
                  style={{
                    borderColor:
                      currentUserIndex === index ? "#FFFFFF" : "transparent",
                  }}
                />
                <Text className="text-white/60 font-sfpro-bold text-[16px]">
                  {user.name}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </Animated.ScrollView>
  );

  const BottomBlurOverlay = () => (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 200 + insets.bottom,
        overflow: "hidden",
        zIndex: 3,
      }}
    >
      <MaskedView
        style={StyleSheet.absoluteFill}
        maskElement={
          <LinearGradient
            colors={["transparent", "black"]}
            locations={[0.2, 1]}
            style={StyleSheet.absoluteFill}
          />
        }
      >
        <BlurView
          tint="dark"
          intensity={100}
          style={{
            flex: 1,
            borderTopLeftRadius: 100,
            borderTopRightRadius: 100,
          }}
        />
      </MaskedView>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-primary">
        <ImageBackground
          source={{ uri: currentStory?.uri }}
          style={StyleSheet.absoluteFill}
          className="flex-1"
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.4)", "transparent", "rgba(0,0,0,0.6)"]}
            style={StyleSheet.absoluteFill}
          />

          {/* Close */}
          <View className="absolute top-12 right-3 bg-[#F3F3F326]/[15%] rounded-full z-[999]">
            <TouchableOpacity
              onPress={onClose}
              className="w-12 h-12 items-center justify-center"
            >
              <Ionicons name="close" size={23} color="white" />
            </TouchableOpacity>
          </View>

          {renderProgressBar()}
          {renderHeader()}

          <View className="flex-1 flex-row">
            <TouchableOpacity
              className="flex-1"
              onPress={goToPreviousStory}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            />
            <TouchableOpacity
              className="flex-1"
              onPress={goToNextStory}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            />
          </View>

          <View
            style={{ bottom: insets.bottom + 200 }}
            className="absolute w-full items-center px-6"
          >
            {currentStory?.caption && (
              <View className=" rounded-full overflow-hidden">
                <Text className="text-white text-[17px] font-sfpro-bold">
                  {currentStory.caption}
                </Text>
              </View>
            )}
          </View>

          <BottomBlurOverlay />
          {renderBottomUsers()}
        </ImageBackground>
      </View>
    </Modal>
  );
}
