// SwipeableCard.tsx - Horizontal-only swipe with smooth height animation
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet } from "react-native";
import { View } from "react-native-animatable";
import { FlatList } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

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

  // Convert children to array for FlatList and create 3-item array
  const childrenArray = React.Children.toArray(children);
  const threeItemArray = [
    <View style={{ width: width - 20 }} />, // 1st item: empty space with full width
    <View style={{ width: width - 20 }}>{childrenArray}</View>, // 2nd item: main children
    <View style={{ width: width - 20 }} />, // 3rd item: empty space with full width
  ];

  const insets = useSafeAreaInsets();

  // Add these refs and threshold at the top of your component:
  const hasVibratedLeftRef = useRef(false);
  const hasVibratedRightRef = useRef(false);
  const scrollThreshold = width * 0.5; // 30% of screen width as threshold
  const flatListRef = useRef<FlatList>(null);

  // Enhanced scroll handler with rotation and height animation
  const handleScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const centerPosition = width; // Middle item position

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
    if (absoluteDistance > scrollThreshold) {
      // Determine direction
      const isScrollingLeft = scrollX < centerPosition;
      const isScrollingRight = scrollX > centerPosition;

      // Vibrate and auto-scroll when threshold is crossed
      if (isScrollingLeft && !hasVibratedLeftRef.current) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        hasVibratedLeftRef.current = true;
        hasVibratedRightRef.current = false; // Reset opposite direction

        // Auto-scroll to left item (index 0)
        flatListRef.current?.scrollToIndex({
          index: 0,
          animated: true,
        });

        // Call swipe callback after a short delay
        setTimeout(() => {
          onSwipeLeft?.();
        }, 10);
      } else if (isScrollingRight && !hasVibratedRightRef.current) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        hasVibratedRightRef.current = true;
        hasVibratedLeftRef.current = false; // Reset opposite direction

        // Auto-scroll to right item (index 2)
        flatListRef.current?.scrollToIndex({
          index: 2,
          animated: true,
        });

        // Call swipe callback after a short delay
        setTimeout(() => {
          onSwipeRight?.();
        }, 10);
      }
    } else {
      // Reset vibration flags when back within threshold
      hasVibratedLeftRef.current = false;
      hasVibratedRightRef.current = false;
    }
  };

  // Reset rotation and height when scroll ends
  const handleScrollEnd = (event: any) => {
    flatListRef.current?.scrollToIndex({
      index: 1, // 👈 always back to center
      animated: true,
    });

    console.log("thi just siope");
    const scrollX = event.nativeEvent.contentOffset.x;
    const centerPosition = width;

    // If we're back at center, animate rotation back and reset height
    if (Math.abs(scrollX - centerPosition) < 50) {
      // Small threshold for "center"
      Animated.timing(scrollRotation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // Reset height back to full
      setCurrentHeight(initialHeight);
    }
  };

  // Measure initial height of the content
  const handleLayout = (event: any) => {
    if (initialHeight === null) {
      const { height } = event.nativeEvent.layout;
      setInitialHeight(height);
      setCurrentHeight(height);
    }
  };

  // Scroll-based rotation interpolation (0 to -30 degrees, rotating downward)
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
          //   overflow: "hidden",
          maxHeight: currentHeight ?? undefined, // Use the calculated height directly
          transform: [
            { rotate: scrollBasedRotation }, // Apply scroll-based rotation
          ],
        },
      ]}
      className={`${index === activeSwipeIndex ? "z-[10000]" : ""}   `}
      onLayout={handleLayout} // Measure the initial height
    >
      <FlatList
        ref={flatListRef}
        data={threeItemArray}
        renderItem={({ item }) => <View className="">{item}</View>}
        keyExtractor={(item, index) => index.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-[30px] "
        initialScrollIndex={1} // Start at middle item
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        pagingEnabled={true} // Enable paging
        snapToInterval={width - 20} // Snap to each screen width
        snapToAlignment="start" // Snap to start of each item
        decelerationRate={1}
        bounces={false} // Disable bouncing at edges
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        scrollEventThrottle={16}
        initialNumToRender={3}
      />
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
