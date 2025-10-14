import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useRef, useState } from "react";
import {
  ColorValue,
  GestureResponderEvent,
  LayoutChangeEvent,
  PanResponder,
  PanResponderGestureState,
  View,
} from "react-native";

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  height?: number;
  width?: number;
}

const BAR_HEIGHT = 180;
const BAR_WIDTH = 32;
const INDICATOR_HEIGHT = 6; // Thin indicator
const INDICATOR_WIDTH = 46; // Wider indicator that extends beyond the bar

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
  height = BAR_HEIGHT,
  width = BAR_WIDTH,
}) => {
  const [indicatorY, setIndicatorY] = useState(0);
  const [pickerTop, setPickerTop] = useState(0);
  const pickerRef = useRef<View>(null);

  const gradientColors = Array.from({ length: 13 }, (_, i) => {
    const hue = (i * 30) % 360;
    return `hsl(${hue}, 100%, 50%)` as ColorValue;
  });

  const getColorFromPosition = useCallback(
    (y: number): string => {
      const clampedY = Math.max(0, Math.min(y, height));
      const hue = (clampedY / height) * 360;
      return `hsl(${hue}, 100%, 50%)`;
    },
    [height]
  );

  const getPositionFromColor = useCallback(
    (color: string): number => {
      let hue = 0;
      const match = color.match(/hsl\((\d+)/);
      if (match) hue = parseFloat(match[1]);
      return (hue / 360) * height;
    },
    [height]
  );

  React.useEffect(() => {
    setIndicatorY(getPositionFromColor(selectedColor));
  }, [selectedColor, getPositionFromColor]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (
        evt: GestureResponderEvent,
        _: PanResponderGestureState
      ) => {
        const touchY = evt.nativeEvent.pageY - pickerTop;
        const newY = Math.max(0, Math.min(height, touchY));
        setIndicatorY(newY);
        onColorChange(getColorFromPosition(newY));
      },
      onPanResponderGrant: (
        evt: GestureResponderEvent,
        _: PanResponderGestureState
      ) => {
        const touchY = evt.nativeEvent.pageY - pickerTop;
        const newY = Math.max(0, Math.min(height, touchY));
        setIndicatorY(newY);
        onColorChange(getColorFromPosition(newY));
      },
    })
  ).current;

  const onLayout = (e: LayoutChangeEvent) => {
    setPickerTop(e.nativeEvent.layout.y);
  };

  return (
    <View
      style={{
        position: "absolute",
        top: 80,
        right: 10,
        zIndex: 100,
      }}
    >
      <View
        ref={pickerRef}
        onLayout={onLayout}
        className="rounded-full overflow-visible items-center"
        style={{
          width,
          height,
          backgroundColor: "#222a",
        }}
        {...panResponder.panHandlers}
        accessible
        accessibilityLabel="Color picker"
      >
        <LinearGradient
          colors={gradientColors as any}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ width: "100%", height: "100%", borderRadius: 9999 }}
        />
        <View
          style={{
            position: "absolute",
            height: INDICATOR_HEIGHT,
            width: INDICATOR_WIDTH,
            backgroundColor: "white",
            borderRadius: 3,
            left: -(INDICATOR_WIDTH - width) / 2,
            top: indicatorY - INDICATOR_HEIGHT / 2,
            borderColor: selectedColor,
            borderWidth: 2,
            shadowColor: "#000",
            shadowOpacity: 0.25,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
            elevation: 5,
          }}
          pointerEvents="none"
        />
      </View>
    </View>
  );
};

export default ColorPicker;
