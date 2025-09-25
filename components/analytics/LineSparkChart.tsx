import React, { useMemo } from "react";
import { View } from "react-native";
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Rect, Stop, Text as SvgText } from "react-native-svg";

interface Props {
  width: number;
  height: number;
  data: number[];
  labels?: string[];
  lineColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  gridColor?: string;
}

export default function LineSparkChart({
  width,
  height,
  data,
  labels = [],
  lineColor = "#2D9CDB",
  gradientFrom = "#2D9CDB22",
  gradientTo = "#2D9CDB00",
  gridColor = "#2A2A2A",
}: Props) {
  const padding = { top: 32, right: 8, bottom: 28, left: 8 };
  const w = width;
  const h = height;
  const innerW = w - padding.left - padding.right;
  const innerH = h - padding.top - padding.bottom;

  const max = useMemo(() => Math.max(...data), [data]);
  const min = 0;
  const len = data.length;

  const scaleX = (i: number) => (i / (len - 1)) * innerW;
  const scaleY = (v: number) => innerH - ((v - min) / (max - min || 1)) * innerH;

  const path = useMemo(() => {
    return data.map((v, i) => `${i === 0 ? "M" : "L"} ${scaleX(i)} ${scaleY(v)}`).join(" ");
  }, [data]);

  const areaPath = `${path} L ${innerW} ${innerH} L 0 ${innerH} Z`;

  // subtle vertical spikes background to match Figma
  const spikes = 30;
  const spikeGap = innerW / spikes;

  return (
    <View className="w-full">
      <Svg width={w} height={h}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={gradientFrom} />
            <Stop offset="1" stopColor={gradientTo} />
          </LinearGradient>
        </Defs>

        {/* Inner group */}
        <Rect x={0} y={0} width={w} height={h} fill="transparent" />
        <G transform={`translate(${padding.left}, ${padding.top})`}>
          {/* grid lines */}
          {[0, 1, 2, 3, 4].map((row) => {
            const y = (row / 4) * innerH;
            return (
              <Line
                key={row}
                x1={0}
                x2={innerW}
                y1={y}
                y2={y}
                stroke={gridColor}
                strokeWidth={1}
                opacity={row === 4 ? 0.6 : 0.35}
              />
            );
          })}

          {/* vertical spikes */}
          {Array.from({ length: spikes + 1 }, (_, i) => {
            const x = i * spikeGap;
            return (
              <Line
                key={i}
                x1={x}
                x2={x}
                y1={innerH - 60}
                y2={innerH}
                stroke="#2D9CDB44"
                strokeWidth={1}
              />
            );
          })}

          {/* Area fill */}
          <Path d={areaPath} fill="url(#grad)" />

          {/* Line */}
          <Path d={path} fill="none" stroke={lineColor} strokeWidth={2.5} />

          {/* Last point dot */}
          <Circle
            cx={scaleX(len - 1)}
            cy={scaleY(data[len - 1])}
            r={3.5}
            fill={lineColor}
          />

          {/* X labels (sparse) */}
          {labels.length > 0
            ? labels.slice(0, 6).map((lb, i) => {
                const xi = (i / 5) * (len - 1);
                const x = scaleX(xi);
                return (
                  <SvgText
                    key={i}
                    x={x}
                    y={innerH + 22}
                    fill="#8C8C8C"
                    fontSize={12}
                    textAnchor={i === 0 ? "start" : i === 5 ? "end" : "middle"}
                  >
                    {lb}
                  </SvgText>
                );
              })
            : null}
        </G>
      </Svg>
    </View>
  );
}