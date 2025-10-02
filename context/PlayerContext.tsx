import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  RepeatMode,
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
  seekTo: (positionSeconds: number) => Promise<void>;
  setRate: (rate: number) => Promise<void>;
  skipForward: (seconds: number) => Promise<void>;
  skipBackward: (seconds: number) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | null>(null);
export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
};

let didSetup = false;

async function setupPlayerOnce() {
  if (didSetup) return;
  await TrackPlayer.setupPlayer({
    // optional: fine tune here
    autoHandleInterruptions: true,
  });

  await TrackPlayer.updateOptions({
    // Foreground/lockscreen capabilities
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SeekTo,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.Stop,
    ],
    compactCapabilities: [Capability.Play, Capability.Pause, Capability.SeekTo],
    progressUpdateEventInterval: 0.5, // seconds
    alwaysPauseOnInterruption: true,
    android: {
      appKilledPlaybackBehavior:
        AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
    },
  });

  await TrackPlayer.setRepeatMode(RepeatMode.Off);
  didSetup = true;
}

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  const playbackState = usePlaybackState();
  const progress = useProgress();

  // v3 hook can return either State or an object with .state
  const state = (playbackState as any)?.state ?? playbackState;
  const isPlaying = state === State.Playing;

  useEffect(() => {
    setupPlayerOnce().catch((e) => console.warn("setupPlayer error:", e));
  }, []);

  // Keep currentTrack in sync with the queue
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      if (track) {
        setCurrentTrack({
          id: String(track.id),
          url: String(track.url),
          title: String(track.title ?? ""),
          artist: String(track.artist ?? ""),
          artwork: (track.artwork as string) || undefined,
          duration:
            typeof track.duration === "number" ? track.duration : undefined,
        });
      }
    }
  });

  // Re-apply rate after prepare or focus changes
  useTrackPlayerEvents(
    [Event.PlaybackState, Event.PlaybackQueueEnded],
    async () => {
      try {
        await TrackPlayer.setRate(playbackRate);
      } catch {}
    }
  );

  const playTrack = async (track: Track) => {
    try {
      await setupPlayerOnce();
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: track.id,
        url: track.url,
        title: track.title,
        artist: track.artist,
        artwork: track.artwork,
        duration: track.duration, // seconds
      });
      await TrackPlayer.setRate(playbackRate);
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
      console.log("Error toggling:", error);
    }
  };

  const seekTo = async (positionSeconds: number) => {
    try {
      await TrackPlayer.seekTo(Math.max(0, positionSeconds));
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
    const newPos = Math.min(progress.position + seconds, progress.duration);
    await seekTo(newPos);
  };

  const skipBackward = async (seconds: number) => {
    const newPos = Math.max(progress.position - seconds, 0);
    await seekTo(newPos);
  };

  const play = async () => {
    await TrackPlayer.play();
  };
  const pause = async () => {
    await TrackPlayer.pause();
  };

  const value = useMemo(
    () => ({
      currentTrack,
      isPlaying,
      position: progress.position, // seconds
      duration: progress.duration, // seconds
      playbackRate,
      playTrack,
      togglePlayPause,
      seekTo,
      setRate,
      skipForward,
      skipBackward,
      play,
      pause,
    }),
    [
      currentTrack,
      isPlaying,
      progress.position,
      progress.duration,
      playbackRate,
    ]
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};
