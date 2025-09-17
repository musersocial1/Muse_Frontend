// SwipeableCard.tsx - Simple version without translateY
import * as Haptics from "expo-haptics"; // 👈 add this
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Dimensions, PanResponder, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = 0.4 * width;

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  style?: any;
  onGestureStateChange?: (isActive: boolean) => void;
  disabled?: boolean;
  onSwipeProgress?: (progress: number, isActive: boolean) => void; // For swipe progress
  index: Number;
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
  const position = useRef(new Animated.ValueXY()).current;
  const [isDragging, setIsDragging] = useState(false);
  const [isHorizontalGesture, setIsHorizontalGesture] = useState(false);
  const [elementHeight, setElementHeight] = useState<number | null>(null); // Add this

  // To this:
  const maxHeightAnim = useRef(new Animated.Value(1000)).current; // Start high

  // And completely remove or simplify handleLayout:
  const handleLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    if (!elementHeight && height > 0) {
      setElementHeight(height);
      // Don't do any animation here - just store the height
    }
  };

  // Add this collapse function - you can call it when you want to collapse
  const collapseElement = () => {
    Animated.timing(maxHeightAnim, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false, // Height animations can't use native driver
    }).start();
  };

  // Add a ref to track if we've already vibrated for this gesture
  const hasVibratedRef = useRef(false);
  const disabledRef = useRef(disabled);

  useEffect(() => {
    disabledRef.current = disabled;
  }, [disabled]);

  useEffect(() => {
    onGestureStateChange?.(isHorizontalGesture);
  }, [isHorizontalGesture, onGestureStateChange]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => {
          if (disabledRef.current) {
            return false;
          }
          return false;
        },

        onMoveShouldSetPanResponder: (_, gesture) => {
          if (disabledRef.current) {
            return false;
          }

          const { dx, dy } = gesture;
          const isHorizontal = Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10;
          return isHorizontal;
        },

        onPanResponderGrant: () => {
          console.log("Pan responder granted");
          setIsDragging(true);
          setIsHorizontalGesture(true);
          position.setOffset({
            x: (position.x as any)._value,
            y: (position.y as any)._value,
          });
          position.setValue({ x: 0, y: 0 });
          hasVibratedRef.current = false; // Reset vibration flag

          // Notify parent that swipe started
          onSwipeProgress?.(0, true);
        },

        // In your onPanResponderMove handler, add this:
        onPanResponderMove: (_, gesture) => {
          if (disabledRef.current) {
            return;
          }

          // Update position
          position.setValue({ x: gesture.dx, y: 0 });

          // Calculate swipe progress (0 to 1)
          const progress = Math.min(Math.abs(gesture.dx) / SWIPE_THRESHOLD, 1);

          // Vibrate when threshold is reached
          if (progress >= 1 && !hasVibratedRef.current) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            hasVibratedRef.current = true;
          }

          // Animate height based on swipe progress
          if (elementHeight) {
            const newHeight = elementHeight * (1 - progress); // Height decreases as progress increases
            Animated.timing(maxHeightAnim, {
              toValue: newHeight,
              duration: 0, // Immediate response to gesture
              useNativeDriver: false,
            }).start();
          }

          onSwipeProgress?.(progress, true);
        },

        onPanResponderRelease: (_, gesture) => {
          console.log("Pan responder released");
          position.flattenOffset();
          setIsDragging(false);

          // Reset swipe progress
          onSwipeProgress?.(0, false);
          setTimeout(() => setIsHorizontalGesture(false), 100);

          if (disabledRef.current) {
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }).start();
            return;
          }

          const { dx, vx } = gesture;
          const shouldSwipeRight =
            dx > SWIPE_THRESHOLD || (dx > 50 && vx > 0.5);
          const shouldSwipeLeft =
            dx < -SWIPE_THRESHOLD || (dx < -50 && vx < -0.5);

          if (shouldSwipeRight) {
            // Swipe right - remove card
            Animated.timing(position, {
              toValue: { x: width + 100, y: 0 },
              duration: 250,
              useNativeDriver: true,
            }).start(() => {
              //   onSwipeRight?.();
              collapseElement();
              position.setValue({ x: 0, y: 0 });
            });
          } else if (shouldSwipeLeft) {
            // Swipe left - remove card
            Animated.timing(position, {
              toValue: { x: -width - 100, y: 0 },
              duration: 250,
              useNativeDriver: true,
            }).start(() => {
              //   onSwipeLeft?.();
              collapseElement();
              position.setValue({ x: 0, y: 0 });
            });
          } else {
            // Snap back - restore full height
            if (elementHeight) {
              Animated.timing(maxHeightAnim, {
                toValue: elementHeight,
                duration: 0,
                useNativeDriver: false,
              }).start();
            }
            // Snap back to center
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }).start();
          }
        },

        onPanResponderTerminationRequest: () => {
          if (disabledRef.current) {
            return true;
          }
          return false;
        },

        onPanResponderTerminate: () => {
          console.log("Pan responder terminated");
          setIsDragging(false);
          setIsHorizontalGesture(false);
          onSwipeProgress?.(0, false);
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }).start();
        },
      }),
    [onSwipeProgress]
  );

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ["-15deg", "0deg", "15deg"],
    extrapolate: "clamp",
  });

  const opacity = position.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: [0.7, 1, 0.7],
    extrapolate: "clamp",
  });

  const scale = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [0.95, 1, 0.95],
    extrapolate: "clamp",
  });

  const overlayOpacity = position.x.interpolate({
    inputRange: [-width / 3, 0, width / 3],
    outputRange: [0.3, 0, 0.3],
    extrapolate: "clamp",
  });

  const overlayColor = position.x.interpolate({
    inputRange: [-width / 3, 0, width / 3],
    outputRange: [
      "rgba(239, 68, 68, 0.8)",
      "transparent",
      "rgba(34, 197, 94, 0.8)",
    ],
    extrapolate: "clamp",
  });
  console.log(maxHeightAnim);
  // Add this layout handler

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          maxHeight: maxHeightAnim,
          //   overflow: "hidden",
        },
      ]}
      className={`${index == activeSwipeIndex ? "z-[10000]" : ""}`}
      onLayout={handleLayout} // Add this>
    >
      <Animated.View
        className={"my-[10px]"}
        style={{
          opacity: index == activeSwipeIndex ? 0 : 1, // Add this line
        }}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>

      {index == activeSwipeIndex && (
        <Animated.View
          style={[
            styles.card,
            {
              transform: [
                ...position.getTranslateTransform(),
                { rotate },
                // { scale },
              ],
              opacity,
            },
          ]}
          className={"  absolute"}
        >
          {/* Swipe feedback overlay */}
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: overlayColor,
                opacity: overlayOpacity,
                borderRadius: 30,
              },
            ]}
          />
          {children}
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    // marginVertical: 8,
  },
  card: {
    width: "100%",
    // borderRadius: 30,
    // overflow: "hidden",
  },
});
