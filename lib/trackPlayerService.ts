import TrackPlayer, { Event } from "react-native-track-player";

export default async function trackPlayerService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteSeek, (e) => TrackPlayer.seekTo(e.position));
  TrackPlayer.addEventListener(Event.RemoteNext, async () => { try { await TrackPlayer.skipToNext(); } catch {} });
  TrackPlayer.addEventListener(Event.RemotePrevious, async () => { try { await TrackPlayer.skipToPrevious(); } catch {} });
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());
  TrackPlayer.addEventListener(Event.PlaybackError, (e) => console.warn("Playback error:", e));
}