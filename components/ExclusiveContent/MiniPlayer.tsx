import { usePlayer } from "@/context/PlayerContext";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";

interface MiniCirclePlayerProps {
  onPress?: () => void;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const MiniCirclePlayer: React.FC<MiniCirclePlayerProps> = ({ onPress }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const {
    isPlaying,
    position,
    duration,
    togglePlayPause,
    currentTrack,
    showMini,
  } = usePlayer();

  // Geometry (thicker ring)
  const outerRadius = 30; // overall radius
  const ringThickness = 5; // thick progress ring
  const innerRadius = outerRadius - ringThickness;
  const innerSize = innerRadius * 2;
  const size = outerRadius * 2;
  const half = size / 2;
  const ringRadius = outerRadius - ringThickness / 2;
  const circumference = 2 * Math.PI * ringRadius;

  const dashOffset = useRef(new Animated.Value(circumference)).current;

  // Progress from context
  const progress = useMemo(() => {
    if (!duration || duration <= 0) return 0;
    const p = Math.min(1, Math.max(0, position / duration));
    return Number.isFinite(p) ? p : 0;
  }, [position, duration]);

  // Animate progress ring
  useEffect(() => {
    const to = circumference * (1 - progress);
    Animated.timing(dashOffset, {
      toValue: Number.isFinite(to) ? to : circumference,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress, circumference, dashOffset]);

  useEffect(() => {
    if (isPlaying) {
      rotateAnim.setValue(0);
      const loop = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 9000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      loop.start();
      return () => loop.stop();
    }
  }, [isPlaying, rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const EMPTY = "rgba(188, 188, 188, 0.11)";
  const PROGRESS = "#FFFFFF";

  if (!currentTrack || !showMini) return null;

  return (
    <View pointerEvents="box-none" style={styles.floatingContainer}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[
          styles.hitBox,
          {
            width: size,
            height: size,
            overflow: "hidden",
            elevation: Platform.OS === "android" ? 3 : 0,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
          },
        ]}
      >
        <View
          style={[
            styles.outer,
            {
              width: size,
              height: size,
              borderRadius: outerRadius,
              overflow: "hidden",
            },
          ]}
        >
          <BlurView
            style={StyleSheet.absoluteFill}
            intensity={40}
            tint="dark"
            experimentalBlurMethod="dimezisBlurView"
          >
            {/* Progress ring */}
            <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
              {/* Empty track */}
              <Circle
                cx={half}
                cy={half}
                r={ringRadius}
                stroke={EMPTY}
                strokeWidth={ringThickness}
                fill="none"
              />
              {/* Progress arc (starts at 12 o'clock) */}
              <AnimatedCircle
                cx={half}
                cy={half}
                r={ringRadius}
                stroke={PROGRESS}
                strokeWidth={ringThickness}
                fill="none"
                strokeDasharray={`${circumference}, ${circumference}`}
                strokeDashoffset={dashOffset as any}
                strokeLinecap="round"
                originX={half}
                originY={half}
                rotation={-90}
              />
            </Svg>

            {/* Inner circle using SVG gold gradient */}
            <View
              style={{
                position: "absolute",
                left: ringThickness,
                top: ringThickness,
                width: innerSize,
                height: innerSize,
                borderRadius: innerRadius,
                overflow: "hidden",
                backgroundColor: "transparent",
              }}
              pointerEvents="none"
            >
              <Svg
                width={innerSize}
                height={innerSize}
                style={StyleSheet.absoluteFill}
              >
                <Defs>
                  <RadialGradient
                    id="goldGradient"
                    cx="50%"
                    cy="30%"
                    r="70%"
                    fx="50%"
                    fy="30%"
                  >
                    <Stop offset="0%" stopColor="#F5E6C8" stopOpacity="1" />
                    <Stop offset="40%" stopColor="#E8D4A0" stopOpacity="1" />
                    <Stop offset="70%" stopColor="#C9A861" stopOpacity="1" />
                    <Stop offset="100%" stopColor="#8B7340" stopOpacity="1" />
                  </RadialGradient>
                </Defs>
                <Circle
                  cx={innerSize / 2}
                  cy={innerSize / 2}
                  r={innerRadius}
                  fill="url(#goldGradient)"
                />
              </Svg>

              {/* Commented out RN Image approach */}
              {/* <Animated.View
                style={[
                  StyleSheet.absoluteFill,
                  { transform: [{ rotate: rotation }] },
                ]}
              >
                <RNImage
                  source={images.gold}
                  resizeMode="cover"
                  style={[
                    StyleSheet.absoluteFill,
                    { transform: [{ scale: 2 }] },
                  ]}
                />
              </Animated.View> */}

              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: "rgba(188,188,188,0.11)" },
                ]}
              />
            </View>

            <View
              style={[styles.centerBtn, { left: half - 24, top: half - 24 }]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather
                name={isPlaying ? "pause" : "play"}
                size={22}
                color="#FFF"
                style={!isPlaying && { marginLeft: 2 }}
              />
            </View>
          </BlurView>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MiniCirclePlayer;

const styles = StyleSheet.create({
  floatingContainer: {
    position: "absolute",
    bottom: "21%",
    right: "2%",
    zIndex: 999,
    elevation: Platform.OS === "android" ? 3 : 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  hitBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  outer: {
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 20 },
    elevation: Platform.OS === "android" ? 3 : 0,
  },
  centerBtn: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
