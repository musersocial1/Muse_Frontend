import { images } from "@/constants/images";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProgressiveBlur from "../ui/progressiveBlur";

interface PrivacyScreenProps {
  onClose: () => void;
}

const Privacy: React.FC<PrivacyScreenProps> = ({ onClose }) => {
  const [isPrivate, setIsPrivate] = useState(false);
  const insets = useSafeAreaInsets();

  const handlePrivateToggle = (value: boolean) => {
    setIsPrivate(value);
  };

  const handlePublicToggle = (value: boolean) => {
    setIsPrivate(!value);
  };

  const handleSave = () => {
    const privacyData = {
      isPrivate,
      privacyType: isPrivate ? "private" : "public",
    };

    console.log("Saving privacy data:", privacyData);
    onClose();
  };

  return (
    <View className="flex-1 bg-primary rounded-3xl overflow-hidden">
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            zIndex: 1,
            height: 1500,
          },
        ]}
      >
        <ProgressiveBlur useAlt={true} />
        <View className="w-full aspect-[1/3] rounded-3xl">
          <Image
            source={images.bg_2}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      </Animated.View>

      {/* Header */}
      <View
        style={{ paddingTop: insets.top + 16 }}
        className="flex-row relative items-center px-6  z-[200]"
      >
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.7}
          className="h-14 w-14 overflow-hidden border-white/30 border rounded-full bg-black/20 items-center justify-center"
        >
          <BlurView style={[StyleSheet.absoluteFill]} />
          <Feather
            name="chevron-left"
            size={20}
            color="#fff"
            style={{ opacity: 0.7 }}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1 relative z-[100]"
      >
        <View className="px-6 mt-20">
          <Text className="text-white text-2xl font-bold mb-8">
            Community type
          </Text>

          <View className="space-y-6 mb-8">
            {/* Private Option */}
            <TouchableOpacity
              onPress={() => handlePrivateToggle(true)}
              activeOpacity={0.8}
              className="rounded-2xl px-4 py-6 overflow-hidden bg-transparent"
              // style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white text-lg font-semibold">
                  Private
                </Text>
                <Switch
                  value={isPrivate}
                  onValueChange={handlePrivateToggle}
                  trackColor={{ false: "#374151", true: "#4ADE80" }}
                  thumbColor={isPrivate ? "#FFFFFF" : "#9CA3AF"}
                />
              </View>
              <Text className="text-gray-300 text-sm leading-5">
                Only approved members can see who's in the group and what they
                post.
              </Text>
            </TouchableOpacity>

            {/* Public Option */}
            <TouchableOpacity
              onPress={() => handlePublicToggle(true)}
              activeOpacity={0.8}
              className="rounded-2xl px-4 py-6 overflow-hidden"
              // style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white text-lg font-semibold">Public</Text>
                <Switch
                  value={!isPrivate}
                  onValueChange={handlePublicToggle}
                  trackColor={{ false: "#374151", true: "#4ADE80" }}
                  thumbColor={!isPrivate ? "#FFFFFF" : "#9CA3AF"}
                />
              </View>
              <Text className="text-gray-300 text-sm leading-5">
                Anyone can see who's in the group and what they post.
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <View
        className="px-6 pb-8 relative z-[200] "
        style={{
          paddingBottom: Math.max(insets.bottom, 20) + 16,
        }}
      >
        <TouchableOpacity
          onPress={handleSave}
          className="rounded-full bg-[#0368FF] py-4"
          activeOpacity={0.8}
        >
          <Text className="text-white text-xl font-sfpro-bold text-center">
            Save Changes
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Privacy;
