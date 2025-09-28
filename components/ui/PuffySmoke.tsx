import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

interface PuffySmokeProps {
  type: "like" | "dislike";
  visible: boolean;
  onComplete?: () => void;
  x?: number; // Position x coordinate
  y?: number; // Position y coordinate
}

const PuffySmoke: React.FC<PuffySmokeProps> = ({
  type,
  visible,
  onComplete,
  x = 0,
  y = 0,
}) => {
  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Particle animations (multiple puff particles)
  const particle1Scale = useRef(new Animated.Value(0)).current;
  const particle1Opacity = useRef(new Animated.Value(0)).current;
  const particle1X = useRef(new Animated.Value(0)).current;
  const particle1Y = useRef(new Animated.Value(0)).current;

  const particle2Scale = useRef(new Animated.Value(0)).current;
  const particle2Opacity = useRef(new Animated.Value(0)).current;
  const particle2X = useRef(new Animated.Value(0)).current;
  const particle2Y = useRef(new Animated.Value(0)).current;

  const particle3Scale = useRef(new Animated.Value(0)).current;
  const particle3Opacity = useRef(new Animated.Value(0)).current;
  const particle3X = useRef(new Animated.Value(0)).current;
  const particle3Y = useRef(new Animated.Value(0)).current;

  // Additional particles for bigger effect
  const particle4Scale = useRef(new Animated.Value(0)).current;
  const particle4Opacity = useRef(new Animated.Value(0)).current;
  const particle4X = useRef(new Animated.Value(0)).current;
  const particle4Y = useRef(new Animated.Value(0)).current;

  const particle5Scale = useRef(new Animated.Value(0)).current;
  const particle5Opacity = useRef(new Animated.Value(0)).current;
  const particle5X = useRef(new Animated.Value(0)).current;
  const particle5Y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset all animations
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      rotateAnim.setValue(0);

      [
        particle1Scale,
        particle2Scale,
        particle3Scale,
        particle4Scale,
        particle5Scale,
      ].forEach((anim) => anim.setValue(0));
      [
        particle1Opacity,
        particle2Opacity,
        particle3Opacity,
        particle4Opacity,
        particle5Opacity,
      ].forEach((anim) => anim.setValue(0));
      [particle1X, particle2X, particle3X, particle4X, particle5X].forEach(
        (anim) => anim.setValue(0)
      );
      [particle1Y, particle2Y, particle3Y, particle4Y, particle5Y].forEach(
        (anim) => anim.setValue(0)
      );

      // Main icon animation sequence - BALANCED SIZE
      const mainIconAnimation = Animated.sequence([
        // Phase 1: Icon appears and grows quickly
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.5, // Reduced from 2.0 to 1.5
            duration: 300, // Reduced from 350 to 300
            easing: Easing.out(Easing.back(2.5)),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 200, // Reduced from 250 to 200
            useNativeDriver: true,
          }),
        ]),
        // Phase 2: Icon shrinks slightly and starts rotating
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.1, // Reduced from 1.4 to 1.1
            duration: 150, // Reduced from 200 to 150
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 400, // Reduced from 500 to 400
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        // Phase 3: Icon fades out
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300, // Reduced from 400 to 300
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]);

      // Particle burst animations - NOTICEABLE BUT BALANCED
      const particleAnimations = Animated.stagger(30, [
        // Reduced from 75 to 60
        // Particle 1 - top right
        Animated.parallel([
          Animated.timing(particle1Scale, {
            toValue: 1.0, // Reduced from 1.2 to 1.0
            duration: 500, // Reduced from 600 to 500
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(particle1Opacity, {
            toValue: 0.9,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(particle1X, {
            toValue: 40, // Reduced from 50 to 40
            duration: 600,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(particle1Y, {
            toValue: -35, // Reduced from -45 to -35
            duration: 600,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        // Particle 2 - left
        Animated.parallel([
          Animated.timing(particle2Scale, {
            toValue: 0.8, // Reduced from 1.0 to 0.8
            duration: 550,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(particle2Opacity, {
            toValue: 0.8,
            duration: 270,
            useNativeDriver: true,
          }),
          Animated.timing(particle2X, {
            toValue: -45, // Reduced from -60 to -45
            duration: 650,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(particle2Y, {
            toValue: -15, // Reduced from -20 to -15
            duration: 650,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        // Particle 3 - bottom
        Animated.parallel([
          Animated.timing(particle3Scale, {
            toValue: 0.7, // Reduced from 0.8 to 0.7
            duration: 480,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(particle3Opacity, {
            toValue: 0.7,
            duration: 240,
            useNativeDriver: true,
          }),
          Animated.timing(particle3X, {
            toValue: 15, // Reduced from 20 to 15
            duration: 580,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(particle3Y, {
            toValue: 50, // Reduced from 65 to 50
            duration: 580,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        // Particle 4 - top left
        Animated.parallel([
          Animated.timing(particle4Scale, {
            toValue: 0.75, // Reduced from 0.9 to 0.75
            duration: 520,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(particle4Opacity, {
            toValue: 0.6,
            duration: 260,
            useNativeDriver: true,
          }),
          Animated.timing(particle4X, {
            toValue: -30, // Reduced from -40 to -30
            duration: 620,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(particle4Y, {
            toValue: -40, // Reduced from -50 to -40
            duration: 620,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        // Particle 5 - bottom right
        Animated.parallel([
          Animated.timing(particle5Scale, {
            toValue: 0.9, // Reduced from 1.1 to 0.9
            duration: 540,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(particle5Opacity, {
            toValue: 0.8,
            duration: 270,
            useNativeDriver: true,
          }),
          Animated.timing(particle5X, {
            toValue: 35, // Reduced from 45 to 35
            duration: 640,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(particle5Y, {
            toValue: 45, // Reduced from 55 to 45
            duration: 640,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]);

      // Particle fade out - LONGER FADE
      const particleFadeOut = Animated.parallel([
        Animated.timing(particle1Opacity, {
          toValue: 0,
          duration: 500, // Increased from 300 to 500
          useNativeDriver: true,
        }),
        Animated.timing(particle2Opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(particle3Opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(particle4Opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(particle5Opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]);

      // Run all animations
      // Run all animations
      Animated.parallel([
        mainIconAnimation,
        Animated.sequence([
          particleAnimations, // Remove the delay too
          particleFadeOut,
        ]),
      ]).start(() => {
        onComplete?.(); // Only call once, after everything is done
      });
    }
  }, [visible]);

  if (!visible) return null;

  // Updated colors and icons
  // Updated colors and icons
  const iconColor = type === "like" ? "#22C55E" : "#DC2626"; // Green for like, darker red for dislike
  const particleColor = type === "like" ? "#22C55E" : "#DC2626"; // Green for like, red for dislike
  const icon = type === "like" ? "heart" : "thumbs-down"; // Changed from "x" to "thumbs-down"

  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", type === "like" ? "15deg" : "-15deg"], // Different rotation for dislike
  });

  return (
    <View style={[styles.container, { left: x, top: y }]} pointerEvents="none">
      {/* Main Icon - BIGGER */}
      <Animated.View
        style={[
          styles.mainIcon,
          {
            transform: [{ scale: scaleAnim }, { rotate: rotateInterpolation }],
            opacity: opacityAnim,
          },
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
          <Feather name={icon} size={24} color="white" />
          {/* Reduced from 28 to 24 */}
        </View>
      </Animated.View>

      {/* Particle 1 - BIGGER */}
      <Animated.View
        style={[
          styles.particle,
          {
            transform: [
              { translateX: particle1X },
              { translateY: particle1Y },
              { scale: particle1Scale },
            ],
            opacity: particle1Opacity,
          },
        ]}
      >
        <View
          style={[
            styles.particleCircle,
            { backgroundColor: particleColor + "80" },
          ]}
        />
      </Animated.View>

      {/* Particle 2 - BIGGER */}
      <Animated.View
        style={[
          styles.particle,
          {
            transform: [
              { translateX: particle2X },
              { translateY: particle2Y },
              { scale: particle2Scale },
            ],
            opacity: particle2Opacity,
          },
        ]}
      >
        <View
          style={[
            styles.particleCircle,
            { backgroundColor: particleColor + "70" },
          ]}
        />
      </Animated.View>

      {/* Particle 3 - BIGGER */}
      <Animated.View
        style={[
          styles.particle,
          {
            transform: [
              { translateX: particle3X },
              { translateY: particle3Y },
              { scale: particle3Scale },
            ],
            opacity: particle3Opacity,
          },
        ]}
      >
        <View
          style={[
            styles.particleCircle,
            { backgroundColor: particleColor + "60" },
          ]}
        />
      </Animated.View>

      {/* Particle 4 - NEW */}
      <Animated.View
        style={[
          styles.particle,
          {
            transform: [
              { translateX: particle4X },
              { translateY: particle4Y },
              { scale: particle4Scale },
            ],
            opacity: particle4Opacity,
          },
        ]}
      >
        <View
          style={[
            styles.particleCircle,
            { backgroundColor: particleColor + "65" },
          ]}
        />
      </Animated.View>

      {/* Particle 5 - NEW */}
      <Animated.View
        style={[
          styles.particle,
          {
            transform: [
              { translateX: particle5X },
              { translateY: particle5Y },
              { scale: particle5Scale },
            ],
            opacity: particle5Opacity,
          },
        ]}
      >
        <View
          style={[
            styles.particleCircle,
            { backgroundColor: particleColor + "75" },
          ]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: 120, // Reduced from 150 to 120
    height: 120, // Reduced from 150 to 120
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    top: 0,
  },
  mainIcon: {
    position: "absolute",
  },
  iconContainer: {
    width: 50, // Reduced from 60 to 50
    height: 50, // Reduced from 60 to 50
    borderRadius: 25, // Reduced from 30 to 25
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 }, // Reduced shadow
    shadowOpacity: 0.3,
    shadowRadius: 6, // Reduced shadow radius
    elevation: 6, // Reduced elevation
  },
  particle: {
    position: "absolute",
  },
  particleCircle: {
    width: 16, // Reduced from 18 to 16
    height: 16, // Reduced from 18 to 16
    borderRadius: 8, // Reduced from 9 to 8
  },
});

export default PuffySmoke;
