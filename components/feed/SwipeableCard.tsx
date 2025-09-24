// SwipeableCard.tsx - Horizontal-only swipe with smooth height animation
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { View } from "react-native-animatable";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width - 15;
const GAP_SIZE = 20;

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  style?: any;
  onGestureStateChange?: (isActive: boolean) => void;
  disabled?: boolean;
  onSwipeProgress?: (progress: number, isActive: boolean) => void;
  index: number;
  activeSwipeIndex: any;
}

export default function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  style,
  onGestureStateChange,
  disabled = false,
  onSwipeProgress,
  index,
  activeSwipeIndex,
}: SwipeableCardProps) {
  // Add rotation animation value and height state
  const scrollRotation = useRef(new Animated.Value(0)).current;
  const [initialHeight, setInitialHeight] = useState<number | null>(null);
  const [currentHeight, setCurrentHeight] = useState<number | null>(null);

  // Add state to track if we should auto-return to center
  const [shouldReturnToCenter, setShouldReturnToCenter] = useState(false);
  const isScrollingRef = useRef(false);
  const [hasTriggeredSwipe, setHasTriggeredSwipe] = useState(false);

  // Convert children to array for FlatList and create 3-item array
  const childrenArray = React.Children.toArray(children);
  const threeItemArray = [
    <View style={{ width: ITEM_WIDTH }} />, // 1st item: empty space
    <View style={{ width: ITEM_WIDTH }}>{childrenArray}</View>, // 2nd item: main children
    <View style={{ width: ITEM_WIDTH }} />, // 3rd item: empty space
  ];

  const insets = useSafeAreaInsets();

  // Add these refs and threshold at the top of your component:
  const hasVibratedLeftRef = useRef(false);
  const hasVibratedRightRef = useRef(false);
  const scrollThreshold = width * 0.5;
  const flatListRef = useRef<ScrollView>(null);

  // Enhanced scroll handler with rotation and height animation
  const handleScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const centerPosition = ITEM_WIDTH + GAP_SIZE; // Account for gap in center position

    // Calculate distance from center for rotation
    const distanceFromCenter = scrollX - centerPosition;

    // Calculate rotation progress (-1 to 1, where -1 is full left, 1 is full right)
    const maxScrollDistance = width * 0.8; // Maximum distance for full rotation
    const rotationProgress = Math.max(
      -1,
      Math.min(1, distanceFromCenter / maxScrollDistance)
    );

    // Update rotation animation value
    scrollRotation.setValue(rotationProgress);

    // Calculate height based on absolute rotation progress
    if (initialHeight !== null) {
      const absoluteRotationProgress = Math.abs(rotationProgress);
      // Height goes from initialHeight to 0 as rotation increases
      const heightProgress = Math.max(0, 1 - absoluteRotationProgress * 1.2); // 1.2 for slightly faster collapse
      const newHeight = initialHeight * heightProgress;
      setCurrentHeight(newHeight);
    }

    // Existing vibration logic with auto-scroll
    const absoluteDistance = Math.abs(distanceFromCenter);
    if (absoluteDistance > scrollThreshold && !hasTriggeredSwipe) {
      // Determine direction
      const isScrollingLeft = scrollX < centerPosition;
      const isScrollingRight = scrollX > centerPosition;

      // Vibrate and auto-scroll when threshold is crossed
      if (isScrollingLeft && !hasVibratedLeftRef.current) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        hasVibratedLeftRef.current = true;
        hasVibratedRightRef.current = false;
        setHasTriggeredSwipe(true);

        // Auto-scroll to left item (index 0)

        if (Platform.OS == "android") {
          flatListRef.current?.scrollTo({
            x: (ITEM_WIDTH + GAP_SIZE) * 0, // index 0 → left
            animated: true,
          });
        }

        // Call swipe callback after a short delay
        setTimeout(() => {
          onSwipeLeft?.();
        }, 10);
      } else if (isScrollingRight && !hasVibratedRightRef.current) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        hasVibratedRightRef.current = true;
        hasVibratedLeftRef.current = false;
        setHasTriggeredSwipe(true);

        // Auto-scroll to right item (index 2)
        if (Platform.OS == "android") {
          flatListRef.current?.scrollTo({
            x: (ITEM_WIDTH + GAP_SIZE) * 2, // index * item width
            animated: true,
          });
        }

        // Call swipe callback after a short delay
        setTimeout(() => {
          onSwipeRight?.();
        }, 10);
      }
    } else if (absoluteDistance <= scrollThreshold) {
      // Reset vibration flags when back within threshold
      hasVibratedLeftRef.current = false;
      hasVibratedRightRef.current = false;
    }
  };

  // Reset rotation and height when scroll ends
  const handleScrollEnd = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const centerPosition = ITEM_WIDTH + GAP_SIZE;

    // Only scroll back to center if no swipe was triggered
    if (!hasTriggeredSwipe && Platform.OS == "android") {
      flatListRef.current?.scrollTo({
        x: ITEM_WIDTH + GAP_SIZE, // center position
        animated: true,
      });
    }

    // Reset swipe trigger flag
    setHasTriggeredSwipe(false);

    // If we're back at center, animate rotation back and reset height
    if (Math.abs(scrollX - centerPosition) < 50) {
    }
    // Small threshold for "center"
    Animated.timing(scrollRotation, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
    }).start();

    // Reset height back to full
    setCurrentHeight(initialHeight);
  };

  // Measure initial height of the content
  const handleLayout = (event: any) => {
    if (initialHeight === null) {
      const { height } = event.nativeEvent.layout;
      setInitialHeight(height);
      setCurrentHeight(height);
    }
  };

  // Scroll-based rotation interpolation (0 to -20 degrees, rotating downward)
  const scrollBasedRotation = scrollRotation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["20deg", "0deg", "-20deg"],
    extrapolate: "clamp",
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      scrollRotation.removeAllListeners();
    };
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          maxHeight: currentHeight ?? undefined, // Use the calculated height directly
          transform: [
            { rotate: scrollBasedRotation }, // Apply scroll-based rotation
          ],
        },
      ]}
      className={`${index === activeSwipeIndex ? "z-[10000]" : ""}  `}
      onLayout={handleLayout} // Measure the initial height
    >
      <ScrollView
        ref={flatListRef}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        bounces={false}
        decelerationRate="fast"
        snapToInterval={ITEM_WIDTH + GAP_SIZE}
        snapToAlignment="start"
        contentOffset={{ x: ITEM_WIDTH + GAP_SIZE, y: 0 }} // Start at center
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        scrollEventThrottle={16}
        contentContainerStyle={{
          flexDirection: "row",
          gap: GAP_SIZE,
          paddingLeft: 7,
        }}
      >
        {threeItemArray.map((item, index) => (
          <View key={index} style={{ width: ITEM_WIDTH }}>
            {item}
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginHorizontal: 10,
  },
  card: {
    width: "100%",
  },
});
