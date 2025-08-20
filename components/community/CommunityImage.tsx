import { communityAPI } from "@/lib/api/community";
import { showError } from "@/lib/toast";
import { CommunityData } from "@/types/community";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CommunityImage: React.FC<{
  data: CommunityData;
  onUpdate: (data: Partial<CommunityData>) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ data, onUpdate, onNext, onBack }) => {
  const [uploading, setUploading] = useState(false);

  const requestPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to upload images.",
          [{ text: "OK" }]
        );
        return false;
      }
    }
    return true;
  };

  const uploadImageToS3 = async (uri: string, fileType: string) => {
    try {
      const getFileExtension = (mimeType: string): string => {
        const extensions: { [key: string]: string } = {
          "image/jpeg": "jpg",
          "image/jpg": "jpg",
          "image/png": "png",
          "image/gif": "gif",
          "image/webp": "webp",
        };
        return extensions[mimeType] || "jpg";
      };

      const fileExtension = getFileExtension(fileType);
      const uploadData = await communityAPI.getCoverImageUploadUrl(
        fileExtension,
        data.coverImageKey
      );

      if (!uploadData.success) {
        showError("Failed", "Failed to get upload URL");
        throw new Error("Failed to get upload URL");
      }

      const fileResponse = await fetch(uri);
      const blob = await fileResponse.blob();

      const typedBlob = new Blob([blob], { type: fileType });

      const uploadResponse = await fetch(uploadData.uploadURL, {
        method: "PUT",
        body: typedBlob,
        headers: {
          "Content-Type": fileType,
        },
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("Upload failed:", errorText);
        showError("Failed", errorText);
        throw new Error(
          `Failed to upload image: ${uploadResponse.status} - ${errorText}`
        );
      }

      console.log("Upload successful!");
      return {
        fileURL: uploadResponse.url,
        key: uploadData.key,
        uploadURL: uploadData.uploadURL,
      };
    } catch (error: any) {
      console.error("Upload error details:", error);

      if (
        error.code === "NETWORK_ERROR" ||
        error.message.includes("Network Error")
      ) {
        showError(
          "Network connection failed.",
          "Please check your internet connection and try again."
        );
        throw new Error(
          "Network connection failed. Please check your internet connection and try again."
        );
      } else if (error.response) {
        console.error("API Error Response:", error.response.data);
        showError("Failed", error.response.data?.message);
        throw new Error(
          `API Error: ${error.response.data?.message || "Unknown error"}`
        );
      } else {
        showError("Failed", "Failed to upload cover image");
        throw error;
      }
    }
  };

  const getFileTypeFromUri = (uri: string): string => {
    const extension = uri.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "jpg":
      case "jpeg":
        return "jpeg";
      case "png":
        return "png";
      case "gif":
        return "gif";
      case "webp":
        return "webp";
      default:
        return "jpeg";
    }
  };

  const processImageUpload = async (imageUri: string) => {
    setUploading(true);

    try {
      const fileType = getFileTypeFromUri(imageUri);
      const uploadResult = await uploadImageToS3(imageUri, fileType);

      onUpdate({
        coverImage: uploadResult.fileURL,
        coverImageKey: uploadResult.key,
        coverImageUploadUrl: uploadResult.uploadURL,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      showError("Upload Error", "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        await processImageUpload(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera permissions to take photos.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        await processImageUpload(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "Add Cover Image",
      "Choose how you want to add your cover image",
      [
        { text: "Camera", onPress: takePhoto },
        { text: "Photo Library", onPress: pickImage },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 relative">
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.7}
        className="absolute top-5 left-5 h-14 w-14 border-white/30 border rounded-full bg-black/20 items-center justify-center z-20"
        style={{ marginTop: insets.top }}
      >
        <Feather
          name="chevron-left"
          size={20}
          color="#fff"
          style={{ opacity: 0.7 }}
        />
      </TouchableOpacity>

      <View className="flex-1 justify-center items-center px-6">
        <View className="items-center">
          <View className="bg-[#FFFFFF12]/[7%] p-4 rounded-full flex-row items-center mb-10">
            <Text className="text-white font-bold mr-2 text-[16px]">
              Add cover image
            </Text>
            <View className="p-1 bg-white rounded-full">
              <Ionicons
                name="add"
                size={18}
                color="#284794"
                className="text-[#284794]"
              />
            </View>
          </View>

          {/* Image Upload Circle */}
          <TouchableOpacity
            onPress={showImageOptions}
            disabled={uploading}
            className="w-40 h-40 rounded-full overflow-hidden mb-8 bg-white border-[4px] border-solid border-[#FFFFFF]/[50%]"
          >
            {data.coverImage ? (
              <View className="relative w-full h-full">
                <Image
                  source={{ uri: data.coverImage }}
                  className="w-full h-full"
                  style={{ resizeMode: "cover" }}
                />
                {uploading ? (
                  <View
                    className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                  >
                    <View className="bg-white bg-opacity-90 px-4 py-3 rounded-full flex-row items-center">
                      <ActivityIndicator
                        size="small"
                        color="#000"
                        style={{ marginRight: 8 }}
                      />
                      <Text className="text-black font-semibold">
                        Uploading...
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View
                    className="absolute inset-0 bg-black bg-opacity-30 justify-center items-center"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
                  >
                    <View className="bg-white bg-opacity-90 px-4 py-2 rounded-full">
                      <Text className="text-black font-semibold">
                        Change Image
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <View className="flex-1 justify-center items-center">
                {uploading ? (
                  <View className="bg-white bg-opacity-90 px-4 py-3 rounded-full flex-row items-center">
                    <ActivityIndicator
                      size="small"
                      color="#000"
                      style={{ marginRight: 8 }}
                    />
                    <Text className="text-black font-semibold">
                      Uploading...
                    </Text>
                  </View>
                ) : (
                  <View className="bg-white bg-opacity-90 pr-2 pl-3.5 py-2.5 rounded-full flex-row items-center">
                    <View className="p-1 bg-transparent rounded-full">
                      <Ionicons
                        name="add"
                        size={40}
                        color="#284794"
                        className="text-[#284794]"
                      />
                    </View>
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>

          <Text className="text-white/50 tracking-wider text-[18px] font-bold text-center">
            Add Display Image
          </Text>
        </View>
      </View>

      <View className="pb-20 px-6">
        <Text className="text-white/80 tracking-wider text-2xl font-sfpro-bold text-center">
          {data.name || "Community Name"}
        </Text>
      </View>
    </View>
  );
};

export default CommunityImage;
