import React, { useEffect, useMemo, useState } from "react";
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
import PlayerContext, { PlayerContextType, Track } from "./PlayerContext";

let didSetup = false;
async function setupPlayerOnce(playbackRate: number) {
  if (didSetup) return;
  await TrackPlayer.setupPlayer({ autoHandleInterruptions: true });
  await TrackPlayer.updateOptions({
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SeekTo,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.Stop,
    ],
    compactCapabilities: [Capability.Play, Capability.Pause, Capability.SeekTo],
    progressUpdateEventInterval: 0.5,
    alwaysPauseOnInterruption: true,
    android: {
      appKilledPlaybackBehavior:
        AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
    },
  });
  await TrackPlayer.setRepeatMode(RepeatMode.Off);
  await TrackPlayer.setRate(playbackRate);
  didSetup = true;
}

export const TrackPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showMini, setShowMini] = useState(false);
  const [showModalVideo, setShowModalVideo] = useState(false);

  const playbackState = usePlaybackState();
  const progress = useProgress();
  const state = (playbackState as any)?.state ?? playbackState;
  const isPlaying = state === State.Playing;

  useEffect(() => {
    setupPlayerOnce(playbackRate).catch((e) =>
      console.warn("setupPlayer error:", e)
    );
  }, []);

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

  useTrackPlayerEvents(
    [Event.PlaybackState, Event.PlaybackQueueEnded],
    async () => {
      try {
        await TrackPlayer.setRate(playbackRate);
      } catch {}
    }
  );

  const playTrack = async (track: Track) => {
    await setupPlayerOnce(playbackRate);
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: track.id,
      url: track.url,
      title: track.title,
      artist: track.artist,
      artwork: track.artwork,
      duration: track.duration,
    });
    await TrackPlayer.setRate(playbackRate);
    await TrackPlayer.play();
    setCurrentTrack(track);
  };

  const togglePlayPause = async () =>
    isPlaying ? TrackPlayer.pause() : TrackPlayer.play();
  const seekTo = async (s: number) => TrackPlayer.seekTo(Math.max(0, s));
  const setRate = async (r: number) => {
    await TrackPlayer.setRate(r);
    setPlaybackRate(r);
  };
  const skipForward = async (s: number) =>
    TrackPlayer.seekTo(Math.min(progress.position + s, progress.duration));
  const skipBackward = async (s: number) =>
    TrackPlayer.seekTo(Math.max(progress.position - s, 0));
  const play = async () => TrackPlayer.play();
  const pause = async () => TrackPlayer.pause();

  const value: PlayerContextType = useMemo(
    () => ({
      currentTrack,
      isPlaying,
      position: progress.position,
      duration: progress.duration,
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
      videoRef: undefined,
      showModalVideo,
      setShowModalVideo,
    }),
    [
      currentTrack,
      isPlaying,
      progress.position,
      progress.duration,
      playbackRate,
      showMini,
      showModalVideo,
    ]
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};
