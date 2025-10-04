import Constants from "expo-constants";
import React from "react";

export type Track = {
  id: string;
  url: string;
  title: string;
  artist: string;
  artwork?: string;
  duration?: number;
};

export type PlayerContextType = {
  currentTrack: Track | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  playbackRate: number;
  showMini: boolean;
  setShowMini: (v: boolean) => void;
  playTrack: (track: Track) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (positionSeconds: number) => Promise<void>;
  setRate: (rate: number) => Promise<void>;
  skipForward: (seconds: number) => Promise<void>;
  skipBackward: (seconds: number) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  videoRef?: any;
  showModalVideo: boolean;
  setShowModalVideo: (v: boolean) => void;
};

const PlayerContext = React.createContext<PlayerContextType | null>(null);

export const usePlayer = () => {
  const ctx = React.useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
};

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isExpoGo = Constants.appOwnership === "expo";

  if (isExpoGo) {
    const { ExpoAVProvider } = require("./ExpoAVProvider");
    return <ExpoAVProvider>{children}</ExpoAVProvider>;
  } else {
    const { TrackPlayerProvider } = require("./TrackPlayerProvider");
    return <TrackPlayerProvider>{children}</TrackPlayerProvider>;
  }
};

export default PlayerContext;
