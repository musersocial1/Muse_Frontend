import React from "react";
import { Image, Text, View } from "react-native";

export default function AvatarStack({
  images,
  size = 20,
  extra,
  date
}: {
  images: any[];
  size?: number;
  extra?: string;
  date?: string;
}) {
  const overlap = Math.floor(size * 0.45);

  return (
    <View>
            {date ? (
        <Text className="text-white/50 text-[12px] font-sfpro-medium mr-2 p-1">
          {date}
        </Text>
      ) : null}
    <View className="flex-row items-center ">

      <View className="flex-row">
        {images.slice(0, 4).map((img, idx) => (
          <View
            key={idx}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              overflow: "hidden",
              marginLeft: idx === 0 ? 0 : -overlap,
              borderWidth: 1,
              borderColor: "#121212",
            }}
          >
            <Image source={img} style={{ width: "100%", height: "100%" }} />
          </View>
        ))}
      </View>
      {extra ? (
        <Text
          className="text-white ml-2 text-[16px] font-sfpro-bold"
        >
          {extra}
        </Text>
      ) : null}
    </View>
</View>
  );
}