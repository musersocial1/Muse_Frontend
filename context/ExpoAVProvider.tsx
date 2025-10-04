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

  const onStatusUpdate = (s: AVPlaybackStatus) => {
    if (!s.isLoaded) return;
    setIsPlaying(!!s.isPlaying);
    setPosition((s.positionMillis ?? 0) / MS);
    setDuration((s.durationMillis ?? 0) / MS);
  };

  const unload = async () => {
    try {
      await videoRef.current?.unloadAsync();
    } catch {}
  };

  const playTrack = async (track: Track) => {
    await unload();
    setCurrentTrack(track);
    await videoRef.current?.loadAsync(
      { uri: track.url },
      {
        shouldPlay: true,
        progressUpdateIntervalMillis: 500,
        rate: playbackRate,
      },
      false
    );
    setIsPlaying(true);
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
      {/* Single Video - conditionally styled based on modal visibility */}
      <View
        style={showModalVideo ? styles.modalContainer : styles.hidden}
        pointerEvents={showModalVideo ? "auto" : "none"}
      >
        <Video
          ref={videoRef}
          style={showModalVideo ? styles.modalVideo : styles.hiddenVideo}
          isMuted={false}
          useNativeControls={false}
          onPlaybackStatusUpdate={onStatusUpdate}
          resizeMode={ResizeMode.COVER}
        />
      </View>
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
  hiddenVideo: {
    width: 1,
    height: 1,
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    pointerEvents: "none",
  },
  modalVideo: {
    width: "100%",
    height: "100%",
  },
});
