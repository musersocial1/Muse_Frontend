import { Feather, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useRef, useState } from "react";

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CircleProgress from "../ui/CircleProgress";

interface CommunityDetailsProps {
  onClose: () => void;
}

const CommunityDetails: React.FC<CommunityDetailsProps> = ({ onClose }) => {
  const [communityName, setCommunityName] = useState("Dancemania");
  const [bioText, setBioText] = useState("");
  const [linkInput, setLinkInput] = useState("");
  const [links, setLinks] = useState<string[]>([]);

  const MAX_CHARS = 150;
  const charCount = bioText.length;
  const remainingChars = Math.max(0, MAX_CHARS - charCount);

  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const handleBioFocus = () => {
    setTimeout(
      () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      },
      Platform.OS === "ios" ? 250 : 350
    );
  };

  const handleLinkInputFocus = () => {
    setTimeout(
      () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      },
      Platform.OS === "ios" ? 250 : 350
    );
  };

  const addLink = () => {
    const trimmed = linkInput.trim();
    if (trimmed && !links.includes(trimmed)) {
      setLinks([...links, trimmed]);
      setLinkInput("");
    }
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const communityData = {
      name: communityName,
      bio: bioText,
      links: links,
    };

    console.log("Saving community data:", communityData);

    onClose();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View className="flex-1 bg-primary rounded-3xl overflow-hidden">
        <View className="flex-row relative  items-center px-6 py-4  z-[200]">
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            className="absolute  ml-5 h-14 left-0 w-14  top-4 overflow-hidden border-white/30 border rounded-full bg-black/20 items-center justify-center z-20"
          >
            <BlurView
              style={[StyleSheet.absoluteFill]}
              experimentalBlurMethod="dimezisBlurView"
            />
            <Feather
              name="chevron-left"
              size={20}
              color="#fff"
              style={{ opacity: 0.7 }}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          className="flex-1 relative z-[100]"
        >
          <View className="px-5 mt-20">
            <View className="px-6 rounded-[20px] flex-row items-center overflow-hidden h-[4.5rem] mb-6">
              <BlurView
                intensity={10}
                tint="light"
                style={[StyleSheet.absoluteFill]}
                experimentalBlurMethod="dimezisBlurView"
              />
              <Text className="text-[20px] font-sfpro-bold tracking-wider text-white/80 my-2">
                {communityName}
              </Text>
            </View>

            <View className="mb-6">
              <View className="overflow-hidden rounded-[20px] px-6 py-8">
                <BlurView
                  intensity={10}
                  tint="light"
                  style={[StyleSheet.absoluteFill]}
                  className="bg-[rgba(28, 28, 28, 0.7)]"
                  experimentalBlurMethod="dimezisBlurView"
                />
                <Text className="text-[16px] font-sfpro-bold text-white mb-4">
                  Community bio
                </Text>
                <TextInput
                  value={bioText}
                  onChangeText={(text) => {
                    setBioText(text);
                  }}
                  onFocus={handleBioFocus}
                  placeholder="Enter your community bio..."
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  className="text-white/80 text-[16px] font-neutral-regular tracking-widest leading-6 min-h-[100px]"
                  multiline
                  maxLength={500}
                  textAlignVertical="top"
                />
                <View className="flex-row items-center mt-4">
                  <Text className="text-[13px] font-neutral-regular mr-3 text-white/40">
                    {remainingChars} characters remaining
                  </Text>
                  <CircleProgress
                    progress={Math.min(charCount / MAX_CHARS, 1)}
                  />
                </View>
              </View>
            </View>

            <View className="mb-6">
              <View className="pr-1 pl-4 rounded-[20px] flex-row items-center overflow-hidden h-[4.5rem] mb-4">
                <BlurView
                  intensity={10}
                  tint="light"
                  style={StyleSheet.absoluteFill}
                  experimentalBlurMethod="dimezisBlurView"
                />
                <TextInput
                  value={linkInput}
                  onChangeText={setLinkInput}
                  placeholder="Enter a link"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                  onFocus={handleLinkInputFocus}
                  style={{
                    flex: 1,
                    fontSize: 18,
                    color: "white",
                    fontWeight: "600",
                  }}
                  onSubmitEditing={addLink}
                />
                <TouchableOpacity
                  onPress={addLink}
                  style={{ paddingHorizontal: 12 }}
                >
                  <Ionicons name="add-circle-outline" size={25} color="white" />
                </TouchableOpacity>
              </View>

              {links.map((item, index) => (
                <View
                  key={`${item}-${index}`}
                  className="flex-row items-center justify-between px-4 py-4 mb-2 rounded-[12px]"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: 16,
                      flex: 1,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {item}
                  </Text>
                  <TouchableOpacity onPress={() => removeLink(index)}>
                    <Ionicons
                      name="close-circle-outline"
                      size={22}
                      color="#ff4444"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* <View style={{ height: 120 }} /> */}
          </View>
        </ScrollView>

        <View
          className="px-5 pb-8 relative z-[100]"
          style={{
            paddingBottom: Math.max(insets.bottom, 20) + 16,
            backgroundColor: "rgba(21, 17, 21, 0.95)",
          }}
        >
          <TouchableOpacity
            onPress={handleSave}
            className="rounded-full bg-[#0368FF] py-5"
            activeOpacity={0.8}
          >
            <Text className="text-white text-xl font-sfpro-bold text-center">
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CommunityDetails;
