// RefactoredMediaPlayerModal.tsx
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { usePlayer } from "@/context/PlayerContext";
import { Feather, Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import DragToClose from "../navigations/DragToClose";
import { FadingBlurBackground } from "../ui/FadingBlurBackground";
import ClipModal from "./ClipModal";

const { width, height } = Dimensions.get("window");

interface MediaPlayerModalProps {
  isVisible: boolean;
  onClose: () => void;
  videoUrl?: string;
  audioUrl?: string;
  title: string;
  duration: number;
  author: string;
  thumbnail?: ImageSourcePropType;
  trackId: string; // Add unique track ID
}

interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

const MediaPlayerModal: React.FC<MediaPlayerModalProps> = ({
  isVisible,
  onClose,
  videoUrl,
  audioUrl,
  title,
  duration,
  author,
  thumbnail,
  trackId,
}) => {
  // Get global player state and actions
  const {
    currentTrack,
    isPlaying,
    position,
    duration: trackDuration,
    playbackRate,
    playTrack,
    togglePlayPause,
    seekTo,
    setRate,
    skipForward,
    skipBackward,
  } = usePlayer();

  // Animation values
  const slideAnim = useRef(new Animated.Value(height)).current;
  const commentSlideAnim = useRef(new Animated.Value(height)).current;
  const insets = useSafeAreaInsets();
  const HIDE_OFFSET = 300;
  const sheetY = useRef(new Animated.Value(HIDE_OFFSET)).current;

  // Local UI state
  const [activeTab, setActiveTab] = useState<"Audio" | "Video">("Video");
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showClipModal, setShowClipModal] = useState(false);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const [dragStartPosition, setDragStartPosition] = useState(0);
  const DRAG_THRESHOLD = 2;

  // Video player ref (for video mode only)
  const videoPlayerRef = useRef<any>(null);

  // Check if this track is currently playing
  const isCurrentTrack = currentTrack?.id === trackId;
  const actualDuration = trackDuration || duration;
  const currentTime = isCurrentTrack ? position : 0;

  // Sample comments data
  const [comments] = useState<Comment[]>([
    {
      id: "1",
      user: "Chinyerem A",
      avatar: "👤",
      text: "Lorem ipsum dolor sit amet consectetur. Faucibus mauris orci fermentum blandit fermentum ultrices tellus dapibus tristique.",
      timestamp: "2h",
      likes: 12,
    },
    {
      id: "2",
      user: "Anonymous",
      avatar: "👤",
      text: "Great content! Really helpful for understanding the concept.",
      timestamp: "1h",
      likes: 8,
    },
    {
      id: "3",
      user: "John Smith",
      avatar: "👤",
      text: "Could you elaborate more on the implementation details?",
      timestamp: "45m",
      likes: 5,
    },
  ]);

  const playbackSpeeds = [1.0, 1.25, 1.5, 1.75, 2.0];

  // Initialize track when modal opens
  useEffect(() => {
    if (isVisible && !isCurrentTrack) {
      const track = {
        id: trackId,
        url: audioUrl || videoUrl || "",
        title,
        artist: author,
        artwork: typeof thumbnail === "string" ? thumbnail : undefined,
        duration,
      };
      playTrack(track);
    }
  }, [isVisible, trackId, isCurrentTrack]);

  // Sync video player with global audio position
  useEffect(() => {
    if (isCurrentTrack && activeTab === "Video" && videoPlayerRef.current) {
      videoPlayerRef.current.setPositionAsync(position * 1000);
      if (isPlaying) {
        videoPlayerRef.current.playAsync();
      } else {
        videoPlayerRef.current.pauseAsync();
      }
    }
  }, [position, isPlaying, activeTab, isCurrentTrack]);

  useEffect(() => {
    if (isVisible) {
      StatusBar.setBarStyle("light-content");
      StatusBar.setHidden(false);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      StatusBar.setBarStyle("dark-content");
      StatusBar.setHidden(false);
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const blurOpacity = sheetY.interpolate({
    inputRange: [0, HIDE_OFFSET],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getRemainingTime = (): string => {
    const remaining = actualDuration - currentTime;
    return formatTime(remaining);
  };

  // Updated handlers to use global player
  const handlePlayPause = () => {
    if (isCurrentTrack) {
      togglePlayPause();
    }
  };

  const handleRewind = () => {
    if (isCurrentTrack) {
      skipBackward(15);
    }
  };

  const handleFastForward = () => {
    if (isCurrentTrack) {
      skipForward(15);
    }
  };

  const handleSpeedChange = () => {
    const currentIndex = playbackSpeeds.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % playbackSpeeds.length;
    const newSpeed = playbackSpeeds[nextIndex];
    setRate(newSpeed);
  };

  const showCommentsModal = () => {
    setShowComments(true);
    Animated.spring(commentSlideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const hideCommentsModal = () => {
    Animated.timing(commentSlideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowComments(false);
    });
  };

  const scrollAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      const startScrolling = () => {
        scrollAnim.setValue(0);
        Animated.loop(
          Animated.timing(scrollAnim, {
            toValue: -400,
            duration: 10000,
            useNativeDriver: true,
          }),
          { iterations: -1 }
        ).start();
      };

      setTimeout(startScrolling, 1000);
    } else {
      scrollAnim.stopAnimation();
    }
  }, [isVisible]);

  const renderHeader = () => (
    <SafeAreaView className="pt-8 z-10">
      <View className="flex-row items-center justify-between px-4 pt-2">
        <TouchableOpacity onPress={onClose} className="p-2 mb-5">
          <Ionicons name="chevron-down" size={27} color="white" />
        </TouchableOpacity>
        <View className="flex-row bg-[#FFFFFF12]/[7%] rounded-full p-1.5 mb-6 w-[140px] h-[44px] mx-auto overflow-hidden">
          <TouchableOpacity
            onPress={() => setActiveTab("Audio")}
            className={`flex-1 items-center justify-center rounded-full ${
              activeTab === "Audio" ? "bg-white" : ""
            }`}
            activeOpacity={0.8}
          >
            <Text
              className={`text-center font-sfpro-bold text-[14px] ${
                activeTab === "Audio" ? "text-black" : "text-white"
              }`}
            >
              Audio
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("Video")}
            className={`flex-1 items-center justify-center rounded-full ${
              activeTab === "Video" ? "bg-white" : ""
            }`}
            activeOpacity={0.8}
          >
            <Text
              className={`text-center font-sfpro-bold text-[14px] ${
                activeTab === "Video" ? "text-black" : "text-white"
              }`}
            >
              Video
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );

  const renderVideoContent = () => (
    <View className="relative overflow-hidden rounded-2xl bg-primary w-full max-w-[90%] aspect-[1/0.6] mx-auto">
      <Video
        ref={videoPlayerRef}
        source={{
          uri: videoUrl || "",
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
        rate={playbackRate}
        shouldPlay={isPlaying && isCurrentTrack}
        isMuted={true} // Muted because audio comes from TrackPlayer
        resizeMode={ResizeMode.COVER}
        useNativeControls={false}
      />

      <TouchableOpacity
        onPress={() => videoPlayerRef.current?.presentFullscreenPlayer()}
        className="absolute bottom-3 overflow-hidden right-3 bg-black/50 rounded-full p-2"
      >
        <BlurView style={StyleSheet.absoluteFillObject} />
        <Ionicons name="expand" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  const renderAudioContent = () => (
    <View className="relative overflow-hidden rounded-[30px] bg-primary w-full max-w-[90%] aspect-[1/0.6] mx-auto">
      <Image
        source={thumbnail || images.media}
        resizeMode="cover"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </View>
  );

  const renderControls = () => (
    <View className="mt-5 flex-1 justify-between w-full mx-auto">
      <View className="gap-3">
        <View className="overflow-hidden w-full">
          <Animated.Text
            className="text-white text-[24px] font-sfpro-bold"
            numberOfLines={1}
            style={{
              transform: [{ translateX: scrollAnim }],
              minWidth: 1000,
            }}
          >
            {isCurrentTrack ? currentTrack.title : title}
          </Animated.Text>
        </View>
        <View className="flex-row px-[5%] items-center">
          <Image source={icons.user} className="h-10 w-10 mr-2" />
          <Text className="text-white/50 font-sfpro-bold text-[15px]">
            By {isCurrentTrack ? currentTrack.artist : author}
          </Text>
        </View>
      </View>

      <View className="max-w-[90%] mx-auto w-full">
        {/* Progress Bar */}
        <View className="px-4 mb-5">
          <View className="relative">
            <PanGestureHandler
              onGestureEvent={(event) => {
                if (progressBarWidth === 0 || !isCurrentTrack) return;

                const { x } = event.nativeEvent;
                const progress = Math.max(0, Math.min(1, x / progressBarWidth));
                const newTime = progress * actualDuration;

                // Update position immediately for smooth UI
                seekTo(newTime);
              }}
              onHandlerStateChange={(event) => {
                const { state, x } = event.nativeEvent;

                if (state === State.BEGAN) {
                  setDragStartPosition(x);
                  setIsDraggingProgress(true);
                } else if (state === State.END || state === State.CANCELLED) {
                  const dragDistance = Math.abs(x - dragStartPosition);

                  if (
                    dragDistance <= DRAG_THRESHOLD &&
                    progressBarWidth > 0 &&
                    isCurrentTrack
                  ) {
                    // Handle tap
                    const progress = Math.max(
                      0,
                      Math.min(1, x / progressBarWidth)
                    );
                    const newTime = progress * actualDuration;
                    seekTo(newTime);
                  }

                  setIsDraggingProgress(false);
                }
              }}
            >
              <View
                className="relative py-4"
                onLayout={(event) => {
                  setProgressBarWidth(event.nativeEvent.layout.width);
                }}
              >
                {/* Background track */}
                <View className="h-2 bg-white/30 rounded-full">
                  {/* Progress fill */}
                  <View
                    className="h-full bg-white rounded-full"
                    style={{
                      width: `${
                        actualDuration > 0
                          ? (currentTime / actualDuration) * 100
                          : 0
                      }%`,
                    }}
                  />
                </View>

                {/* Draggable thumb */}
                <View
                  className={`absolute w-6 h-6 rounded-full top-2 shadow-lg ${
                    isDraggingProgress ? "bg-blue-500" : "bg-white"
                  }`}
                  style={{
                    left: `${
                      actualDuration > 0
                        ? (currentTime / actualDuration) * 100
                        : 0
                    }%`,
                    marginLeft: -12,
                  }}
                />

                {/* Invisible touch area */}
                <View
                  className="absolute inset-0"
                  style={{
                    backgroundColor: "transparent",
                    height: 32,
                    top: -8,
                  }}
                />
              </View>
            </PanGestureHandler>
          </View>
        </View>

        {/* Time and Speed */}
        <View className="flex-row items-center justify-between px-4">
          <View className="bg-[#FFFFFF12]/[7%] rounded-full p-2">
            <Image source={icons.downlaod} className="h-9 w-9" />
          </View>
          <View className="flex-row items-center bg-[white]/[20%] py-3 px-6 rounded-full">
            <Text className="text-white font-sfpro-medium text-[14px]">
              Time remaining {getRemainingTime()}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleSpeedChange}
            className="bg-[#FFFFFF12]/[7%] rounded-full h-12 w-12 items-center justify-center"
          >
            <Text className="text-white text-[13px] leading-[14px] font-sfpro-medium text-center">
              {playbackRate}x
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Controls */}
      <View className="flex-row items-center max-w-[90%] mx-auto w-full justify-center">
        <TouchableOpacity onPress={handleRewind} className="p-2">
          <Image source={icons.playback_left} className="h-9 w-8" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePlayPause}
          activeOpacity={95}
          className="w-[100px] aspect-square rounded-full bg-white items-center justify-center mx-8"
          disabled={!isCurrentTrack}
        >
          <Ionicons
            name={isPlaying && isCurrentTrack ? "pause" : "play"}
            size={40}
            color="black"
            style={!isPlaying && { marginLeft: 2 }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleFastForward} className="p-2">
          <Image source={icons.playback_right} className="h-9 w-8" />
        </TouchableOpacity>
      </View>

      {/* Bottom Controls */}
      <View className="flex-col w-[90%] mx-auto items-center gap-y-3">
        <TouchableOpacity className="w-full flex-row items-center justify-center bg-[white]/10 border border-white/20 rounded-full px-4 py-4">
          <Text className="text-white font-sfpro-medium text-base">
            See related posts
          </Text>
        </TouchableOpacity>

        <View className="flex-row w-full justify-between gap-x-3">
          <TouchableOpacity
            onPress={() => setShowClipModal(true)}
            className="flex-1 flex-row border border-white/20 items-center justify-center bg-[white]/10 rounded-full px-4 py-4"
          >
            <Feather
              name="plus"
              size={18}
              color="white"
              style={{ marginRight: 6 }}
            />
            <Text className="text-white font-sfpro-medium text-base">
              Make a post
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={showCommentsModal}
            className="flex-1 flex-row items-center border border-white/20 justify-center bg-[white]/10 rounded-full pr-4 pl-2 py-1"
          >
            <View className="mr-2 aspect-square p-[2px] w-7 rounded-full">
              <View className="w-full aspect-square rounded-full bg-[#F94141]" />
            </View>
            <Text className="text-white font-sfpro-medium text-base">
              Record a comment
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderCommentsModal = () => {
    if (!showComments) return null;

    return (
      <Animated.View
        className="absolute inset-0 z-50"
        style={{ transform: [{ translateY: commentSlideAnim }] }}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={StyleSheet.absoluteFill}
          onPress={hideCommentsModal}
        >
          <FadingBlurBackground opacity={blurOpacity} />
        </TouchableOpacity>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View className="flex-1 justify-end mx-2">
            <View
              className="bg-[#1D1D1C] border border-white/10 rounded-[30px] overflow-hidden h-[80%]"
              style={{ paddingBottom: insets.bottom }}
            >
              <DragToClose translateY={sheetY} onClose={onClose} />

              <View className="flex-row items-center gap-1 justify-center p-4">
                <Ionicons
                  name="chatbox-outline"
                  size={20}
                  color="#D1D5DB"
                  className="pt-1"
                />
                <Text className="text-white text-[18px] font-medium text-center">
                  Comments 2,905
                </Text>
              </View>

              <View className="p-4">
                <View className="flex-row items-center bg-primary rounded-full px-4 py-3">
                  <TextInput
                    placeholder="Leave your comment"
                    placeholderTextColor="#9CA3AF"
                    value={commentText}
                    onChangeText={setCommentText}
                    className="flex-1 text-white text-[14.6px] font-sfpro-medium px-4 py-3 mr-3"
                    style={{
                      backgroundColor: "transparent",
                    }}
                    multiline
                  />
                  <TouchableOpacity
                    className="ml-2"
                    onPress={() => {
                      /* handle send */
                    }}
                  >
                    <Ionicons name="send" size={16} color="#007AFF" />
                  </TouchableOpacity>
                </View>
              </View>

              <ScrollView className="flex-1">
                {comments.map((comment) => (
                  <View
                    key={comment.id}
                    className="p-4 border-t border-white/5"
                  >
                    <View className="flex-row">
                      <View className="w-8 h-8 bg-gray-600 rounded-full items-center justify-center mr-3">
                        <Image source={icons.user} className="h-8 w-8" />
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center mb-1">
                          <Text className="text-white font-medium text-[16px]">
                            {comment.user}
                          </Text>
                          <Text className="text-white font-medium text-[18px] mx-1">
                            &middot;
                          </Text>
                          <Text className="text-white/50 font-medium text-[15px]">
                            {comment.timestamp}
                          </Text>
                        </View>
                        <Text className="text-white/70 text-[16px] leading-7">
                          {comment.text}
                        </Text>
                        <View className="flex-row items-center gap-1 mt-2">
                          <TouchableOpacity className="flex-row items-center">
                            <Image
                              source={icons.chat_message}
                              className="h-6 w-6"
                            />
                            <Text className="text-white text-[16px] ml-1 font-semibold">
                              245
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity className="flex-row items-center">
                            <Ionicons name="heart" size={23} color="#FF0361" />
                            <Text className="text-white text-[16px] font-semibold ml-1">
                              {comment.likes} LIKES
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    );
  };

  const renderContent = () => (
    <View className="">
      {/* Show video or audio based on active tab */}
      {activeTab === "Video" ? renderVideoContent() : renderAudioContent()}
    </View>
  );

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1">
        {/* SVG Gradient Background */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "#3e443e" }]}>
          <Svg height={height} width={width}>
            <Defs>
              <LinearGradient
                id="mediaGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <Stop offset="0%" stopColor="#50615b" stopOpacity="1" />
                <Stop offset="50%" stopColor="#3e443e" stopOpacity="1" />
                <Stop offset="100%" stopColor="#693f2e" stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect
              x="0"
              y="0"
              width={width}
              height={height}
              fill="url(#mediaGradient)"
            />
          </Svg>
        </View>

        <View className="relative overflow-hidden" style={{ flex: 1 }}>
          {renderHeader()}
          {renderContent()}
          {renderControls()}
          {renderCommentsModal()}
        </View>

        <ClipModal
          visible={showClipModal}
          onClose={() => setShowClipModal(false)}
        />
      </SafeAreaView>
    </Modal>
  );
};

export default MediaPlayerModal;
