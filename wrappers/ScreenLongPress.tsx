import { usePostContext } from "@/context/PostsContext";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, ViewProps } from "react-native";

const ScreenLongPressWrapper: React.FC<React.PropsWithChildren<ViewProps>> = ({
  children,
  style,
  ...rest
}) => {
  const { open } = usePostContext();

  const handleLongPress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {}
    open({ initialTab: "liked" });
  };

  return (
    <Pressable
      delayLongPress={300}
      onLongPress={handleLongPress}
      style={[{ flex: 1 }, style]}
      android_disableSound
      {...rest}
    >
      {children}
    </Pressable>
  );
};

export default ScreenLongPressWrapper;
