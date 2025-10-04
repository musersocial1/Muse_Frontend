import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Feather, Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import * as Haptics from "expo-haptics"; // 👈 add this
import React, { useEffect, useRef, useState } from "react";
import { PanGestureHandler, State } from "react-native-gesture-handler";
// import { ResizeMode } from 'react-native-video'; // Import ResizeMode

import { BlurView } from "expo-blur";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import DragToClose from "../navigations/DragToClose";
import { FadingBlurBackground } from "../ui/FadingBlurBackground";
import ClipModal from "./ClipModal";
import CreatePostStart from "./create-post-startup";
import RecordCommentModal from "./RecordCommentModal";
import RelatedPosts from "./RelatedPosts";

const { width, height } = Dimensions.get("window");

interface MediaPlayerModalProps {
  isVisible: boolean;
  onClose: () => void;
  videoUrl?: string; // Changed from ImageSourcePropType
  audioUrl?: string; // Changed from ImageSourcePropType
  title: string;
  duration: number;
  author: string;
  thumbnail?: ImageSourcePropType; // Keep this as ImageSourcePropType for Image component
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
}) => {
  // Animation values
  const slideAnim = useRef(new Animated.Value(height)).current;
  const commentSlideAnim = useRef(new Animated.Value(height)).current;
  const speedSlideAnim = useRef(new Animated.Value(height)).current;
  const insets = useSafeAreaInsets();
  const HIDE_OFFSET = 300;
  const sheetY = useRef(new Animated.Value(HIDE_OFFSET)).current;

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState<"Audio" | "Video">("Video");
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  // Modal states
  const [showComments, setShowComments] = useState(false);
  const [showSpeedControl, setShowSpeedControl] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [rulerWidth, setRulerWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showClipModal, setShowClipModal] = useState(false);
  // Add this with your other state variables
  const [dragStartPosition, setDragStartPosition] = useState(0);
  const DRAG_THRESHOLD = 2; // Minimum pixels to move before considering it a drag
  // Add this with your other state variables
  const [actualDuration, setActualDuration] = useState(duration); // Use prop as fallback
  // Add these with your other state variables
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const [showRelatedPost, setRelatedPost] = useState(false);
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
  const TICK_COUNT = 12; // 0.25 to 2.0 with 0.25 increments
  const MIN_SPEED = 0.25;
  const MAX_SPEED = 2.0;
  const playerRef = useRef<any>(null);
  useEffect(() => {
    if (isVisible) {
      StatusBar.setBarStyle("light-content");
      StatusBar.setHidden(false);

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease), // 👈 smooth open
        useNativeDriver: true,
      }).start();
    } else {
      StatusBar.setBarStyle("dark-content");
      StatusBar.setHidden(false);

      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        easing: Easing.in(Easing.ease), // 👈 smooth close
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
    const remaining = actualDuration - currentTime; // Use actualDuration instead of duration
    return formatTime(remaining);
  };

  const masterAudioRef = useRef<any>(null);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Master audio player handles play/pause automatically via shouldPlay prop
  };

  const handleRewind = () => {
    const newTime = Math.max(0, currentTime - 15);
    setCurrentTime(newTime);

    // Control master audio player
    if (masterAudioRef.current) {
      masterAudioRef.current.setPositionAsync(newTime * 1000);
    }

    // Also sync video player if in video mode
    if (activeTab === "Video" && playerRef.current) {
      playerRef.current.setPositionAsync(newTime * 1000);
    }
  };

  const handleFastForward = () => {
    const newTime = Math.min(actualDuration, currentTime + 15); // Use actualDuration instead of duration
    setCurrentTime(newTime);

    // Control master audio player
    if (masterAudioRef.current) {
      masterAudioRef.current.setPositionAsync(newTime * 1000);
    }

    // Also sync video player if in video mode
    if (activeTab === "Video" && playerRef.current) {
      playerRef.current.setPositionAsync(newTime * 1000);
    }
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

  const showSpeedModal = () => {
    const currentIndex = playbackSpeeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % playbackSpeeds.length;
    const newSpeed = playbackSpeeds[nextIndex];

    // Get current position before changing speed
    const currentPosition = currentTime * 1000;

    setPlaybackSpeed(newSpeed);

    // Sync speed and position on both players
    if (masterAudioRef.current) {
      masterAudioRef.current.setRateAsync(newSpeed, true);
      // masterAudioRef.current.setPositionAsync(currentPosition);
    }
    if (playerRef.current) {
      playerRef.current.setRateAsync(newSpeed, true);
      // playerRef.current.setPositionAsync(currentPosition);
    }
  };
  const scrollAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      const startScrolling = () => {
        scrollAnim.setValue(0);
        Animated.loop(
          Animated.timing(scrollAnim, {
            toValue: -400, // Changed from -200 to -400
            duration: 10000, // Changed from 8000 to 12000
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

  // Sync video player when switching to video tab
  // Sync video player when switching to video tab
  useEffect(() => {
    if (masterAudioRef.current && playerRef.current && activeTab === "Video") {
      // When switching to video, sync video player to audio position
      masterAudioRef.current.getStatusAsync().then((status: any) => {
        if (status.isLoaded && status.positionMillis) {
          playerRef.current.setPositionAsync(status.positionMillis);
          // Also sync the playback rate
          playerRef.current.setRateAsync(playbackSpeed, true);
        }
      });
    }
  }, [activeTab, playbackSpeed]); // ADD playbackSpeed as dependency
  const [isFullscreen, setIsFullscreen] = useState(false);

  const renderHeader = () => (
    <View className="flex-row items-center justify-between px-4 ">
      <TouchableOpacity
        onPress={onClose}
        className="p-2 absolute left-[5%] mb-5"
      >
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
  );

  const renderVideoContent = () => (
    <View className="relative overflow-hidden rounded-2xl bg-primary w-full max-w-[90%] aspect-[1/0.6] mx-auto">
      <Video
        ref={playerRef}
        source={{
          uri: "https://cubbyproduct.s3.amazonaws.com/hatespeech/output/hateSpeech_10min_output/index.m3u8",
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
        rate={playbackSpeed}
        shouldPlay={isPlaying}
        isMuted={true} // ADD THIS LINE - mute video audio
        resizeMode={ResizeMode.COVER}
        // REMOVE this onPlaybackStatusUpdate - let master handle it
        useNativeControls={false}
      />

      {!isFullscreen && (
        <TouchableOpacity
          onPress={() => playerRef.current?.presentFullscreenPlayer()}
          className="absolute bottom-3 overflow-hidden right-3 bg-black/50 rounded-full p-2"
        >
          <BlurView style={StyleSheet.absoluteFillObject} />
          <Ionicons name="expand" size={20} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderAudioContent = () => (
    <View className="relative  overflow-hidden rounded-[30px] bg-primary w-full max-w-[90%] aspect-[1/0.6] mx-auto">
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

              {/* Header */}
              <View className="flex-row items-center  gap-1 justify-center p-4 ">
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

              {/* Comment Input */}
              <View className="p-4 ">
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
                    // Add onSubmitEditing or similar handler as needed
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

              {/* Comments List */}
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
                        <Text className="text-white/70 text-[16px] leading-7 ">
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
      {/* MASTER AUDIO PLAYER - Always present regardless of tab */}
      <Video
        ref={masterAudioRef}
        source={{
          uri: "https://cubbyproduct.s3.amazonaws.com/hatespeech/output/hateSpeech_10min_output/index.m3u8",
        }}
        isMuted={false}
        shouldPlay={isPlaying}
        rate={playbackSpeed}
        isLooping={false} // Add this to prevent auto-repeat
        onLoad={(status) => {
          if (
            status.isLoaded &&
            "durationMillis" in status &&
            status.durationMillis
          ) {
            setActualDuration(status.durationMillis / 1000);
          }
        }}
        onPlaybackStatusUpdate={(status) => {
          if (status.isLoaded && status.positionMillis && !isDraggingProgress) {
            const newTime = status.positionMillis / 1000;

            // Check if video ended to prevent restart
            if (newTime >= actualDuration - 1) {
              setIsPlaying(false);
              setCurrentTime(actualDuration);
              return;
            }

            // Only update if there's a significant difference
            if (Math.abs(newTime - currentTime) > 0.5) {
              setCurrentTime(newTime);
            }

            // Sync video player when in video mode
            if (activeTab === "Video" && playerRef.current) {
              playerRef.current.setPositionAsync(status.positionMillis);
            }
          }
        }}
        className="w-0 absolute top-0"
        useNativeControls={false}
      />

      {/* BOTH PLAYERS ALWAYS MOUNTED - just conditionally visible */}
      {/* Video Content - Always mounted */}
      <View
        className={`  overflow-hidden rounded-[30px] bg-primary w-full max-w-[90%] aspect-[1/0.6] mx-auto ${
          activeTab === "Video" ? "relative" : "opacity-0 absolute"
        }`}
      >
        <Video
          ref={playerRef}
          source={{
            uri: "https://cubbyproduct.s3.amazonaws.com/hatespeech/output/hateSpeech_10min_output/index.m3u8",
          }}
          style={{
            width: "100%",
            height: "100%",
            // display: "none",
          }}
          shouldPlay={isPlaying && activeTab === "Video"} // More explicit condition
          rate={playbackSpeed}
          isMuted={true}
          resizeMode={ResizeMode.COVER}
          useNativeControls={false}
        />

        {!isFullscreen && activeTab === "Video" && (
          <TouchableOpacity
            onPress={() => playerRef.current?.presentFullscreenPlayer()}
            className="absolute bottom-3 overflow-hidden right-3 bg-black/50 rounded-full p-2"
          >
            <BlurView style={StyleSheet.absoluteFillObject} />
            <Ionicons name="expand" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Audio Content - Always mounted */}
      <View
        className={`  overflow-hidden rounded-[30px] bg-primary w-full max-w-[90%] aspect-[1/0.6] mx-auto ${
          activeTab === "Audio" ? "relative" : "opacity-0 absolute"
        }`}
      >
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
    </View>
  );

  const fabRef = useRef<View>(null);

  // start from 0 so it animates in on mount
  const fabScale = useRef(new Animated.Value(0)).current;
  const [showModal, setShowModal] = useState(false);

  // OPEN flow
  const openPost = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    setShowModal(true);
  };

  // CLOSE flow (from modal ✕)
  const handleModalRequestClose = () => {
    onClose();
    setShowModal(false);
  };

  // Add after your existing useRef declarations
  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,

      onPanResponderMove: (_, g) => {
        if (g.dy > 0) slideAnim.setValue(g.dy);
      },

      onPanResponderRelease: (_, g) => {
        if (g.dy > height / 2) {
          // Slide down & close
          Animated.timing(slideAnim, {
            toValue: height,
            duration: 220,
            easing: Easing.out(Easing.ease), // smooth exit
            useNativeDriver: true,
          }).start(() => onClose());
        } else {
          // Reset smoothly to top (no bounce)
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            easing: Easing.out(Easing.ease), // smooth reset
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="none"
      presentationStyle="fullScreen"
      statusBarTranslucent
      transparent={true} // 👈 makes background transparent
      onRequestClose={onClose}
    >
      <RecordCommentModal
        visible={showComments}
        onClose={() => setShowComments(false)}
        onSubmit={(data) => {
          console.log("Posted:", data);
          setShowComments(false);
        }}
      />

      {showModal && (
        <CreatePostStart
          showModal={showModal}
          onClose={handleModalRequestClose}
          showCommunities={false} // 👈 This will skip community selection
        />
      )}

      <Animated.View
        className="relative overflow-hidden "
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          transform: [{ translateY: slideAnim }], // Add this line
        }}
        {...responder.panHandlers} // Add this line
      >
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
                {/* Top: greenish gray, Bottom: brownish, all fully opaque */}
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
        {/* Header Overlay */}
        {renderHeader()}
        {renderContent()}

        <View className="mt-5  flex-1 justify-between w-full  mx-auto">
          <View className=" gap-3">
            <View className="overflow-hidden w-full">
              <Animated.Text
                className="text-white text-[24px] font-sfpro-bold"
                numberOfLines={1}
                style={{
                  transform: [{ translateX: scrollAnim }],
                  minWidth: 1000, // Force text to be wide enough
                }}
              >
                {title}
              </Animated.Text>
            </View>
            <View className="flex-row px-[5%] items-center">
              <Image source={icons.user} className="h-10 w-10 mr-2" />
              <Text className="text-white/50 font-sfpro-bold text-[15px]">
                By {author}
              </Text>
            </View>
          </View>

          <View className="max-w-[90%] mx-auto w-full">
            {/* Progress Bar */}
            {/* Progress Bar */}
            {/* Progress Bar */}
            <View className="px-4 mb-5">
              <View className="relative">
                <PanGestureHandler
                  onGestureEvent={(event) => {
                    if (progressBarWidth === 0) return;

                    const { x } = event.nativeEvent;
                    const progress = Math.max(
                      0,
                      Math.min(1, x / progressBarWidth)
                    );
                    const newTime = progress * actualDuration;

                    setCurrentTime(newTime);

                    // Update both players immediately while dragging
                    if (masterAudioRef.current) {
                      masterAudioRef.current.setPositionAsync(newTime * 1000);
                    }
                    if (activeTab === "Video" && playerRef.current) {
                      playerRef.current.setPositionAsync(newTime * 1000);
                    }
                  }}
                  onHandlerStateChange={(event) => {
                    const { state, x } = event.nativeEvent;

                    if (state === State.BEGAN) {
                      setDragStartPosition(x);
                      setIsDraggingProgress(true);
                      // Don't pause immediately - wait to see if it's actually a drag
                    } else if (state === State.ACTIVE) {
                      // Check if user has moved enough to be considered dragging
                      const dragDistance = Math.abs(x - dragStartPosition);
                      if (dragDistance > DRAG_THRESHOLD) {
                        // Only pause when actually dragging, not just tapping
                        setIsPlaying(false);
                      }
                    } else if (
                      state === State.END ||
                      state === State.CANCELLED
                    ) {
                      const dragDistance = Math.abs(x - dragStartPosition);

                      if (dragDistance <= DRAG_THRESHOLD) {
                        // Handle tap logic...
                      } else {
                        // This was a drag - resume playing
                        setIsPlaying(true);

                        // 🔥 ADD THIS: Explicitly restart both players
                        if (masterAudioRef.current) {
                          masterAudioRef.current.playAsync();
                        }
                        if (activeTab === "Video" && playerRef.current) {
                          playerRef.current.playAsync();
                        }
                      }
                      setIsDraggingProgress(false);
                    }
                  }}
                >
                  <View
                    className="relative  py-4" // Add padding for easier touch
                    onLayout={(event) => {
                      setProgressBarWidth(event.nativeEvent.layout.width);
                    }}
                  >
                    {/* Background track */}
                    <View className="h-2 bg-white/30  rounded-full">
                      {/* Progress fill */}
                      <View
                        className="h-full bg-white rounded-full"
                        style={{
                          width: `${(currentTime / actualDuration) * 100}%`,
                        }}
                      />
                    </View>

                    {/* Draggable thumb */}
                    <View
                      className={`absolute w-6 h-6  rounded-full top-2 shadow-lg ${
                        isDraggingProgress ? "bg-blue-500" : "bg-white"
                      }`}
                      style={{
                        left: `${(currentTime / actualDuration) * 100}%`,
                        marginLeft: -12, // Half of width for centering
                      }}
                    />

                    {/* Invisible touch area for easier dragging */}
                    <View
                      className="absolute inset-0"
                      style={{
                        backgroundColor: "transparent",
                        height: 32, // Larger touch area
                        top: -8,
                      }}
                    />
                  </View>
                </PanGestureHandler>
              </View>
            </View>

            {/* Time and Speed */}
            <View className="flex-row  items-center justify-between px-4  ">
              <View className="bg-[#FFFFFF12]/[7%]  rounded-full  p-2">
                <Image source={icons.downlaod} className="h-9 w-9" />
              </View>
              <View className="flex-row items-center bg-[white]/[20%] py-3 px-6 rounded-full">
                <Text className="text-white font-sfpro-medium text-[14px] ">
                  Time remaining {getRemainingTime()}
                </Text>
              </View>
              <TouchableOpacity
                onPress={showSpeedModal}
                className="bg-[#FFFFFF12]/[7%] rounded-full  h-12 w-12 items-center justify-center"
              >
                <Text className="text-white text-[13px] leading-[14px]  font-sfpro-medium text-center">
                  {playbackSpeed}x{" "}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Main Controls */}
          <View className="flex-row  items-center max-w-[90%]  mx-auto w-full justify-center ">
            <TouchableOpacity onPress={handleRewind} className="p-2">
              <Image source={icons.playback_left} className="h-9 w-8" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePlayPause}
              activeOpacity={95}
              className="w-[90px] aspect-square rounded-full bg-white items-center justify-center mx-8"
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={40}
                color="black"
                style={!isPlaying && { marginLeft: 2 }}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleFastForward} className="p-2 ">
              <Image source={icons.playback_right} className="h-9 w-8" />
            </TouchableOpacity>
          </View>

          {/* Bottom Controls */}
          <View className="flex-col w-[90%] mx-auto items-center gap-y-3">
            {/* See related posts */}
            <TouchableOpacity
              className="w-full flex-row items-center justify-center bg-[white]/10 border border-white/20 rounded-full px-4 py-4"
              onPress={() => setRelatedPost(true)}
            >
              <Text className="text-white font-sfpro-medium text-base">
                See related posts
              </Text>
            </TouchableOpacity>

            {/* Row of 2 buttons */}
            <View className="flex-row w-full justify-between gap-x-3">
              {/* Make a post */}
              <TouchableOpacity
                ref={fabRef}
                // onPress={() => setShowModal(true)}
                onPress={openPost}
                // onPress={() => setShowClipModal(true)}
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

              {/* Record a comment */}
              <TouchableOpacity
                onPress={showCommentsModal}
                className="flex-1 flex-row items-center border border-white/20  justify-center bg-[white]/10 rounded-full pr-4 pl-2 py-1"
              >
                <View className=" mr-2 aspect-square p-[2px]  w-7 rounded-full">
                  <View className="w-full aspect-square rounded-full bg-[#F94141] " />
                </View>
                <Text className="text-white font-sfpro-medium text-base">
                  Record a comment
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Modals */}
        {/* {renderCommentsModal()} */}
      </Animated.View>

      <ClipModal
        visible={showClipModal}
        onClose={() => setShowClipModal(false)}
      />
      <RelatedPosts
        visible={showRelatedPost}
        onClose={() => setRelatedPost(false)}
      />
    </Modal>
  );
};

export default MediaPlayerModal;
