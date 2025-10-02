import { usePlayer } from "@/context/PlayerContext";
import { ResizeMode, Video } from "expo-av";
import React, { useEffect, useRef } from "react";

const MS = 1000;

export default function VideoSurface({
  uri,
  style,
  visible = true,
}: {
  uri: string;
  style?: any;
  visible?: boolean;
}) {
  const ref = useRef<Video>(null);
  const { isPlaying, position, playbackRate } = usePlayer();

  // Keep rate in sync
  useEffect(() => {
    ref.current?.setRateAsync(playbackRate, true).catch(() => {});
  }, [playbackRate]);

  // Play/pause UI surface based on global engine
  useEffect(() => {
    if (!ref.current) return;
    (async () => {
      try {
        if (isPlaying && visible) {
          await ref.current?.playAsync();
        } else {
          await ref.current?.pauseAsync();
        }
      } catch {}
    })();
  }, [isPlaying, visible]);

  // Soft-sync position (only correct when drift > 500ms)
  useEffect(() => {
    let mounted = true;
    const sync = async () => {
      if (!ref.current || !visible) return;
      try {
        const status = await ref.current?.getStatusAsync();
        if (!mounted || !status.isLoaded) return;
        const uiPos = status.positionMillis ?? 0;
        const target = position * MS;
        if (Math.abs(uiPos - target) > 500) {
          await ref.current?.setPositionAsync(target);
          if (isPlaying) await ref.current?.playAsync();
        }
      } catch {}
    };
    const t = setTimeout(sync, 120);
    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [position, visible, isPlaying]);

  if (!visible) {
    return (
      <Video
        ref={ref}
        source={{ uri }}
        style={{ width: 1, height: 1, opacity: 0 }}
        isMuted
        shouldPlay={false}
        rate={playbackRate}
        resizeMode={ResizeMode.COVER}
        useNativeControls={false}
      />
    );
  }

  return (
    <Video
      ref={ref}
      source={{ uri }}
      style={style}
      isMuted
      shouldPlay={isPlaying}
      rate={playbackRate}
      resizeMode={ResizeMode.COVER}
      useNativeControls={false}
    />
  );
}
