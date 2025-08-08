import { icons } from "@/constants/icons";
import { Podcast } from "@/types/discover";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface CarouselItemProps {
  podcast: Podcast;
  index: number;
  currentIndex: number;
}

const CarouselItem: React.FC<CarouselItemProps> = ({
  podcast,
  index,
  currentIndex,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: currentIndex === index ? 1 : 0.8,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentIndex, index]);

  const scale = animatedValue.interpolate({
    inputRange: [0.8, 1],
    outputRange: [0.9, 1],
  });

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
        width: width,
        // marginHorizontal: 20,
        // marginLeft: 5,
        // marginRight: 5,
      }}
    >
      <View
        style={{
          borderRadius: 15,
          overflow: "hidden",
        }}
        className=" aspect-[1/0.7]"
      >
        <ImageBackground
          source={podcast.image}
          style={{ flex: 1, justifyContent: "flex-end" }}
          imageStyle={{ borderRadius: 24 }}
          resizeMode="cover"
        >
          <View
            style={{
              //   ...StyleSheet,
              backgroundColor: "rgba(0,0,0,0.45)",
            }}
          />

          {/* Black linear gradient at the bottom for content */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,1)"]}
            style={{
              width: "100%",
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 150,
              justifyContent: "flex-end",
              paddingHorizontal: 24,
              paddingBottom: 20,
            }}
            pointerEvents="none"
          />

          {/* Content at the very bottom */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              paddingHorizontal: 24,
              paddingBottom: 20,
              zIndex: 2,
            }}
            className=" gap-1"
          >
            <Text
              style={{
                color: "white",
                fontSize: 22,
                fontWeight: "bold",
                marginBottom: 4,
              }}
              className="font-sfpro-bold"
            >
              {podcast.title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 22,
                  height: 22,
                  marginRight: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className="rounded-full overflow-hidden"
              >
                <Image
                  source={icons.dp}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                }}
                className="text-white/70"
              >
                {podcast.creator} · {podcast.creatorType}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </Animated.View>
  );
};

export default CarouselItem;
