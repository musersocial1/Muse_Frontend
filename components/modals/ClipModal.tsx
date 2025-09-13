import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

const { width, height } = Dimensions.get("window");

// Dummy data for the thumbnails
const thumbnails = [
  {
    id: "1",
    uri: "https://www.nairaland.com/attachments/13176796_giftd_jpeg8632e7921ad238188c916faf46cd8641",
    isSelected: false,
  },
  {
    id: "2",
    uri: "https://www.nairaland.com/attachments/13176796_giftd_jpeg8632e7921ad238188c916faf46cd8641",
    isSelected: true,
  },
  {
    id: "3",
    uri: "https://www.nairaland.com/attachments/13176796_giftd_jpeg8632e7921ad238188c916faf46cd8641",
    isSelected: false,
  },
  {
    id: "4",
    uri: "https://www.nairaland.com/attachments/13176796_giftd_jpeg8632e7921ad238188c916faf46cd8641",
    isSelected: false,
  },
  {
    id: "5",
    uri: "https://www.nairaland.com/attachments/13176796_giftd_jpeg8632e7921ad238188c916faf46cd8641",
    isSelected: false,
  },
  {
    id: "6",
    uri: "https://www.nairaland.com/attachments/13176796_giftd_jpeg8632e7921ad238188c916faf46cd8641",
    isSelected: false,
  },
  {
    id: "7",
    uri: "https://www.nairaland.com/attachments/13176796_giftd_jpeg8632e7921ad238188c916faf46cd8641",
    isSelected: false,
  },
];

export default function ClipModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedThumbnail, setSelectedThumbnail] = useState("2");

  useEffect(() => {
    if (visible) {
      // Set status bar to light content
      StatusBar.setBarStyle("light-content");

      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    } else {
      // Reset status bar
      StatusBar.setBarStyle("dark-content");

      // Hide animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleThumbnailSelect = (id: string) => {
    setSelectedThumbnail(id);
  };

  const renderThumbnail = ({ item }: { item: any }) => {
    const isSelected = selectedThumbnail === item.id;

    return (
      <TouchableOpacity
        style={{
          borderRadius: 12,
          marginHorizontal: 6,
          borderWidth: isSelected ? 3 : 2,
          borderColor: isSelected ? "#fff" : "transparent",
          overflow: "hidden",
          transform: [{ scale: isSelected ? 1.05 : 1 }],
        }}
        onPress={() => handleThumbnailSelect(item.id)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: item.uri }}
          style={{
            width: 56,
            height: 70,
            borderRadius: 10,
            opacity: isSelected ? 1 : 0.8,
          }}
        />
        {isSelected && (
          <View
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              backgroundColor: "#fff",
              borderRadius: 10,
              width: 16,
              height: 16,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="checkmark" size={12} color="#393623" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          zIndex: 1000,
        },
      ]}
    >
      {/* SVG Gradient Background */}
      <View style={StyleSheet.absoluteFill}>
        <Svg height={height} width={width}>
          <Defs>
            <LinearGradient
              id="clipModalGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              {/* Top: greenish gray, Bottom: brownish, all fully opaque */}
              <Stop offset="0%" stopColor="#50615b" stopOpacity="1" />
              <Stop offset="50%" stopColor="#3e443e" stopOpacity="1" />
              <Stop offset="100%" stopColor="#693f2e" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill="url(#clipModalGradient)"
          />
        </Svg>
      </View>

      {/* Modal Content */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 60,
            paddingBottom: 40,
          },
        ]}
      >
        {/* Header Section */}
        <View
          style={{
            position: "absolute",
            top: 60,
            left: 0,
            right: 0,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
            zIndex: 10,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "600",
              fontSize: 19,
              textAlign: "center",
              flex: 1,
            }}
          >
            Clip post
          </Text>

          <TouchableOpacity
            onPress={onClose}
            style={{
              position: "absolute",
              right: 20,
              backgroundColor: "rgba(0,0,0,0.3)",
              borderRadius: 20,
              padding: 8,
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Content Container */}
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {/* Video/Clip Preview */}
          <Animated.View
            style={{
              marginBottom: 40,
              borderRadius: 24,
              overflow: "hidden",
              backgroundColor: "#111",
              width: width * 0.82,
              aspectRatio: 1.07,
              elevation: 12,
              shadowColor: "#000",
              shadowOpacity: 0.25,
              shadowOffset: { width: 0, height: 12 },
              shadowRadius: 24,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={images.Xcomm2}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",
              }}
            />

            {/* Play button overlay */}
            <TouchableOpacity
              style={{
                position: "absolute",
                backgroundColor: "rgba(0,0,0,0.6)",
                borderRadius: 35,
                width: 70,
                height: 70,
                alignItems: "center",
                justifyContent: "center",
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name="play"
                size={32}
                color="#fff"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Thumbnails Section */}
          <View style={{ marginBottom: 40, alignItems: "center" }}>
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "500",
                textAlign: "center",
                marginBottom: 16,
                opacity: 0.95,
              }}
            >
              Select starting point
            </Text>

            <View style={{ alignItems: "center" }}>
              <FlatList
                data={thumbnails}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={renderThumbnail}
                contentContainerStyle={{
                  paddingHorizontal: 20,
                  alignItems: "center",
                }}
                style={{
                  flexGrow: 0,
                  maxWidth: width * 0.9,
                }}
                decelerationRate="fast"
                snapToInterval={58} // 46 (width) + 12 (margins)
                snapToAlignment="center"
              />
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={{
              width: 140,
              backgroundColor: "#fff",
              paddingVertical: 16,
              borderRadius: 25,
              alignItems: "center",
              elevation: 6,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 8,
            }}
            onPress={() => {
              console.log("Continue with thumbnail:", selectedThumbnail);
              onClose();
            }}
            activeOpacity={0.9}
          >
            <Text
              style={{
                color: "#393623",
                fontWeight: "700",
                fontSize: 17,
                letterSpacing: 0.5,
              }}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}
