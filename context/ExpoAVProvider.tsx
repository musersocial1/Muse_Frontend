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
    setCurrentTrack(track);
    setIsPlaying(false);
    console.log("✅ Track set, Video component will load it");
  };

  const onVideoLoad = async () => {
    console.log("🎥 Video loaded, playbackRate:", playbackRate);

    if (videoRef.current) {
      try {
        const status = await videoRef.current.getStatusAsync();
        if (status.isLoaded) {
          setDuration((status.durationMillis ?? 0) / MS);
        }
      } catch (e) {
        console.log("Status check error:", e);
      }
    }
  };

  const togglePlayPause = async () => {
    if (!videoRef.current) return;

    try {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await videoRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (e) {
      console.log("Toggle error:", e);
    }
  };

  const play = async () => {
    if (!videoRef.current) return;

    try {
      await videoRef.current.playAsync();
      setIsPlaying(true);
    } catch (e) {
      console.log("Play error:", e);
    }
  };

  const pause = async () => {
    if (!videoRef.current) return;

    try {
      await videoRef.current.pauseAsync();
      setIsPlaying(false);
    } catch (e) {
      console.log("Pause error:", e);
    }
  };

  const seekTo = async (s: number) => {
    if (!videoRef.current) return;

    try {
      await videoRef.current.setPositionAsync(Math.max(0, s) * MS);
    } catch (e) {
      console.log("Seek error:", e);
    }
  };

  const setRate = async (r: number) => {
    if (!videoRef.current) return;

    try {
      await videoRef.current.setRateAsync(r, true);
      setPlaybackRate(r);
    } catch (e) {
      console.log("Set rate error:", e);
    }
  };

  const skipForward = async (s: number) =>
    seekTo(Math.min(position + s, duration));
  const skipBackward = async (s: number) => seekTo(Math.max(position - s, 0));
  // 🔥 NEW: Export a component that renders the video
  const renderVideo = () => {
    if (!currentTrack) return null;

    return (
      <Video
        key={currentTrack.url}
        ref={videoRef}
        source={{ uri: currentTrack.url }}
        style={StyleSheet.absoluteFillObject}
        isMuted={false}
        shouldPlay={false}
        useNativeControls={false}
        onLoad={onVideoLoad}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        resizeMode={ResizeMode.COVER}
        progressUpdateIntervalMillis={500}
      />
    );
  };

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
      renderVideo, // 🔥 Export the render function
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

      {/* 🔥 Only render hidden video when modal is NOT showing */}
      {currentTrack && !showModalVideo && (
        <View style={styles.hidden} pointerEvents="none">
          {renderVideo()}
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
