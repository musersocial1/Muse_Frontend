import { icons } from "@/constants/icons";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { VideoComment } from "@/types/post";
import { Feather, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DragToClose from "../navigations/DragToClose";
import { FadingBlurBackground } from "../ui/FadingBlurBackground";
import VideoReply from "./video-reply";

const { width } = Dimensions.get("window");

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
  onRecordComment?: (video: any) => void;
  onOpenVideo: (video: any) => void;
}

type TabMode = "videos" | "replies";

const VideoCommentsModal: React.FC<VideoCommentsModalProps> = ({
  visible,
  onClose,
  videoComments,
  textComments,
  onLeaveComment = () => console.log("Leave comment pressed"),
  onRecordComment,
  onOpenVideo,
}) => {
  const [tabMode, setTabMode] = useState<TabMode>("replies");
  const [comment, setComment] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { height } = Dimensions.get("window");

  const insets = useSafeAreaInsets();
  const HIDE_OFFSET = height;
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
      }, 10);
    }
  }, [visible]);

  const [showVideoReply, setShowVideoReply] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,

      onPanResponderMove: (_, g) => {
        if (g.dy > 0) sheetY.setValue(g.dy);
      },

      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          Animated.timing(sheetY, {
            toValue: 600,
            duration: 220,
            useNativeDriver: true,
          }).start(() => onClose());
        } else {
          Animated.spring(sheetY, {
            toValue: 0,
            bounciness: 6,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const pagerX = useRef(new Animated.Value(0)).current;
  const progress = pagerX.interpolate({
    inputRange: [0, width], // page 0 -> page 1
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const TAB_DARK = "rgb(18,18,18)";
  const TAB_LIGHT = "rgba(255,255,255,0.6)";

  // Left label (Videos): dark near page 0, fade to light by mid
  const videosTextColor = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [TAB_DARK, TAB_LIGHT, TAB_LIGHT],
  });

  // Right label (Replies): light until mid, dark near page 1
  const repliesTextColor = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [TAB_LIGHT, TAB_LIGHT, TAB_DARK],
  });

  const pagerRef = useRef<ScrollView | null>(null);
  const [segW, setSegW] = useState(0);

  const segItemW = segW / 2; // 2 tabs
  const indicatorX = pagerX.interpolate({
    inputRange: [0, width], // page 0 -> page 1
    outputRange: [0, segItemW], // pill move under second tab
    extrapolate: "clamp",
  });

  const scrollToPage = (i: number) => {
    setTabMode(i === 0 ? "videos" : "replies");
    pagerRef.current?.scrollTo({ x: i * width, animated: true });
  };

  const thumbRefs = useRef<{ [key: string]: any }>({});

  const handleOpenVideo = (index: number, id: string) => {
    setShowVideoReply(true);
  };

  const anim = useRef(new Animated.Value(0)).current; // 0 → 1

  const renderTabSelector = () => {
    return (
      <View
        onLayout={(e) => setSegW(e.nativeEvent.layout.width)}
        className="flex-row bg-[#FFFFFF26]/[15%] rounded-full p-1.5 mb-6 w-[170px] h-[47px] mx-auto overflow-hidden"
      >
        {/* sliding pill */}
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: segItemW || 0.1,
            transform: [{ translateX: indicatorX }],
          }}
          className="bg-white rounded-full"
        />

        <TouchableOpacity
          onPress={() => scrollToPage(0)}
          className="flex-1 items-center justify-center rounded-full"
          activeOpacity={0.8}
        >
          <Animated.Text
            className="text-center font-sfpro-bold text-[14px]"
            style={{ color: videosTextColor }}
          >
            Videos
          </Animated.Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => scrollToPage(1)}
          className="flex-1 items-center justify-center rounded-full"
          activeOpacity={0.8}
        >
          <Animated.Text
            className="text-center font-sfpro-bold text-[14px]"
            style={{ color: repliesTextColor }}
          >
            Replies
          </Animated.Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderVideoCard = (video: VideoComment, index: number) => {
    const cardWidth = (width - 20) / 3 - 8; // 3 cards per row with spacing

    return (
      <TouchableOpacity
        key={video.id}
        ref={(r: any) => (thumbRefs.current[video.id] = r)} // 👈 save ref
        className="rounded-[21px]   aspect-[1/1.5] overflow-hidden mb-2"
        style={{ width: cardWidth }}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: video.thumbnail }}
          className="w-full h-full"
          resizeMode="cover"
        />

        <View className="absolute top-3 left-3  rounded-full p-2.5 flex-row items-center overflow-hidden">
          <BlurView
            style={StyleSheet.absoluteFill}
            tint="dark"
            intensity={50}
            experimentalBlurMethod="dimezisBlurView"
          />

          <Feather name="heart" size={12} color="white" className="" />
          <Text className="text-white text-[12px] font-sfpro-medium ml-1">
            {video.likes}
          </Text>
        </View>

        {/* Play button */}
        <TouchableOpacity
          // onPress={() => {
          //   setActiveIndex(index);
          //   setShowVideoReply(true);
          // }}
          onPress={() => handleOpenVideo(index, video.id)} // 👈 open with scale
          className="absolute inset-0 items-center justify-center"
        >
          <View className=" overflow-hidden rounded-full p-3">
            <BlurView
              style={StyleSheet.absoluteFill}
              tint="dark"
              intensity={50}
              experimentalBlurMethod="dimezisBlurView"
            />
            <Image
              source={icons.play}
              className="h-4 w-4"
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderVideosView = () => {
    const displayedVideos = videoComments;

    return (
      <View className="px-3 pb-3  bg-[#232323] rounded-[30px] mx-2 ">
        <View className="flex-row    justify-center items-center p-6">
          <Text className="text-[#FFFFFF]/60 text-[17px]   text-center font-sfpro-medium">
            Video comments
          </Text>
        </View>

        <FlatList
          data={videoComments}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item, index }) => renderVideoCard(item, index)}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };

  const renderTextComments = () => {
    return (
      <FlatList
        data={textComments}
        keyExtractor={(item, index) => item.id ?? index.toString()}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderVideosPreview()} // 👈 your preview stays at the top
        renderItem={({ item: comment }) => (
          <React.Fragment>
            <View className="px-5">
              <View className="mb-6 ">
                <View className="flex-row items-center mb-3 pt-10">
                  <View className="w-12 h-12 rounded-full overflow-hidden mr-3">
                    <Image
                      source={{ uri: comment.author.profileImage }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-white text-[16px] font-sfpro-bold">
                      {comment.author.name}
                    </Text>
                    <Text className="text-white/50 text-[14px] font-sfpro-medium">
                      {comment.author.username}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <Text className="text-white/50 text-[14px] font-sfpro-medium mr-2">
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
                <Text className="text-white text-[15px] font-sfpro-medium leading-5 mb-3">
                  {comment.content}
                </Text>

                {/* Likes Count */}
                <Text className="text-white/50 text-[13px] font-sfpro-medium mb-3">
                  {comment.likes.toLocaleString()} Likes
                </Text>

                {/* Action Buttons */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row">
                    <TouchableOpacity className="flex-row items-center bg-[#FFFFFF]/[8%] rounded-full px-3 py-4 mr-3">
                      <Ionicons
                        name="chatbubble-ellipses-outline"
                        size={18}
                        color="#D1D5DB"
                      />
                      <Text className="text-white text-[14px] font-sfpro-medium ml-2">
                        {comment.replies}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center bg-[#FFFFFF]/[8%] rounded-full px-3 py-4">
                      <Feather name="heart" size={16} color="#D1D5DB" />
                      <Text className="text-white text-[14px] font-sfpro-medium ml-2">
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
            </View>

            <View className="border-b border-b-[#D9D9D9]/[20%] w-full" />
          </React.Fragment>
        )}
      />
    );
  };

  const renderBottomActions = () => {
    return (
      <View className="px-4 ">
        <View className="flex-row items-center bg-[#454545] rounded-full p-2">
          <View className="w-12 ml-1.5 h-12 rounded-full overflow-hidden">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Leave a comment"
            placeholderTextColor="#FFFFFF80"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 text-white text-[14.6px] font-sfpro-medium px-4 py-3 mr-3"
            style={{
              backgroundColor: "transparent",
            }}
          />

          <TouchableOpacity
            onPress={onRecordComment}
            className="flex-row items-center bg-[#00000066]/[40%] rounded-full p-4"
          >
            <View className="w-5 h-5 rounded-full items-center justify-center mr-2">
              <Image source={icons.record} className="h-full w-full" />
            </View>
            <Text className="text-white font-sfpro-regular tracking-tighter text-sm">
              Record a comment
            </Text>
          </TouchableOpacity>
        </View>

        {/* EXTRA KEYBOARD BAR (only when focused) */}
        {/* {isFocused && (
          <View className="flex-row items-center justify-between px-4 py-2 bg-[#1C1C1C]">
            <View className="flex-row items-center space-x-4">
              <TouchableOpacity>
                <Ionicons name="happy-outline" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="image-outline" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="search" size={22} color="white" />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center space-x-3">
              <Text className="text-white/60 text-sm">
                {comment.length}/280
              </Text>
              <TouchableOpacity
                disabled={comment.trim().length === 0}
                className={`px-4 py-1.5 rounded-full ${
                  comment.trim().length > 0 ? "bg-blue-500" : "bg-[#444]"
                }`}
              >
                <Text className="text-white font-bold text-sm">Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        )} */}
      </View>
    );
  };

  const renderVideosPreview = () => {
    if (!videoComments?.length) return null;
    const preview = videoComments.slice(0, 3);
    const cardWidth = (width - 20) / 3 - 8; // same sizing

    return (
      <View className="px-3 pb-3 bg-[#232323] rounded-[30px] mx-2 mb-3">
        <View className="flex-row justify-between items-center p-4">
          <Text className="text-[#FFFFFF]/60 text-[17px] font-sfpro-medium">
            Video comments
          </Text>
          {videoComments.length > 3 && (
            <TouchableOpacity
              onPress={() => scrollToPage(0)}
              className="bg-[#FFFFFF]/[14%] rounded-full px-4 py-3"
              activeOpacity={0.8}
            >
              <Text className="text-white text-[14px] font-sfpro-medium">
                See all
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-row flex-wrap justify-between px-1 pb-2">
          {preview.map((video, i) => (
            <View
              key={video.id}
              style={{ width: cardWidth }}
              className="rounded-[21px] aspect-[1/1.5] overflow-hidden mb-2"
            >
              {/** reuse internals of renderVideoCard without wrapping ScrollView */}
              <Image
                source={{ uri: video.thumbnail }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute top-3 left-3 rounded-full p-2.5 flex-row items-center overflow-hidden">
                <BlurView
                  style={StyleSheet.absoluteFill}
                  tint="dark"
                  intensity={50}
                  experimentalBlurMethod="dimezisBlurView"
                />
                <Feather name="heart" size={12} color="white" />
                <Text className="text-white text-[13px] font-sfpro-medium ml-1">
                  {video.likes}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  router.replace(RouterConstantUtil.posts.videoReply as any)
                }
                className="absolute inset-0 items-center justify-center"
              >
                <View className="overflow-hidden rounded-full p-3">
                  <BlurView
                    style={StyleSheet.absoluteFill}
                    tint="dark"
                    intensity={50}
                    experimentalBlurMethod="dimezisBlurView"
                  />
                  <Image
                    source={icons.play}
                    className="h-4 w-4"
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
              {/* <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <Text
                  className="text-white text-[12px] font-bold"
                  numberOfLines={2}
                >
                  {video.title}
                </Text>
              </View> */}
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={onClose}
      >
        {showVideoReply && (
          <View style={StyleSheet.absoluteFill}>
            <VideoReply
              videos={videoComments}
              showVideoReply={showVideoReply}
              startIndex={activeIndex ?? 0}
              onClose={() => setShowVideoReply(false)}
            />
          </View>
        )}

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
              <View className="bg-[#1C1C1C]   w-full rounded-t-[30px] overflow-hidden ">
                <View {...responder.panHandlers} className="">
                  <DragToClose translateY={sheetY} onClose={onClose} />

                  {/* Tab Selector */}
                  {renderTabSelector()}
                </View>

                <Animated.ScrollView
                  ref={pagerRef}
                  // nestedScrollEnabled
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  scrollEventThrottle={16}
                  style={{ maxHeight: height * 0.65 }}
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: pagerX } } }],
                    { useNativeDriver: false }
                  )}
                  onMomentumScrollEnd={(e) => {
                    const page = Math.round(
                      e.nativeEvent.contentOffset.x / width
                    );
                    setTabMode(page === 0 ? "videos" : "replies");
                  }}
                  contentContainerStyle={{
                    paddingBottom:
                      Platform.OS == "android" ? 145 : insets.bottom + 120,
                  }}
                  className={" "}
                >
                  {/* Page 0: full Videos grid (keeps your existing render) */}
                  <View style={{ width }}>{renderVideosView()}</View>

                  {/* Page 1: Replies + 3-video preview */}
                  <View style={{ width, height: height * 0.75 }}>
                    {renderTextComments()}
                  </View>
                </Animated.ScrollView>
                <View
                  style={{
                    bottom: Platform.OS == "android" ? 5 : insets.bottom,
                    zIndex: 10,
                  }}
                  className="left-0  absolute right-0"
                >
                  {renderBottomActions()}
                </View>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
};

export default VideoCommentsModal;
