import {
  Audio,
  AVPlaybackStatus,
  InterruptionModeAndroid,
  InterruptionModeIOS,
  ResizeMode,
  Video,
} from "expo-av";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import PlayerContext, { PlayerContextType, Track } from "./PlayerContext";

const MS = 1000;

export const ExpoAVProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const videoRef = useRef<Video | null>(null);

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showMini, setShowMini] = useState(false);
  const [showModalVideo, setShowModalVideo] = useState(false);

  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      shouldDuckAndroid: true,
    }).catch(() => {});
  }, []);

  const onPlaybackStatusUpdate = (s: AVPlaybackStatus) => {
    if (!s.isLoaded) return;
    setIsPlaying(!!s.isPlaying);
    setPosition((s.positionMillis ?? 0) / MS);
    setDuration((s.durationMillis ?? 0) / MS);
  };

  const playTrack = async (track: Track) => {
    console.log("🎬 playTrack called with:", track.url);

    if (!videoRef.current) {
      setCurrentTrack(track);
      return;
    }

    try {
      await videoRef.current.unloadAsync();
      console.log("✅ Previous video unloaded");

      await videoRef.current.loadAsync(
        { uri: track.url },
        { shouldPlay: true, rate: playbackRate }
      );

      console.log("▶️ New video loaded and playing");
      setCurrentTrack(track);
      setIsPlaying(true);
    } catch (e) {
      console.log("⚠️ Error loading track:", e);
    }
  };

  const onVideoLoad = async () => {
    console.log(
      "🎥 Video loaded, playbackRate:",
      playbackRate,
      "isPlaying:",
      isPlaying
    );
    try {
      await videoRef.current?.setRateAsync(playbackRate, true);
      if (isPlaying) {
        console.log("▶️ Auto-playing video");
        await videoRef.current?.playAsync();
      }
    } catch (e) {
      console.log("❌ Error in onVideoLoad:", e);
    }
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      await videoRef.current?.pauseAsync();
      setIsPlaying(false);
    } else {
      await videoRef.current?.playAsync();
      setIsPlaying(true);
    }
  };

  const play = async () => {
    await videoRef.current?.playAsync();
    setIsPlaying(true);
  };

  const pause = async () => {
    await videoRef.current?.pauseAsync();
    setIsPlaying(false);
  };

  const seekTo = async (s: number) => {
    await videoRef.current?.setPositionAsync(Math.max(0, s) * MS);
  };

  const setRate = async (r: number) => {
    await videoRef.current?.setRateAsync(r, true);
    setPlaybackRate(r);
  };

  const skipForward = async (s: number) =>
    seekTo(Math.min(position + s, duration));
  const skipBackward = async (s: number) => seekTo(Math.max(position - s, 0));

  const value: PlayerContextType = useMemo(
    () => ({
      currentTrack,
      isPlaying,
      position,
      duration,
      playbackRate,
      showMini,
      setShowMini,
      playTrack,
      togglePlayPause,
      seekTo,
      setRate,
      skipForward,
      skipBackward,
      play,
      pause,
      videoRef,
      showModalVideo,
      setShowModalVideo,
      onPlaybackStatusUpdate,
      onVideoLoad,
    }),
    [
      currentTrack,
      isPlaying,
      position,
      duration,
      playbackRate,
      showMini,
      showModalVideo,
    ]
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}

      {/* Render hidden video when modal is NOT showing */}
      {currentTrack && !showModalVideo && (
        <View style={styles.hidden} pointerEvents="none">
          <Video
            ref={videoRef}
            source={{ uri: currentTrack.url }}
            style={{ width: 1, height: 1 }}
            isMuted={false}
            useNativeControls={false}
            onLoad={onVideoLoad}
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            resizeMode={ResizeMode.COVER}
            progressUpdateIntervalMillis={500}
          />
        </View>
      )}
    </PlayerContext.Provider>
  );
};

const styles = StyleSheet.create({
  hidden: {
    width: 1,
    height: 1,
    position: "absolute",
    left: -9999,
    top: -9999,
  },
});
