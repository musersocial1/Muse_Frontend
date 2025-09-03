import { icons } from "@/constants/icons";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DragToClose from "../navigations/DragToClose";
import { FadingBlurBackground } from "../ui/FadingBlurBackground";

const { width } = Dimensions.get("window");

interface VideoComment {
  id: string;
  thumbnail: ImageSourcePropType;
  likes: string;
  title: string;
}

interface TextComment {
  id: string;
  author: {
    name: string;
    username: string;
    profileImage: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
}

interface VideoCommentsModalProps {
  visible: boolean;
  onClose: () => void;
  videoComments: VideoComment[];
  textComments: TextComment[];
  onLeaveComment?: () => void;
  onRecordComment?: () => void;
}

type TabMode = "videos" | "replies";

const VideoCommentsModal: React.FC<VideoCommentsModalProps> = ({
  visible,
  onClose,
  videoComments,
  textComments,
  onLeaveComment = () => console.log("Leave comment pressed"),
  onRecordComment = () => console.log("Record comment pressed"),
}) => {
  const [tabMode, setTabMode] = useState<TabMode>("replies");

  const insets = useSafeAreaInsets();
  const HIDE_OFFSET = 300;
  const sheetY = useRef(new Animated.Value(HIDE_OFFSET)).current;

  useEffect(() => {
    if (visible) {
      sheetY.setValue(HIDE_OFFSET);
      Animated.timing(sheetY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      sheetY.setValue(HIDE_OFFSET);
      setTimeout(() => {
        setTabMode("videos");
      }, 300);
    }
  }, [visible]);

  const blurOpacity = sheetY.interpolate({
    inputRange: [0, HIDE_OFFSET],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const closeWithSlide = () => {
    Animated.timing(sheetY, {
      toValue: HIDE_OFFSET,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const renderTabSelector = () => {
    return (
      <View className="flex-row bg-[#FFFFFF26]/[15%] rounded-full p-1  mb-6 w-[200px] mx-auto">
        <TouchableOpacity
          onPress={() => setTabMode("replies")}
          className={`flex-1 py-3.5 px-3 rounded-full ${
            tabMode === "replies" ? "bg-white" : ""
          }`}
          activeOpacity={0.8}
        >
          <Text
            className={`text-center font-bold text-[16px] ${
              tabMode === "replies" ? "text-[#121212]" : "text-white/60"
            }`}
          >
            Replies
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setTabMode("videos")}
          className={`flex-1 py-3.5 px-6 rounded-full ${
            tabMode === "videos" ? "bg-white" : ""
          }`}
          activeOpacity={0.8}
        >
          <Text
            className={`text-center font-bold text-[16px] ${
              tabMode === "videos" ? "text-[#121212]" : "text-white/60"
            }`}
          >
            Videos
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderVideoCard = (video: VideoComment, index: number) => {
    const cardWidth = (width - 20) / 3 - 8; // 3 cards per row with spacing

    return (
      <TouchableOpacity
        key={video.id}
        className="rounded-3xl overflow-hidden mb-3"
        style={{ width: cardWidth, height: 200 }}
        activeOpacity={0.8}
      >
        <Image
          source={video.thumbnail}
          className="w-full h-full"
          resizeMode="cover"
        />

        <View className="absolute top-3 left-3 bg-[#00000030]/[19%] rounded-full px-2 py-2 flex-row items-center">
          <Feather name="heart" size={12} color="white" className="mr-1" />
          <Text className="text-white text-[13px] font-medium ml-1">
            {video.likes}
          </Text>
        </View>

        {/* Play button */}
        <View className="absolute inset-0 items-center justify-center">
          <View className="bg-black/50 rounded-full p-2">
            <Image
              source={icons.play}
              className="h-4 w-4"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Title overlay */}
        <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <Text className="text-white text-[12px] font-bold" numberOfLines={2}>
            {video.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderVideosView = () => {
    const displayedVideos =
      tabMode === "videos" ? videoComments : videoComments.slice(0, 3);

    return (
      <View className="px-2 pt-3 bg-[#232323] rounded-3xl mx-2  mb-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-[#FFFFFF]/60 text-[18px] font-bold">
            Video comments
          </Text>
          {tabMode === "replies" && (
            <TouchableOpacity
              onPress={() => setTabMode("videos")}
              className="bg-[#FFFFFF24]/[14%] rounded-full px-4 py-3"
              activeOpacity={0.8}
            >
              <Text className="text-white text-[14px] font-medium">
                See all
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Video Grid */}
        <ScrollView className="mb-2" showsVerticalScrollIndicator={false}>
          <View className="flex-row flex-wrap justify-between  ">
            {displayedVideos.map((video, index) =>
              renderVideoCard(video, index)
            )}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderTextComments = () => {
    return (
      <ScrollView className="px-3 mt-4" showsVerticalScrollIndicator={false}>
        {textComments.map((comment) => (
          <View
            key={comment.id}
            className="mb-6 border-t border-[#D9D9D9]/[20%]"
          >
            <View className="flex-row items-center mb-3 pt-10">
              <View className="w-12 h-12 rounded-full overflow-hidden mr-3">
                <Image
                  source={{ uri: comment.author.profileImage }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              <View className="flex-1">
                <Text className="text-white text-[16px] font-bold">
                  {comment.author.name}
                </Text>
                <Text className="text-white/50 text-[14px] font-medium">
                  {comment.author.username}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Text className="text-white/50 text-[14px] font-medium mr-2">
                  {comment.timestamp}
                </Text>
                <TouchableOpacity>
                  <Ionicons
                    name="ellipsis-vertical"
                    size={16}
                    color="#FFFFFF50"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Comment Content */}
            <Text className="text-white text-[15px] font-normal leading-5 mb-3">
              {comment.content}
            </Text>

            {/* Likes Count */}
            <Text className="text-white/50 text-[13px] font-medium mb-3">
              {comment.likes.toLocaleString()} Likes
            </Text>

            {/* Action Buttons */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row">
                <TouchableOpacity className="flex-row items-center bg-[#FFFFFF]/[8%] rounded-full px-4 py-3 mr-3">
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={18}
                    color="#D1D5DB"
                  />
                  <Text className="text-white text-[14px] font-medium ml-2">
                    {comment.replies}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center bg-[#FFFFFF]/[8%] rounded-full px-4 py-3">
                  <Feather name="heart" size={16} color="#D1D5DB" />
                  <Text className="text-white text-[14px] font-medium ml-2">
                    245k
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row">
                <TouchableOpacity className="bg-[#FFFFFF]/[8%] p-3 rounded-full mr-2">
                  <Feather name="send" size={16} color="white" />
                </TouchableOpacity>

                <TouchableOpacity className="bg-[#FFFFFF]/[8%] p-3 rounded-full">
                  <Feather name="bookmark" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderBottomActions = () => {
    return (
      <View className="px-6 pb-6">
        <View className="flex-row bg-[#454545] rounded-full p-2">
          <View className="w-12 h-12 rounded-full overflow-hidden mr-3">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          <TouchableOpacity
            onPress={onLeaveComment}
            className="flex-1 bg-transparent rounded-full px-4 py-3 mr-3 justify-center"
            activeOpacity={0.8}
          >
            <Text className="text-white/60 text-[16px] font-medium">
              Leave a comment
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center bg-[#00000066]/[40%] rounded-full p-2">
            <View className="w-5 h-5 rounded-full items-center justify-center mr-2 ">
              <Image source={icons.record} className="h-full w-full" />
            </View>
            <Text className="text-white font-sfpro-regular text-sm">
              Record a comment
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        {/* Dimmed / blur background overlay */}
        <TouchableOpacity
          activeOpacity={1}
          style={StyleSheet.absoluteFill}
          onPress={closeWithSlide}
        >
          <FadingBlurBackground opacity={blurOpacity} />
        </TouchableOpacity>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={insets.bottom}
        >
          <Animated.View
            style={{
              transform: [{ translateY: sheetY }],
              width: "100%",
            }}
            className="w-full max-w-lg self-center"
          >
            <View className="bg-[#1C1C1C] w-full rounded-t-[30px] overflow-hidden">
              <DragToClose translateY={sheetY} onClose={onClose} />

              {/* Tab Selector */}
              {renderTabSelector()}

              <ScrollView style={{ maxHeight: 600 }}>
                {renderVideosView()}
                {tabMode === "replies" && renderTextComments()}
              </ScrollView>

              {tabMode === "replies" && renderBottomActions()}
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default VideoCommentsModal;
