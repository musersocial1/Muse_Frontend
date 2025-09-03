import React from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface Props {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0 to 1 (e.g. 0.6 for 60%)
  color?: string;
  backgroundColor?: string;
}

const CircleProgress: React.FC<Props> = ({
  size = 24,
  strokeWidth = 3,
  progress,
  color = "#62F28F",
  backgroundColor = "rgba(255,255,255,0.5)",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View>
      <Svg width={size} height={size}>
        <Circle
          stroke={backgroundColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress Arc */}
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

export default CircleProgress;
