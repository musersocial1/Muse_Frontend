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

  const [videoLayout, setVideoLayout] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

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
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const onVideoLoad = async () => {
    try {
      await videoRef.current?.setRateAsync(playbackRate, true);
      if (isPlaying) {
        await videoRef.current?.playAsync();
      }
    } catch {}
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
      setVideoLayout,
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

      {/* Only render a hidden audio Video when the modal isn't showing video.
          The visible <Video> should be rendered inline inside your Modal and
          must pass onLoad={onVideoLoad} and onPlaybackStatusUpdate={onPlaybackStatusUpdate}. */}
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
  videoOverlay: {
    position: "absolute",
    zIndex: 9999,
    overflow: "hidden",
    borderRadius: 30,
  },
});
