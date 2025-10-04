import React from "react";
import { TouchableOpacity, View, Image, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { usePlayer } from "@/context/PlayerContext";
import { images } from "@/constants/images";

export default function MiniCirclePlayer({ onPress }: { onPress: () => void }) {
  const insets = useSafeAreaInsets();
  const { currentTrack, isPlaying, togglePlayPause, showMini } = usePlayer();

  if (!currentTrack || !showMini) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.container,
        { bottom: (insets.bottom || 16) + 16 }, // lift above home indicator
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.bubble}
        onPress={onPress}
      >
        <Image
          source={
            currentTrack.artwork ? { uri: currentTrack.artwork } : images.media
          }
          style={styles.art}
          resizeMode="cover"
        />
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            togglePlayPause();
          }}
          style={styles.playPause}
          activeOpacity={0.9}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={16}
            color="#fff"
            style={!isPlaying && { marginLeft: 2 }}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}

const SIZE = 64;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 16,
    left: undefined,
    zIndex: 1000,
  },
  bubble: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    overflow: "hidden",
    backgroundColor: "#1f1f1f",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  art: {
    width: "100%",
    height: "100%",
  },
  playPause: {
    position: "absolute",
    right: -6,
    bottom: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.2)",
  },
});
