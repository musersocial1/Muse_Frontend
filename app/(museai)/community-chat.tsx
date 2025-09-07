import AIModal from "@/components/modals/AiModal";
import FloatingAIButton from "@/components/museai/FloatingAiButton";
import { images } from "@/constants/images";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ImageView from "react-native-image-viewing";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get("window");

interface Message {
  id: string;
  text?: string;
  sender: string;
  timestamp: string;
  isCurrentUser: boolean;
  avatar?: string;
  images?: string[];
  type?: "text" | "image";
}

export default function TaylorStansChat() {
  const [showAIModal, setShowAIModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState<{ uri: string }[]>([]);

  const messages: Message[] = [
    {
      id: "1",
      text: "Hi, everyone i just joined",
      sender: "James",
      timestamp: "12:34 M",
      isCurrentUser: true,
      avatar: images.img6,
      type: "text",
    },
    {
      id: "2",
      text: "can anyone put me up to speed on everything",
      sender: "James",
      timestamp: "12:34 M",
      isCurrentUser: true,
      avatar: images.img6,
      type: "text",
    },
    {
      id: "3",
      text: "I'm really excited to be here!",
      sender: "James",
      timestamp: "12:35 M",
      isCurrentUser: true,
      avatar: images.img6,
      type: "text",
    },
    {
      id: "4",
      text: "Hi, James",
      sender: "User",
      timestamp: "12:36 M",
      isCurrentUser: false,
      type: "text",
      avatar: images.img7,
    },
    {
      id: "5",
      text: "Welcome my name is John steve",
      sender: "John Steve",
      timestamp: "12:37 M",
      isCurrentUser: false,
      avatar: images.img5,
      type: "text",
    },
    {
      id: "6",
      text: "Some images to catch up",
      sender: "Taylor Fan",
      timestamp: "12:38 M",
      isCurrentUser: false,
      avatar: images.img8,
      images: [
        images.img21,
        images.img22,
        images.img6,
        images.img5,
        images.img7,
        images.img8,
        images.img2,
        images.img4,
        images.img6,
        images.img5,
      ],
      type: "image",
    },
  ];

  // Group consecutive messages from the same sender
  const groupedMessages = messages.reduce((acc, message, index) => {
    const prevMessage = messages[index - 1];
    const nextMessage = messages[index + 1];

    const isConsecutiveWithPrev =
      prevMessage &&
      prevMessage.sender === message.sender &&
      prevMessage.isCurrentUser === message.isCurrentUser;

    const isConsecutiveWithNext =
      nextMessage &&
      nextMessage.sender === message.sender &&
      nextMessage.isCurrentUser === message.isCurrentUser;

    acc.push({
      ...message,
      showAvatar: !isConsecutiveWithNext, // Show avatar only on the last message of a group
      isFirstInGroup: !isConsecutiveWithPrev,
      isLastInGroup: !isConsecutiveWithNext,
    });

    return acc;
  }, [] as (Message & { showAvatar: boolean; isFirstInGroup: boolean; isLastInGroup: boolean })[]);

  const handleImagePicker = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Sorry, we need camera roll permissions to make this work!"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        console.log(
          "Selected images:",
          result.assets.map((asset) => asset.uri)
        );
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  const handleImagePress = (images: any[], index: number) => {
    const imageViewerData = images.map((img) => {
      const resolved = Image.resolveAssetSource(img);
      return { uri: resolved.uri };
    });

    setCurrentImages(imageViewerData);
    setCurrentImageIndex(index);
    setImageViewerVisible(true);
  };

  const renderPolaroidImages = (images: string[]) => {
    const maxVisible = Math.min(images.length, 6); // Show max 6

    return (
      <View className="relative">
        {images.slice(0, maxVisible).map((imageUri, index) => {
          // this is  varied rotations and positions for polaroid effect
          const rotations = [
            "-15deg",
            "12deg",
            "-8deg",
            "18deg",
            "-12deg",
            "6deg",
          ];
          const xTranslations = [-25, 20, -15, 30, -20, 15];
          const yTranslations = [0, 60, 120, 30, 90, 150];
          const zIndexes = [6, 5, 4, 3, 2, 1];

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleImagePress(images, index)}
              className="absolute"
              style={{
                transform: [
                  { rotate: rotations[index] || "0deg" },
                  { translateX: xTranslations[index] || 0 },
                  { translateY: yTranslations[index] || index * 20 },
                ],
                zIndex: zIndexes[index] || 1,
              }}
            >
              <View className="bg-white rounded-3xl p-2 shadow-lg">
                <Image
                  source={imageUri as ImageSourcePropType}
                  className="w-40 h-48 rounded-2xl"
                  style={{ resizeMode: "cover" }}
                />
                {index === maxVisible - 1 && images.length > maxVisible && (
                  <View className="absolute inset-0 bg-black/50 rounded-2xl items-center justify-center">
                    <Text className="text-white text-xl font-bold">
                      +{images.length - maxVisible}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
        {/* Spacer to account for stacked images */}
        <View style={{ height: 200 + maxVisible * 30 }} />
      </View>
    );
  };

  const renderImageMessage = (
    message: Message & { showAvatar: boolean; isLastInGroup: boolean }
  ) => (
    <View className={`${message.isLastInGroup ? "mb-5" : "mb-1"}`}>
      {/* Text part of the message */}
      {message.text && (
        <View className="flex-row items-end mb-3">
          {message.showAvatar && message.avatar && (
            <Image
              source={message.avatar as ImageSourcePropType}
              className="w-8 h-8 rounded-full mr-2 mb-1"
            />
          )}
          {!message.showAvatar && <View className="w-10" />}
          <View className="flex-1">
            <View
              className="bg-[#363636] px-4 py-3 max-w-[80%]"
              style={{
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                borderBottomRightRadius: 20,
                borderBottomLeftRadius: message.showAvatar ? 4 : 20,
              }}
            >
              <Text className="text-white text-[15px]">{message.text}</Text>
              {message.isLastInGroup && (
                <Text className="text-gray-400 text-xs mt-1">
                  {message.timestamp}
                </Text>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Polaroid Images */}
      {message.images && message.images.length > 0 && (
        <View className="ml-10">
          {renderPolaroidImages(message.images)}
          {message.isLastInGroup && !message.text && (
            <View className="flex-row items-center justify-end mt-1">
              <Text className="text-gray-500 text-xs mr-1">
                {message.timestamp}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderTextMessage = (
    message: Message & {
      showAvatar: boolean;
      isFirstInGroup: boolean;
      isLastInGroup: boolean;
    }
  ) => (
    <View
      className={`${message.isLastInGroup ? "mb-5" : "mb-1"} ${
        message.isCurrentUser ? "items-end" : "items-start"
      }`}
    >
      {message.isCurrentUser ? (
        <View>
          <View
            className="bg-[#FFFFFF] px-4 py-3 max-w-[80%]"
            style={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              borderBottomLeftRadius: 20,
              // borderBottomRightRadius: message.isLastInGroup ? 4 : 20,
            }}
          >
            <Text className="text-black text-[15px]">{message.text}</Text>
            {message.isLastInGroup && (
              <View className="flex-row items-center justify-end mt-1">
                <Text className="text-[#000000] text-xs mr-1">
                  {message.timestamp}
                </Text>
                <Text className="text-blue-500 text-xs">✓✓</Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        <View className="flex-row items-end">
          {message.showAvatar && message.avatar ? (
            <Image
              source={message.avatar as ImageSourcePropType}
              className="w-8 h-8 rounded-full mr-2 mb-1"
            />
          ) : (
            <View className="w-10" />
          )}
          <View className="flex-1">
            <View
              className="bg-[#363636] px-4 py-3 max-w-[80%]"
              style={{
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                borderBottomRightRadius: 20,
                // borderBottomLeftRadius: message.isLastInGroup ? 4 : 20,
              }}
            >
              <Text className="text-[#FFFFFF] text-[15px]">{message.text}</Text>
              {message.isLastInGroup && (
                <View className="flex-row items-center justify-end mt-1">
                  <Text className="text-gray-500 text-xs mr-1">
                    {message.timestamp}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="flex-1 bg-[#121212]">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <View className="flex-row items-center justify-between px-3 py-4">
            <TouchableOpacity
              onPress={() =>
                router.replace(RouterConstantUtil.tabs.profile as any)
              }
              activeOpacity={0.7}
              className="h-14 w-14 border-[#58585854]/[33%] border rounded-full bg-[#36363652]/[32%] items-center justify-center z-20"
            >
              <Feather
                name="chevron-left"
                size={20}
                color="#fff"
                style={{ opacity: 0.7 }}
              />
            </TouchableOpacity>

            <View className="flex-1 items-center justify-center px-4">
              <View className="flex-row items-center mb-1">
                <Text className="text-white text-[20px] font-bold mr-2">
                  Taylors Stans
                </Text>
                <View className="w-5 h-5 bg-secondary rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-bold">✓</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="relative h-6 w-12 flex-row mr-1">
                  <Image
                    source={images.img6}
                    className="w-6 h-6 rounded-full z-30 overflow-hidden"
                  />
                  <Image
                    source={images.img5}
                    className="w-6 h-6 rounded-full absolute left-3 z-20 overflow-hidden"
                  />
                  <Image
                    source={images.img7}
                    className="w-6 h-6 rounded-full absolute left-6 z-10 overflow-hidden"
                  />
                </View>
                <Text className="text-gray-400 font-bold text-[12px]">
                  +65 Members
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              className="ml-5 h-14 w-14 border-[#58585854]/[33%] border rounded-full bg-[#36363652]/[32%] items-center justify-center z-20"
            >
              <Feather
                name="more-vertical"
                size={20}
                color="#fff"
                style={{ opacity: 0.7 }}
              />
            </TouchableOpacity>
          </View>

          {/* Chat Messages */}
          <ScrollView
            className="flex-1 px-4 pt-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {groupedMessages.map((message) => (
              <View key={message.id}>
                {message.type === "image"
                  ? renderImageMessage(message)
                  : renderTextMessage(message)}
              </View>
            ))}
          </ScrollView>

          {/* Input Area */}
          <View className="px-4  py-4 bg-[#121212]">
            <View className="flex-row items-center gap-2 space-x-3">
              <TouchableOpacity
                onPress={handleImagePicker}
                className="w-14 h-14 items-center justify-center border border-dashed rounded-full border-[#FFFFFF1A]/[20%]"
              >
                <Feather name="plus" size={28} color="white" />
              </TouchableOpacity>

              <View className="flex-1 bg-transparent border border-[#FFFFFF1A]/[15%] rounded-full px-4 py-3 flex-row items-center">
                <TextInput
                  className="flex-1 text-white text-base pb-2"
                  placeholder="Leave a comment"
                  placeholderTextColor="#9CA3AF"
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                  style={{ maxHeight: 120 }}
                />

                <TouchableOpacity
                  className="ml-2 py-2.5 px-6 bg-secondary rounded-full items-center justify-center"
                  onPress={() => {
                    console.log("Sending message:", commentText);
                    setCommentText("");
                  }}
                >
                  <Feather name="arrow-up" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <FloatingAIButton setShowAIModal={setShowAIModal} />
        </KeyboardAvoidingView>

        <ImageView
          images={currentImages}
          imageIndex={currentImageIndex}
          visible={imageViewerVisible}
          onRequestClose={() => setImageViewerVisible(false)}
          animationType="fade"
          swipeToCloseEnabled={true}
          doubleTapToZoomEnabled={true}
        />

        <AIModal showAIModal={showAIModal} setShowAIModal={setShowAIModal} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
