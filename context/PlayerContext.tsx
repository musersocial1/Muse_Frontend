// Create this file: src/contexts/PlayerContext.tsx (or wherever you prefer)

import React, { createContext, useContext, useEffect, useState } from "react";
import TrackPlayer, {
  Capability,
  Event,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from "react-native-track-player";

interface Track {
  id: string;
  url: string;
  title: string;
  artist: string;
  artwork?: string;
  duration?: number;
}

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  playbackRate: number;
  // Actions
  playTrack: (track: Track) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  setRate: (rate: number) => Promise<void>;
  skipForward: (seconds: number) => Promise<void>;
  skipBackward: (seconds: number) => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within PlayerProvider");
  }
  return context;
};

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  const playbackState = usePlaybackState();
  const progress = useProgress();

  // Handle the union type properly
  const isPlaying = playbackState?.state === State.Playing;

  useEffect(() => {
    setupPlayer();
  }, []);

  // Listen to track changes
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      if (track) {
        setCurrentTrack({
          id: track.id as string,
          url: track.url as string,
          title: track.title as string,
          artist: track.artist as string,
          artwork: track.artwork as string,
          duration: track.duration,
        });
      }
    }
  });

  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
        ],
      });
    } catch (error) {
      console.log("Error setting up player:", error);
    }
  };

  const playTrack = async (track: Track) => {
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: track.id,
        url: track.url,
        title: track.title,
        artist: track.artist,
        artwork: track.artwork || "",
        duration: track.duration,
      });
      await TrackPlayer.play();
      setCurrentTrack(track);
    } catch (error) {
      console.log("Error playing track:", error);
    }
  };

  const togglePlayPause = async () => {
    try {
      if (isPlaying) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    } catch (error) {
      console.log("Error toggling playback:", error);
    }
  };

  const seekTo = async (position: number) => {
    try {
      await TrackPlayer.seekTo(position);
    } catch (error) {
      console.log("Error seeking:", error);
    }
  };

  const setRate = async (rate: number) => {
    try {
      await TrackPlayer.setRate(rate);
      setPlaybackRate(rate);
    } catch (error) {
      console.log("Error setting rate:", error);
    }
  };

  const skipForward = async (seconds: number) => {
    try {
      const newPosition = Math.min(
        progress.position + seconds,
        progress.duration
      );
      await TrackPlayer.seekTo(newPosition);
    } catch (error) {
      console.log("Error skipping forward:", error);
    }
  };

  const skipBackward = async (seconds: number) => {
    try {
      const newPosition = Math.max(progress.position - seconds, 0);
      await TrackPlayer.seekTo(newPosition);
    } catch (error) {
      console.log("Error skipping backward:", error);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        position: progress.position,
        duration: progress.duration,
        playbackRate,
        playTrack,
        togglePlayPause,
        seekTo,
        setRate,
        skipForward,
        skipBackward,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
