import React, { useMemo } from "react";
import { View } from "react-native";
import Svg, { Rect, G, Line, Text as SvgText } from "react-native-svg";

interface Props {
  width: number;
  height: number;
  labels: string[];
  current: number[];   // green bars
  previous?: number[]; // gray backdrop bars (optional)
  barColor?: string;
  prevBarColor?: string;
  gridColor?: string;
}

export default function BarComparisonChart({
  width,
  height,
  labels,
  current,
  previous,
  barColor = "#2AD05A",
  prevBarColor = "#3A3A3A",
  gridColor = "#2A2A2A",
}: Props) {
  const padding = { top: 24, right: 8, bottom: 30, left: 8 };
  const chartW = width;
  const chartH = height;
  const innerW = chartW - padding.left - padding.right;
  const innerH = chartH - padding.top - padding.bottom;

  const barCount = labels.length;
  const gap = innerW / barCount / 3; // spacing between bars
  const barWidth = (innerW - gap * (barCount - 1)) / barCount;

  const maxVal = useMemo(
    () => Math.max(...current, ...(previous || [0])),
    [current, previous]
  );

  const scaleY = (v: number) => (v / (maxVal || 1)) * innerH;

  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => (i * maxVal) / ticks);

  return (
    <View className="w-full">
      <Svg width={chartW} height={chartH}>
        <G x={padding.left} y={padding.top}>
          {/* Horizontal grid lines */}
          {yTicks.map((t, i) => {
            const y = innerH - scaleY(t);
            return (
              <Line
                key={i}
                x1={0}
                x2={innerW}
                y1={y}
                y2={y}
                stroke={gridColor}
                strokeWidth={1}
                opacity={i === ticks ? 0.6 : 0.35}
              />
            );
          })}

          {/* Bars */}
          {labels.map((_, i) => {
            const x = i * (barWidth + gap);
            const prevH = previous ? scaleY(previous[i] || 0) : 0;
            const curH = scaleY(current[i] || 0);

            return (
              <G key={i}>
                {/* Previous (backdrop) */}
                {previous ? (
                  <Rect
                    x={x}
                    y={innerH - prevH}
                    width={barWidth}
                    height={prevH}
                    rx={8}
                    fill={prevBarColor}
                    opacity={0.8}
                  />
                ) : null}
                {/* Current */}
                <Rect
                  x={x}
                  y={innerH - curH}
                  width={barWidth}
                  height={curH}
                  rx={8}
                  fill={barColor}
                />
                {/* Label */}
                <SvgText
                  x={x + barWidth / 2}
                  y={innerH + 18}
                  fill="#8C8C8C"
                  fontSize={12}
                  textAnchor="middle"
                >
                  {labels[i]}
                </SvgText>
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
}