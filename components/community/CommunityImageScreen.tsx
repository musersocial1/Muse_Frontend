import { icons } from "@/constants/icons";
import { CommunityData } from "@/types/community";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProgressBar from "./ProgressBar";

const CommunityImageScreen: React.FC<{
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

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    setUploading(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9], // Maintain aspect ratio for cover image
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        onUpdate({ coverImage: result.assets[0].uri });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    // Request camera permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera permissions to take photos.",
        [{ text: "OK" }]
      );
      return;
    }

    setUploading(true);

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        onUpdate({ coverImage: result.assets[0].uri });
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    } finally {
      setUploading(false);
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

  return (
    <View className="flex-1 items-center justify-center max-h-screen">
      <LinearGradient
        colors={["#0368FF", "#703636", "#000000"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.background}
      />

      <TouchableOpacity
        className="absolute top-3 left-2 h-14 w-14 z-20"
        onPress={onBack}
      >
        <Image source={icons.back_2} className="h-14 w-14 opacity-50" />
      </TouchableOpacity>

      <SafeAreaView className="flex-1 w-[80%] mx-auto">
        <View className="flex-1 justify-center items-center">
          <View className="w-full max-w-2xl">
            <TouchableOpacity
              onPress={showImageOptions}
              disabled={uploading}
              className="w-full h-80 rounded-3xl overflow-hidden mb-8 bg-[#00000026]/[6%]"
            >
              {data.coverImage ? (
                <View className="relative w-full h-full">
                  <Image
                    source={{ uri: data.coverImage }}
                    className="w-full h-full"
                    style={{ resizeMode: "cover" }}
                  />
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
                </View>
              ) : (
                <View className="flex-1 justify-center items-center">
                  <View className="bg-white bg-opacity-90 px-6 py-3.5 rounded-full flex-row items-center">
                    <Text className="text-[#000000] font-bold mr-2">
                      {uploading ? "Uploading..." : "Add cover image"}
                    </Text>
                    {!uploading && (
                      <View className="p-1 bg-gray-100 rounded-full">
                        <Ionicons name="add" size={20} color="black" />
                      </View>
                    )}
                  </View>
                </View>
              )}
            </TouchableOpacity>

            {/* Community Name */}
            <Text className="text-white text-2xl font-bold text-center">
              {data.name || "Community Name"}
            </Text>
          </View>
        </View>

        {/* Bottom Section */}
        <View className="pb-0">
          <ProgressBar currentStep={2} totalSteps={7} />

          <TouchableOpacity
            onPress={onNext}
            className="bg-secondary rounded-full py-4"
            disabled={uploading}
            style={{
              opacity: uploading ? 0.7 : 1,
            }}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Save & Continue
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CommunityImageScreen;

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
