import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Feather, Ionicons } from "@expo/vector-icons";
import { ResizeMode } from "expo-av";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageSourcePropType,
  KeyboardAvoidingView,
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
import VideoPlayer from "react-native-video-player";
import DragToClose from "../navigations/DragToClose";
import { FadingBlurBackground } from "../ui/FadingBlurBackground";
import ClipModal from "./ClipModal";

const { width, height } = Dimensions.get("window");

interface MediaPlayerModalProps {
  isVisible: boolean;
  onClose: () => void;
  videoUrl?: ImageSourcePropType;
  audioUrl?: ImageSourcePropType;
  title: string;
  duration: number;
  author: string;
  thumbnail?: ImageSourcePropType;
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

  const playbackSpeeds = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
  const TICK_COUNT = 12; // 0.25 to 2.0 with 0.25 increments
  const MIN_SPEED = 0.25;
  const MAX_SPEED = 2.0;
  const playerRef = useRef<any>(null);

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
    const remaining = duration - currentTime;
    return formatTime(remaining);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRewind = () => {
    setCurrentTime(Math.max(0, currentTime - 15));
  };

  const handleFastForward = () => {
    setCurrentTime(Math.min(duration, currentTime + 15));
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
    setShowSpeedControl(true);
    Animated.spring(speedSlideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const hideSpeedModal = () => {
    Animated.timing(speedSlideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowSpeedControl(false);
    });
  };

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
    <View
      className="relative overflow-hidden rounded-2xl bg-primary mt-5 w-full max-w-[85%] mx-auto"
      style={{ aspectRatio: 1.3 }}
    >
      <VideoPlayer
        ref={playerRef}
        endWithThumbnail
        thumbnail={images.media}
        fullScreenOnLongPress
        resizeMode={ResizeMode.COVER}
        source={{
          uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        }}
        showDuration={true}
        style={{
          width: "100%",
          height: "100%",
          alignSelf: "center",
        }}
        disableControlsAutoHide={false}
        // resizeMode="cover"
        paused={!isPlaying}
        onLoad={() => console.log("Video loaded")}
        onError={(error) => console.log("Video error:", error)}
      />
    </View>
  );

  const renderAudioContent = () => (
    <View
      className="relative overflow-hidden rounded-2xl bg-primary mt-5 w-full max-w-[85%] mx-auto"
      style={{ aspectRatio: 1.3 }}
    >
      <Image
        source={images.media}
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
    <View className="mt-3 w-full max-w-[85%] mx-auto">
      <View className=" mb-4">
        <Text
          className="text-white text-[20px] font-semibold mb-1"
          numberOfLines={2}
        >
          {title}
        </Text>
        <View className="flex-row items-center">
          <Image source={icons.user} className="h-7 w-7 mr-1" />
          <Text className="text-white/80 font-semibold text-[15px]">
            By {author}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="px-4 my-4">
        <View className="relative">
          <View className="h-1 bg-white/30 rounded-full">
            <View
              className="h-full bg-white rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </View>
          <View
            className="absolute w-4 h-4 bg-white rounded-full -top-1.5 shadow-lg"
            style={{
              left: `${(currentTime / duration) * 100}%`,
              marginLeft: -8,
            }}
          />
        </View>
      </View>

      {/* Time and Speed */}
      <View className="flex-row items-center justify-between px-4 mb-6">
        <View className="bg-[#FFFFFF12]/[7%] rounded-full p-2">
          <Image source={icons.downlaod} className="h-7 w-7" />
        </View>
        <View className="flex-row items-center bg-[#D9D9D933]/[20%] py-3 px-4 rounded-full">
          <Text className="text-white text-[14px] ">
            Time remaining {getRemainingTime()}
          </Text>
        </View>
        <TouchableOpacity
          onPress={showSpeedModal}
          className="bg-[#FFFFFF12]/[7%] rounded-full h-10 w-10 items-center justify-center"
        >
          <Text className="text-white text-[18px] font-medium text-center">
            {playbackSpeed === 1 ? "1x" : `${playbackSpeed}x`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Controls */}
      <View className="flex-row items-center justify-center mb-6">
        <TouchableOpacity onPress={handleRewind} className="p-3">
          <Image source={icons.playback_left} className="h-7 w-7" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePlayPause}
          className="w-20 h-20 rounded-full bg-white items-center justify-center mx-8"
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={30}
            color="black"
            style={!isPlaying && { marginLeft: 2 }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleFastForward} className="p-3">
          <Image source={icons.playback_right} className="h-7 w-7" />
        </TouchableOpacity>
      </View>

      {/* Bottom Controls */}
      <View className="flex-row items-center justify-between px-4 pb-8 w-full gap-x-2">
        <TouchableOpacity
          onPress={showCommentsModal}
          className="flex-1 flex-row items-center bg-[#36363696]/[59%] rounded-full  px-4 py-5"
        >
          <View className="w-5 h-5 items-center justify-center mr-2">
            <Image source={icons.record} className="h-full w-full" />
          </View>
          <Text className="text-white font-sfpro-regular tracking-tighter text-sm">
            Record a comment
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowClipModal(true)}
          className="flex-1 flex-row items-center justify-center bg-white rounded-full px-4 py-5"
          style={{ marginLeft: 8 }}
        >
          <Text className="text-[#4C2A11] font-bold  text-[16px] mr-1">
            Clip
          </Text>
          <Feather name="scissors" size={20} color="#4C2A11" />
        </TouchableOpacity>
      </View>

      {/* Safe Area Bottom */}
      <SafeAreaView />
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

  const renderRuler = () => {
    const onLayout = (event: any) => {
      setRulerWidth(event.nativeEvent.layout.width);
    };

    const currentSpeedPosition =
      rulerWidth * ((playbackSpeed - MIN_SPEED) / (MAX_SPEED - MIN_SPEED));

    const onGestureEvent = (event: any) => {
      if (rulerWidth === 0) return;

      const { translationX, x } = event.nativeEvent;
      const relativeX = Math.max(0, Math.min(rulerWidth, x));
      const progress = relativeX / rulerWidth;
      const newSpeed = MIN_SPEED + progress * (MAX_SPEED - MIN_SPEED);

      // Round to nearest 0.25
      const roundedSpeed = Math.round(newSpeed * 4) / 4;
      const clampedSpeed = Math.max(
        MIN_SPEED,
        Math.min(MAX_SPEED, roundedSpeed)
      );

      if (clampedSpeed !== playbackSpeed) {
        setPlaybackSpeed(clampedSpeed);
        // Haptic feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    };

    const onHandlerStateChange = (event: any) => {
      if (event.nativeEvent.state === State.BEGAN) {
        setIsDragging(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else if (
        event.nativeEvent.state === State.END ||
        event.nativeEvent.state === State.CANCELLED
      ) {
        setIsDragging(false);
      }
    };

    let ticks = [];
    let labels = [];

    for (let i = 0; i <= TICK_COUNT; i++) {
      const value = MIN_SPEED + (i * (MAX_SPEED - MIN_SPEED)) / TICK_COUNT;
      const left = rulerWidth * (i / TICK_COUNT);
      const isMainTick = i % 4 === 0;

      ticks.push(
        <View
          key={i}
          style={{
            position: "absolute",
            left: left - 1,
            height: isMainTick ? 40 : 22, // Increased heights
            width: 2,
            backgroundColor: isMainTick ? "#fff" : "#666",
            bottom: 32, // Adjust bottom for more spacing
            borderRadius: 1,
          }}
        />
      );

      if (isMainTick) {
        labels.push(
          <Text
            key={`label-${i}`}
            style={{
              position: "absolute",
              left: left - 20,
              bottom: 0,
              width: 40,
              textAlign: "center",
              color: "#bbb",
              fontWeight: "500",
              fontSize: 15, // Slightly larger for visibility
            }}
          >
            {value.toFixed(2)}
          </Text>
        );
      }
    }

    return (
      <View
        style={{
          height: 90, // Increased height for ruler area
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ minWidth: "100%" }}
          style={{ flexGrow: 0 }}
        >
          <View
            style={{
              height: 90,
              width: "90%",
              alignItems: "center",
              justifyContent: "center",
              margin: "auto",
            }}
          >
            <PanGestureHandler
              onGestureEvent={onGestureEvent}
              onHandlerStateChange={onHandlerStateChange}
            >
              <View
                style={{
                  height: 60, // Taller for the ticks
                  width: "95%",
                  alignSelf: "center",
                  position: "relative",
                }}
                onLayout={onLayout}
              >
                {rulerWidth > 0 && ticks}
                {rulerWidth > 0 && labels}

                {/* Interactive indicator */}
                {rulerWidth > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      left: currentSpeedPosition - 8,
                      bottom: 28,
                      width: 16,
                      height: 44, // Taller for bigger ruler
                      backgroundColor: isDragging ? "#007AFF" : "#fff",
                      borderRadius: 8,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 5,
                    }}
                  />
                )}

                {/* Touch area */}
                <View
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    backgroundColor: "transparent",
                  }}
                />
              </View>
            </PanGestureHandler>
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderSpeedModal = () => {
    if (!showSpeedControl) return null;

    return (
      <Animated.View
        className="absolute inset-0 z-50"
        style={{ transform: [{ translateY: speedSlideAnim }] }}
      >
        {/* Overlay */}
        <TouchableOpacity
          activeOpacity={1}
          style={StyleSheet.absoluteFill}
          onPress={hideSpeedModal}
        >
          <FadingBlurBackground opacity={blurOpacity} />
        </TouchableOpacity>

        {/* Modal */}
        <View className="flex-1 justify-end mx-2 ">
          <View
            className="bg-[#1D1D1C] border border-white/10 rounded-[30px] overflow-hidden"
            style={{ paddingBottom: insets.bottom, minHeight: "40%" }}
          >
            <DragToClose translateY={sheetY} onClose={onClose} />
            {/* Header */}
            <View style={{ padding: 16 }}>
              <Text
                className="text-white text-center font-bold"
                style={{ fontSize: 22, marginBottom: 8 }}
              >
                Playback speed
              </Text>

              {/* Current speed */}
              <Text
                className="text-white text-center font-extrabold"
                style={{ fontSize: 34, marginBottom: 6, letterSpacing: 1 }}
              >
                {playbackSpeed.toFixed(2)}X
              </Text>
            </View>

            {/* Ruler */}
            <View className="w-full items-center mb-7 " style={{ height: 80 }}>
              {renderRuler()}
            </View>

            {/* Speed options - Scrollable */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                gap: 16,
                minWidth: "100%",
                justifyContent:
                  playbackSpeeds.length <= 4 ? "center" : "flex-start",
              }}
              style={{ marginBottom: 20 }}
            >
              {playbackSpeeds.map((speed) => (
                <TouchableOpacity
                  key={speed}
                  onPress={() => {
                    setPlaybackSpeed(speed);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }}
                  style={{
                    backgroundColor:
                      playbackSpeed === speed ? "#fff2" : "#FFFFFF0F",
                    borderColor: playbackSpeed === speed ? "#fff" : "#46403a",
                    borderWidth: playbackSpeed === speed ? 2 : 1,
                    width: 50,
                    height: 50,
                    borderRadius: 28,
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 999,
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: playbackSpeed === speed ? "bold" : "500",
                      fontSize: 19,
                      opacity: playbackSpeed === speed ? 1 : 0.7,
                    }}
                  >
                    {speed}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Animated.View>
    );
  };

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        {
          transform: [{ translateY: slideAnim }],
          zIndex: 99999, // Very high z-index to ensure it's above everything
          elevation: 99999, // For Android
        },
      ]}
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

      <View className="relative overflow-hidden" style={{ flex: 1 }}>
        {/* Header Overlay */}
        {renderHeader()}
        {activeTab === "Video" ? renderVideoContent() : renderAudioContent()}

        {renderControls()}

        {/* Modals */}
        {renderCommentsModal()}
        {renderSpeedModal()}
      </View>

      <ClipModal
        visible={showClipModal}
        onClose={() => setShowClipModal(false)}
      />
    </Animated.View>
  );
};

export default MediaPlayerModal;
