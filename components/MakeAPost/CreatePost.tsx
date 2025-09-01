import { icons } from "@/constants/icons";
import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

export default function CreatePost() {
  type MediaItem = {
    id: string;
    uri: string;
    type: "image" | "video";
  };
  const router = useRouter();
  const [text, setText] = useState("");
  const insets = useSafeAreaInsets();
  const wordCount = useMemo(() => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }, [text]);

  const progress = Math.min(wordCount / 300, 1); // clamp 0–1

  // Circle settings
  const size = 32;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };
  const [images, setImages] = useState<{ id: string; uri: string }[]>([]);

  const [processing, setProcessing] = useState(false);

  const [media, setMedia] = useState<MediaItem[]>([]);

  const removeItem = (id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
  };

  // 📸 Camera
  const openCamera = async () => {
    try {
      const { status: camStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      if (camStatus !== "granted") {
        alert("Camera permission is required!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All, // 👈 allow both
        quality: 0.8,
      });

      if (!result.canceled) {
        setProcessing(true);
        const asset = result.assets[0];
        const newItem: MediaItem = {
          id: Date.now().toString(),
          uri: asset.uri,
          type: asset.type === "video" ? "video" : "image",
        };
        setMedia((prev) => [...prev, newItem]);
      }
    } finally {
      setProcessing(false);
    }
  };

  // 🖼️ Gallery
  const openGallery = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Media library permission is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All, // 👈 allow both
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setProcessing(true);
        const newItems: MediaItem[] = result.assets.map((asset, index) => ({
          id:
            (asset.assetId || asset.uri || Date.now().toString()) + "-" + index,
          uri: asset.uri,
          type: asset.type === "video" ? "video" : "image",
        }));
        setMedia((prev) => [...prev, ...newItems]);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View className=" flex-1 gap-5 justify-between ">
      {/* Input box */}
      <View className=" bg-[#1C1C1C] rounded-[37px] overflow-hidden">
        <View className="flex-row    items-start gap-3  p-6">
          {/* Avatar */}
          <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            className="w-10 h-10 rounded-full"
          />

          {/* Input */}
          <TextInput
            className="flex-1 text-white    min-h-28 font-sfpro-bold text-lg leading-5"
            placeholder="Start typing"
            placeholderTextColor="#888"
            value={text}
            onChangeText={setText}
            multiline
          />
        </View>
        {/* put the image design on here  */}
        {/* Attached images */}
        {processing && (
          <View className="w-full py-4 items-center justify-center">
            <Text className="text-gray-300 text-sm">Processing assets…</Text>
          </View>
        )}
        {media.length > 0 && (
          <FlatList
            data={media}
            horizontal
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 12 }}
            renderItem={({ item }) => (
              <View className="relative ml-5 mb-5">
                {item.type === "video" ? (
                  <Video
                    source={{ uri: item.uri }}
                    style={{
                      width: 315,
                      aspectRatio: 1 / 0.7,
                      borderRadius: 28,
                    }}
                    useNativeControls
                    // resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={{ uri: item.uri }}
                    className="w-[315px] aspect-[1/0.7] rounded-[28px]"
                    resizeMode="cover"
                  />
                )}

                {/* X button */}
                <TouchableOpacity
                  onPress={() => removeItem(item.id)}
                  className="absolute top-4 left-4 w-8 h-8 overflow-hidden rounded-full items-center justify-center"
                >
                  <BlurView style={StyleSheet.absoluteFill} intensity={70} />
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>

      <View className=" flex flex-row  justify-between items-center ">
        <View className="flex-row  items-center gap-2">
          <View style={{ width: size, height: size }}>
            <Svg width={size} height={size}>
              <Circle
                stroke="#2c2c2c"
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
              />
              <Circle
                stroke="#4ADE80" // green
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </Svg>
          </View>
          {/* Action buttons */}
          {/* <View className="flex flex-row gap-3"> */}
          {/* Image button */}
          <TouchableOpacity
            onPress={openGallery}
            className="w-11 h-11 rounded-full bg-yellow-900 items-center justify-center"
          >
            <Image
              source={icons.gallery}
              className="w-full h-full"
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Camera button */}
          <TouchableOpacity
            onPress={openCamera}
            className="w-11 h-11 rounded-full items-center justify-center"
          >
            <Image
              source={icons.camera}
              className="w-full h-full"
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        {/* Bottom "Next" button */}
        <View>
          <TouchableOpacity
            disabled={!text.trim()}
            //   onPress={() => router.push("/(makepost)/select-community")}
            className={`px-6  py-2 rounded-full ${
              text.trim() ? "bg-[#0368FF]" : "bg-gray-600"
            }`}
          >
            <Text className="text-white font-sfpro-bold text-xl ">Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
