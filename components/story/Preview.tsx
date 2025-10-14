import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

interface PreviewScreenProps {
  media: string | null;
  onBack: () => void;
  onNext: () => void;
}

const isVideo = (uri: string) => {
  return /\.(mp4|mov|webm|avi|mkv|3gp)$/i.test(uri);
};

const PreviewScreen: React.FC<PreviewScreenProps> = ({
  media,
  onBack,
  onNext,
}) => (
  <View className="flex-1 bg-primary">
    {media &&
      (isVideo(media) ? (
        <Video
          source={{ uri: media }}
          className="absolute inset-0 w-full h-full"
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          useNativeControls={false}
        />
      ) : (
        <Image
          source={{ uri: media }}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />
      ))}

    <View style={{ position: "absolute", top: "6%", left: "5%", zIndex: 10 }}>
      <TouchableOpacity
        className="w-12 h-12 rounded-full bg-[#F3F3F326]/[15%] items-center justify-center"
        onPress={onBack}
      >
        <Ionicons name="close" size={23} color="white" />
      </TouchableOpacity>
    </View>

    <View className="absolute bottom-8 left-0 right-0 flex-row items-center justify-between px-8 z-10">
      <TouchableOpacity
        className="w-14 h-14 rounded-full bg-[#F3F3F326]/[15%] items-center justify-center"
        onPress={onBack}
      >
        <Ionicons name="close" size={23} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        className="w-14 h-14 rounded-full bg-secondary items-center justify-center"
        onPress={onNext}
      >
        <Ionicons name="checkmark" size={23} color="white" />
      </TouchableOpacity>
    </View>
  </View>
);

export default PreviewScreen;
