import { images } from "@/constants/images";
import { usePlayer } from "@/context/PlayerContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MiniPlayerProps {
  onPress: () => void;
}
const { width } = Dimensions.get("window");

const MiniPlayer: React.FC<MiniPlayerProps> = ({ onPress }) => {
  const { currentTrack, isPlaying, togglePlayPause, showMini } = usePlayer();
  if (!currentTrack || !showMini) return null;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.playerContainer}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Image
          source={
            currentTrack.artwork ? { uri: currentTrack.artwork } : images.media
          }
          style={styles.albumArt}
          resizeMode="cover"
        />
        <View style={styles.trackInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentTrack.artist ?? ""}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.playButton}
          onPress={(e) => {
            e.stopPropagation();
            togglePlayPause();
          }}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={24}
            color="white"
            style={!isPlaying && { marginLeft: 2 }}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1a1a1a",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    paddingBottom: 34,
  },
  playerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 64,
  },
  albumArt: { width: 40, height: 40, borderRadius: 8, marginRight: 12 },
  trackInfo: { flex: 1, marginRight: 12 },
  title: { color: "white", fontSize: 14, fontWeight: "600", marginBottom: 2 },
  artist: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    fontWeight: "400",
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MiniPlayer;
