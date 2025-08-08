import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";

import {
  ActionSheetIOS,
  Alert,
  Keyboard,
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
}

const CommunityEdit: React.FC<{
  data: CommunityData;
  onUpdate: (data: Partial<CommunityData>) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ data, onUpdate, onNext, onBack }) => {
  const [bioText, setBioText] = useState(data.bio || "");
  const [showActions, setShowActions] = useState(false);

  // Instead of wordCount and remainingWords
  const MAX_CHARS = 150;
  const charCount = bioText.length;
  const remainingChars = Math.max(0, MAX_CHARS - charCount);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "We need access to your photo library"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onUpdate({ coverImage: result.assets[0].uri });
      setShowActions(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "We need access to your camera");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onUpdate({ coverImage: result.assets[0].uri });
      setShowActions(false);
    }
  };

  const deleteImage = () => {
    onUpdate({ coverImage: undefined });
    setShowActions(false);
  };

  const showImageOptions = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            "Edit image",
            "Delete image",
            "Upload from gallery",
            "Take from camera",
            "Cancel",
          ],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 4,
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              pickImage();
              break;
            case 1:
              deleteImage();
              break;
            case 2:
              pickImage();
              break;
            case 3:
              takePhoto();
              break;
          }
        }
      );
    } else {
      setShowActions(true);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const insets = useSafeAreaInsets();

  const badRef = useRef<ScrollView>(null);

  const handleBioFocus = () => {
    setTimeout(
      () => {
        badRef.current?.scrollTo({ y: 10000, animated: true });
      },
      Platform.OS === "ios" ? 250 : 350
    ); // adjust as needed
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      // className="flex-1"
      ref={badRef}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ paddingTop: insets.top }} className="   relative">
        {/* Header Section */}
        <View className=" aspect-[1/0.6] justify-center items-center w-full relative">
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            className="ml-5 h-14 left-0 w-14 absolute top-0  overflow-hidden border-white/30 border rounded-full bg-black/20 items-center justify-center z-20"
            // bg-white/10 = white at 10% opacity, matches that soft look in your image
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
            className="justify-center items-center "
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
        <View className="flex-1  px-5">
          <View className=" px-6 rounded-[20px] flex-row items-center overflow-hidden h-[4.5rem] mb-2">
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
            <View className=" overflow-hidden rounded-[20px] px-6 py-8">
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
                // placeholder="Tell people what this community is about..."
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                className="text-white/60 text-[16px] font-neutral-regular tracking-widest leading-6 min-h-[100px] text-top"
                multiline
                maxLength={500}
              />
              <View className="flex-row items-center mt-3">
                <Text className="text-[13px] font-neutral-regular mr-3 text-white/40">
                  {remainingChars} characters remaining
                </Text>
                {/* CircleProgress, pass charCount/MAX_CHARS */}
                <CircleProgress progress={Math.min(charCount / MAX_CHARS, 1)} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default CommunityEdit;
