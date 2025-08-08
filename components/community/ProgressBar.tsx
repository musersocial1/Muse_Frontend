import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  const progress = currentStep / totalSteps;

  // Animated value for width
  const animatedValue = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 350,
      useNativeDriver: false, // width can't use native driver
    }).start();
  }, [progress, animatedValue]);

  return (
    <View className="">
      <View className="w-full h-2.5 bg-[#FFFFFF]/20 rounded-full overflow-hidden">
        <Animated.View
          className="h-full bg-white rounded-full"
          style={{
            width: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
          }}
        />
      </View>
    </View>
  );
};

export default ProgressBar;
