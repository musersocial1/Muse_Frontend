import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { usePlayer } from "@/context/PlayerContext";
import { Feather, Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageSourcePropType,
  Modal,
  PanResponder,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  State as GestureState,
  PanGestureHandler,
} from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import ClipModal from "./ClipModal";
import RecordCommentModal from "./RecordCommentModal";
import RelatedPosts from "./RelatedPosts";

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
}

const MediaPlayerModal: React.FC<MediaPlayerModalProps> = ({
  isVisible,
  onClose,
  videoUrl,
  audioUrl,
  title,
  author,
  thumbnail,
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const insets = useSafeAreaInsets();

  const {
    isPlaying,
    position,
    duration: actualDuration,
    playbackRate,
    togglePlayPause,
    seekTo,
    setRate,
    play,
    pause,
    setShowMini,
    currentTrack,
    playTrack,
    setShowModalVideo,
    videoRef,
    onPlaybackStatusUpdate,
    onVideoLoad,
  } = usePlayer();

  const [activeTab, setActiveTab] = useState<"Audio" | "Video">("Video");
  const [showComments, setShowComments] = useState(false);
  const [showClipModal, setShowClipModal] = useState(false);
  const [showRelatedPost, setRelatedPost] = useState(false);

  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const [dragStartX, setDragStartX] = useState(0);
  const wasPlayingRef = useRef(false);
  const pausedForScrubRef = useRef(false);
  const DRAG_THRESHOLD = 5;

  const [showModal, setShowModal] = useState(false);
  const scrollAnim = useRef(new Animated.Value(0)).current;

  // Load track when modal opens
  useEffect(() => {
    if (isVisible) {
      const trackUrl =
        "https://cubbyproduct.s3.amazonaws.com/hatespeech/output/hateSpeech_10min_output/index.m3u8";

      // Only load if it's a different track or no track loaded
      if (!currentTrack || currentTrack.url !== trackUrl) {
        playTrack({
          id: `track-${Date.now()}`,
          url: trackUrl,
          title: title,
          artist: author,
          artwork: images.media,
        });
      }
    }
  }, [isVisible, videoUrl, audioUrl]);

  useEffect(() => {
    if (setShowModalVideo) {
      setShowModalVideo(isVisible && activeTab === "Video");
    }
  }, [isVisible, activeTab, setShowModalVideo]);

  // Animate modal
  useEffect(() => {
    if (isVisible) {
      setShowMini(false); // Hide mini player when modal opens
      StatusBar.setBarStyle("light-content");

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();

      // Start title scroll animation
      setTimeout(() => {
        scrollAnim.setValue(0);
        Animated.loop(
          Animated.timing(scrollAnim, {
            toValue: -400,
            duration: 10000,
            useNativeDriver: true,
          }),
          { iterations: -1 }
        ).start();
      }, 800);
    } else {
      StatusBar.setBarStyle("dark-content");

      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();

      scrollAnim.stopAnimation();
    }
  }, [isVisible]);

  const closeAndDock = () => {
    if (setShowModalVideo) {
      setShowModalVideo(false);
    }

    if (isPlaying) {
      setShowMini(true);
    }

    onClose();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const getRemainingTime = (): string => {
    const remaining = Math.max(0, (actualDuration || 0) - (position || 0));
    return formatTime(remaining);
  };

  const handleRewind = async () => {
    await seekTo(Math.max(0, (position || 0) - 15));
  };

  const handleFastForward = async () => {
    const maxPosition = actualDuration || (position || 0) + 15;
    await seekTo(Math.min(maxPosition, (position || 0) + 15));
  };

  const cyclePlaybackSpeed = async () => {
    const speeds = [1.0, 1.25, 1.5, 1.75, 2.0];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    await setRate(nextSpeed);
  };

  const renderHeader = () => (
    <View className="flex-row items-center justify-between px-4">
      <TouchableOpacity
        onPress={closeAndDock}
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

  const renderContent = () => (
    <View className="relative overflow-hidden rounded-[30px] bg-black w-full max-w-[90%] aspect-[1/0.6] mx-auto">
      {activeTab === "Video" ? (
        <View className="w-full h-full bg-black items-center justify-center">
          {currentTrack ? (
            <Video
              ref={videoRef}
              source={{ uri: currentTrack.url }}
              style={StyleSheet.absoluteFillObject}
              isMuted={false}
              useNativeControls={false}
              onPlaybackStatusUpdate={onPlaybackStatusUpdate}
              onLoad={onVideoLoad}
              resizeMode={ResizeMode.COVER}
              progressUpdateIntervalMillis={500}
            />
          ) : null}
        </View>
      ) : (
        <View className="relative  overflow-hidden rounded-[30px] bg-primary w-full  aspect-[1/1] mx-auto">
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
      )}
    </View>
  );

  const openPost = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setShowModal(true);
  };

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) slideAnim.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > height / 2) {
          Animated.timing(slideAnim, {
            toValue: height,
            duration: 220,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }).start(() => closeAndDock());
        } else {
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            easing: Easing.out(Easing.ease),
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
      statusBarTranslucent
      transparent
      onRequestClose={closeAndDock}
    >
      <Animated.View
        className="relative overflow-hidden"
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          transform: [{ translateY: slideAnim }],
          backgroundColor: "#3e443e",
        }}
        {...responder.panHandlers}
      >
        {/* Gradient background */}
        <View style={[StyleSheet.absoluteFill]}>
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

        {renderHeader()}
        {renderContent()}

        {/* Title + Author */}
        <View className="mt-5 flex-1 justify-between w-full mx-auto">
          <View className="gap-3">
            <View className="overflow-hidden w-full px-[5%]  max-w-[95%] mx-auto">
              <Animated.Text
                className="text-white text-[24px] font-sfpro-bold"
                numberOfLines={1}
                style={{
                  transform: [{ translateX: scrollAnim }],
                  minWidth: 1000,
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

          {/* Progress Bar */}
          <View className="max-w-[90%] mx-auto w-full px-4 mb-5">
            <PanGestureHandler
              onGestureEvent={({ nativeEvent: { x } }) => {
                if (
                  progressBarWidth === 0 ||
                  !actualDuration ||
                  isDraggingProgress
                )
                  return;
                const clamped = Math.max(0, Math.min(1, x / progressBarWidth));
                const newTime = clamped * actualDuration;
                seekTo(newTime);
              }}
              onHandlerStateChange={async ({ nativeEvent: { state, x } }) => {
                if (state === GestureState.BEGAN) {
                  setDragStartX(x);
                  setIsDraggingProgress(true);
                  wasPlayingRef.current = isPlaying;
                  pausedForScrubRef.current = false;
                } else if (state === GestureState.ACTIVE) {
                  const dragDistance = Math.abs(x - dragStartX);
                  if (
                    dragDistance > DRAG_THRESHOLD &&
                    !pausedForScrubRef.current
                  ) {
                    if (isPlaying) {
                      await pause();
                      pausedForScrubRef.current = true;
                    }
                  }
                } else if (
                  state === GestureState.END ||
                  state === GestureState.CANCELLED ||
                  state === GestureState.FAILED
                ) {
                  const dragDistance = Math.abs(x - dragStartX);

                  // Only resume if it was actually a drag (not just a tap)
                  if (
                    dragDistance > DRAG_THRESHOLD &&
                    pausedForScrubRef.current &&
                    wasPlayingRef.current
                  ) {
                    await play();
                  }

                  setIsDraggingProgress(false);
                  pausedForScrubRef.current = false;
                }
              }}
            >
              <View
                className="relative py-4"
                onLayout={(e) =>
                  setProgressBarWidth(e.nativeEvent.layout.width)
                }
              >
                <View className="h-2 bg-white/30 rounded-full">
                  <View
                    className="h-full bg-white rounded-full"
                    style={{
                      width: `${
                        actualDuration
                          ? ((position || 0) / actualDuration) * 100
                          : 0
                      }%`,
                    }}
                  />
                </View>
                <View
                  className="absolute w-6 h-6 rounded-full top-2 shadow-lg"
                  style={{
                    left: `${
                      actualDuration
                        ? ((position || 0) / actualDuration) * 100
                        : 0
                    }%`,
                    marginLeft: -12,
                    backgroundColor: isDraggingProgress ? "#3b82f6" : "#fff",
                  }}
                />
                <View
                  className="absolute inset-0"
                  style={{
                    height: 32,
                    top: -8,
                    backgroundColor: "transparent",
                  }}
                />
              </View>
            </PanGestureHandler>
          </View>

          {/* Time & Speed Controls */}
          <View className="flex-row items-center justify-between px-4 mb-4">
            <View className="bg-[#FFFFFF12]/[7%] rounded-full p-2">
              <Image source={icons.downlaod} className="h-9 w-9" />
            </View>
            <View className="flex-row items-center bg-[white]/[20%] py-3 px-6 rounded-full">
              <Text className="text-white font-sfpro-medium text-[14px]">
                Time remaining {getRemainingTime()}
              </Text>
            </View>
            <TouchableOpacity
              onPress={cyclePlaybackSpeed}
              className="bg-[#FFFFFF12]/[7%] rounded-full h-12 w-12 items-center justify-center"
            >
              <Text className="text-white text-[13px] leading-[14px] font-sfpro-medium text-center">
                {playbackRate}x
              </Text>
            </TouchableOpacity>
          </View>

          {/* Main Controls */}
          <View className="flex-row items-center max-w-[90%] mx-auto w-full justify-center mb-4">
            <TouchableOpacity onPress={handleRewind} className="p-2">
              <Image source={icons.playback_left} className="h-9 w-8" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={togglePlayPause}
              activeOpacity={0.95}
              className="w-[90px] aspect-square rounded-full bg-white items-center justify-center mx-8"
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={40}
                color="black"
                style={!isPlaying && { marginLeft: 2 }}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleFastForward} className="p-2">
              <Image source={icons.playback_right} className="h-9 w-8" />
            </TouchableOpacity>
          </View>

          {/* Bottom Buttons */}
          <View className="flex-col w-[90%] mx-auto items-center gap-y-3 mb-4">
            <TouchableOpacity
              className="w-full flex-row items-center justify-center bg-[white]/10 border border-white/20 rounded-full px-4 py-4"
              onPress={() => setRelatedPost(true)}
            >
              <Text className="text-white font-sfpro-medium text-base">
                See related posts
              </Text>
            </TouchableOpacity>

            <View className="flex-row w-full justify-between gap-x-3">
              <TouchableOpacity
                onPress={openPost}
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
                onPress={() => setShowComments(true)}
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
      </Animated.View>

      <ClipModal
        visible={showClipModal}
        onClose={() => setShowClipModal(false)}
      />
      <RelatedPosts
        visible={showRelatedPost}
        onClose={() => setRelatedPost(false)}
      />
      <RecordCommentModal
        visible={showComments}
        onClose={() => setShowComments(false)}
        onSubmit={(data) => {
          console.log("Posted:", data);
          setShowComments(false);
        }}
      />
    </Modal>
  );
};

export default MediaPlayerModal;
