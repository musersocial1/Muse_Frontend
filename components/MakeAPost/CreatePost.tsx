import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { BlurView } from "expo-blur";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MediaItem } from "../modals/create-post-startup";

interface CreatePostProps {
  text: string;
  setText: (value: string) => void;
  media: MediaItem[];
  removeItem: (id: string) => void;
  processing: boolean;
  inputRef: React.RefObject<TextInput | null>; // ✅ allow null
}

export default function CreatePost({
  text,
  setText,
  media,
  removeItem,
  processing,
  inputRef,
}: CreatePostProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <View className=" flex-1 gap-5  justify-between ">
      {/* Input box */}
      <View className=" bg-[#1C1C1C] rounded-[37px] overflow-hidden">
        <View className="flex-row    items-start gap-3  p-6">
          {/* Avatar */}
          <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            className="w-12 h-12 rounded-full"
          />

          {/* Input */}
          <TextInput
            className="flex-1 text-white   min-h-28 font-sfpro-medium text-lg leading-5"
            placeholder="Start typing"
            placeholderTextColor="#888"
            value={text}
            onChangeText={setText}
            multiline
            ref={inputRef}
            textAlignVertical="top" // ✅ fixes Android vertical centering issue
          />
        </View>
        {/* put the image design on here  */}
        {/* Attached images */}
        {/* Processing banner */}
        {processing && (
          <View
            accessibilityRole="progressbar"
            accessibilityLiveRegion="polite"
            className="w-full pb-6 px-6 flex-row items-center gap-3"
          >
            <ActivityIndicator size="small" />
            <Text className="text-gray-300 text-sm font-neutral-medium tracking-wider">
              Just a moment
            </Text>
          </View>
        )}
        {media.length > 0 && (
          <FlatList
            data={media}
            horizontal
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 12 }}
            renderItem={({ item }) => (
              <View className="relative border-white/20 border rounded-[28px] ml-5 w-[315px] aspect-[1/0.7] overflow-hidden  mb-2">
                {item.type === "video" ? (
                  <Video
                    source={{ uri: item.uri }}
                    style={{
                      width: 315,
                      aspectRatio: 1 / 0.7,
                      borderRadius: 28,
                    }}
                    useNativeControls
                    resizeMode={ResizeMode.COVER}
                    shouldPlay={playingId === item.id}
                    onPlaybackStatusUpdate={(status) => {
                      if (!status.isLoaded) return; // narrow type ✅

                      if (status.isPlaying) {
                        setPlayingId(item.id); // mark this as the only playing video
                      }
                    }}
                  />
                ) : (
                  <Image
                    source={{ uri: item.uri }}
                    className=" w-full h-full "
                    resizeMode="cover"
                  />
                )}

                {/* X button */}
                <TouchableOpacity
                  onPress={() => removeItem(item.id)}
                  className="absolute top-4 left-4 w-8 h-8 overflow-hidden rounded-full items-center justify-center"
                >
                  <BlurView
                    style={StyleSheet.absoluteFill}
                    intensity={70}
                    experimentalBlurMethod="dimezisBlurView"
                  />
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}
