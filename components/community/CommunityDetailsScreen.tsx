import { Feather, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useRef, useState } from "react";

import {
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

interface CommunityData {
  name: string;
  coverImage?: string;
  bio?: string;
  links: string[];
}

const CommunityEdit: React.FC<{
  data: CommunityData;
  onUpdate: (data: Partial<CommunityData>) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ data, onUpdate, onNext, onBack }) => {
  const [bioText, setBioText] = useState(data.bio || "");
  const [linkInput, setLinkInput] = useState("");

  const MAX_CHARS = 150;
  const charCount = bioText.length;
  const remainingChars = Math.max(0, MAX_CHARS - charCount);

  const insets = useSafeAreaInsets();

  const badRef = useRef<ScrollView>(null);

  const handleBioFocus = () => {
    setTimeout(
      () => {
        badRef.current?.scrollTo({ y: 10000, animated: true });
      },
      Platform.OS === "ios" ? 250 : 350
    );
  };

  const addLink = () => {
    const trimmed = linkInput.trim();
    if (trimmed && !data.links.includes(trimmed)) {
      onUpdate({
        ...data,
        links: [...data.links, trimmed],
      });
      setLinkInput("");
    }
  };

  const removeLink = (index: number) => {
    onUpdate({
      ...data,
      links: data.links.filter((_, i) => i !== index),
    });
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      ref={badRef}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
    >
      <View style={{ paddingTop: insets.top }} className="relative">
        <View className="aspect-[1/0.6] justify-center items-center w-full relative">
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            className="ml-5 h-14 left-0 w-14 absolute top-0 overflow-hidden border-white/30 border rounded-full bg-black/20 items-center justify-center z-20"
          >
            <BlurView style={[StyleSheet.absoluteFill]} />
            <Feather
              name="chevron-left"
              size={20}
              color="#fff"
              style={{ opacity: 0.7 }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="justify-center items-center"
            onPress={onBack}
          >
            <View className="bg-[rgba(255,255,255,0.9)] px-6 py-3 rounded-[25px]">
              <Text className="text-black text-[16px] font-semibold">
                Edit image
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View className="flex-1 px-5">
          <View className="px-6 rounded-[20px] flex-row items-center overflow-hidden h-[4.5rem] mb-2">
            <BlurView
              intensity={30}
              tint="light"
              style={[StyleSheet.absoluteFill]}
            />

            <Text className="text-[20px] font-sfpro-bold tracking-wider text-white/80 my-2">
              {data.name || "Dancemania"}
            </Text>
          </View>

          {/* Bio Section */}
          <View className="mt-2 mb-8">
            <View className="overflow-hidden rounded-[20px] px-6 py-8">
              <BlurView
                intensity={30}
                tint="light"
                style={[StyleSheet.absoluteFill]}
              />
              <Text className="text-[16px] font-sfpro-bold text-white">
                Community bio
              </Text>
              <TextInput
                value={bioText}
                onChangeText={(text) => {
                  setBioText(text);
                  onUpdate({ bio: text });
                }}
                onFocus={handleBioFocus}
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                className="text-white/60 text-[16px] font-neutral-regular tracking-widest leading-6 min-h-[100px] text-top"
                multiline
                maxLength={500}
              />
              <View className="flex-row items-center mt-3">
                <Text className="text-[13px] font-neutral-regular mr-3 text-white/40">
                  {remainingChars} characters remaining
                </Text>

                <CircleProgress progress={Math.min(charCount / MAX_CHARS, 1)} />
              </View>
            </View>

            <View className="mt-4">
              <View className="px-0 rounded-[20px] flex-row items-center overflow-hidden h-[4.5rem] mb-2">
                <BlurView
                  intensity={30}
                  tint="light"
                  style={StyleSheet.absoluteFill}
                />

                <TextInput
                  value={linkInput}
                  onChangeText={setLinkInput}
                  placeholder="Enter a links"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                  style={{
                    flex: 1,
                    fontSize: 18,
                    color: "white",
                    fontWeight: "600",
                    paddingHorizontal: 12,
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

              {data.links.map((item, index) => (
                <View
                  key={`${item}-${index}`}
                  className="flex-row items-center justify-between px-3.5 py-5 mb-2 rounded-[12px]"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: 16,
                      flex: 1,
                    }}
                  >
                    {item}
                  </Text>
                  <TouchableOpacity onPress={() => removeLink(index)}>
                    <Ionicons
                      name="close-circle-outline"
                      size={22}
                      color="red"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default CommunityEdit;
