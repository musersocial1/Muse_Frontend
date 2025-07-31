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
        width: width - 40,
        marginHorizontal: 20,
      }}
    >
      <View
        style={{
          borderRadius: 24,
          overflow: "hidden",
          height: 256,
        }}
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
            colors={["transparent", "rgba(0,0,0,0.95)"]}
            style={{
              width: "100%",
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 100,
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
          >
            <Text
              style={{
                color: "white",
                fontSize: 22,
                fontWeight: "bold",
                marginBottom: 4,
              }}
            >
              {podcast.title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  marginRight: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image source={icons.user} className="h-6 w-6" />
              </View>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: "500",
                  opacity: 0.95,
                }}
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
