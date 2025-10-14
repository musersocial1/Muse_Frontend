import { images } from "@/constants/images";
import { detectMediaType } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { BlurView } from "expo-blur";
import * as ImageManipulator from "expo-image-manipulator";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import CropOverlay from "./CropOverlay";
import DraggableText from "./DraggableText";
import TextOverlay from "./TextOverlay";

const TEXT_STYLES = [
  { id: "default", label: "Text", style: "" },
  { id: "bold", label: "Text", style: "font-bold" },
  { id: "italic", label: "Text", style: "italic" },
  { id: "serif", label: "Text", style: "font-serif" },
  { id: "mono", label: "Text", style: "font-mono" },
];

interface EditScreenProps {
  mediaUri: any;
  onBack: () => void;
  onPost: (caption: string) => void;
  videoDuration?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TIMELINE_WIDTH = SCREEN_WIDTH * 0.95 - 20;
const THUMB_WIDTH = 42;

const EditScreen: React.FC<EditScreenProps> = ({
  mediaUri: initialUri,
  onBack,
  onPost,
  videoDuration = 30,
}) => {
  const [caption, setCaption] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [mediaUri, setMediaUri] = useState(initialUri);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isVideo, setIsVideo] = useState(false);
  const [showTextOverlay, setShowTextOverlay] = useState(false);
  const [textOverlay, setTextOverlay] = useState<any>(null);
  const [showCropOverlay, setShowCropOverlay] = useState(false);

  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(videoDuration);
  const leftTrimPosition = useRef(new Animated.Value(0)).current;
  const rightTrimPosition = useRef(
    new Animated.Value(TIMELINE_WIDTH - 12)
  ).current;
  const progressPosition = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView | null>(null);
  const videoRef = useRef<Video | null>(null);

  const onPlaybackStatusUpdate = (status: any) => {
    if (!status || !status.isLoaded) return;

    const progress =
      ((status.positionMillis / 1000 - trimStart) / (trimEnd - trimStart)) *
      TIMELINE_WIDTH;
    progressPosition.setValue(Math.max(0, Math.min(progress, TIMELINE_WIDTH)));

    if (status.positionMillis >= trimEnd * 1000) {
      videoRef.current?.setPositionAsync(Math.round(trimStart * 1000));
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const type = await detectMediaType(mediaUri);
        if (mounted) setIsVideo(type === "video");
      } catch {
        if (mounted) setIsVideo(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [mediaUri]);

  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e: any) => {
        setKeyboardHeight(e.endCoordinates?.height || 0);
        setKeyboardVisible(true);
      }
    );
    const hide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
        setKeyboardVisible(false);
      }
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const getValue = (v: Animated.Value) => {
    const anyV = v as any;
    if (typeof anyV.__getValue === "function") return anyV.__getValue();
    let val = 0;
    const id = anyV.addListener?.(
      ({ value }: { value: number }) => (val = value)
    );
    if (id) anyV.removeListener?.(id);
    return val;
  };

  const videoThumbnails = (uri: any) => Array(12).fill(uri);
  const pixelToTime = (pixels: number) =>
    (pixels / TIMELINE_WIDTH) * videoDuration;
  const timeToPixel = (time: number) => (time / videoDuration) * TIMELINE_WIDTH;

  // Handle cropping — skip for videos
  const handleCrop = async (data: any) => {
    if (isVideo) {
      console.log(
        "⚠️ Skipping crop — videos cannot be cropped by ImageManipulator."
      );
      setShowCropOverlay(false);
      return;
    }

    try {
      const cropConfig = {
        originX: data.x,
        originY: data.y,
        width: data.width,
        height: data.height,
      };

      let imageUri = mediaUri;
      if (typeof mediaUri !== "string") {
        const asset = Image.resolveAssetSource(mediaUri);
        imageUri = asset?.uri || imageUri;
      }

      if (!imageUri || typeof imageUri !== "string") {
        console.error("Invalid image URI:", imageUri);
        return;
      }

      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ crop: cropConfig }],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );

      setMediaUri(result.uri);
      console.log("Cropped", result);
    } catch (err) {
      console.error(" Crop failed:", err);
    } finally {
      setShowCropOverlay(false);
    }
  };

  // Pan responders (trim)
  const leftPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        leftTrimPosition.setOffset(getValue(leftTrimPosition));
        leftTrimPosition.setValue(0);
      },
      onPanResponderMove: (_, gs) => {
        const offsetLeft = getValue(leftTrimPosition);
        const offsetRight = getValue(rightTrimPosition);
        const candidateAbs = offsetLeft + gs.dx;
        const clamped = Math.max(0, Math.min(candidateAbs, offsetRight - 30));
        leftTrimPosition.setValue(clamped - offsetLeft);
      },
      onPanResponderRelease: () => {
        leftTrimPosition.flattenOffset();
        const absolute = getValue(leftTrimPosition);
        const newStart = pixelToTime(absolute);
        setTrimStart(Math.max(0, newStart));
      },
    })
  ).current;

  const rightPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        rightTrimPosition.setOffset(getValue(rightTrimPosition));
        rightTrimPosition.setValue(0);
      },
      onPanResponderMove: (_, gs) => {
        const offsetRight = getValue(rightTrimPosition);
        const offsetLeft = getValue(leftTrimPosition);
        const candidateAbs = offsetRight + gs.dx;
        const clamped = Math.max(
          offsetLeft + 30,
          Math.min(candidateAbs, TIMELINE_WIDTH - 12)
        );
        rightTrimPosition.setValue(clamped - offsetRight);
      },
      onPanResponderRelease: () => {
        rightTrimPosition.flattenOffset();
        const absolute = getValue(rightTrimPosition);
        const newEnd = pixelToTime(absolute + 12);
        setTrimEnd(Math.min(videoDuration, newEnd));
      },
    })
  ).current;

  const getTrimDuration = () => (trimEnd - trimStart).toFixed(1);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-primary"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          {/* Header */}
          <View className="absolute top-2 left-0 right-0 flex-row justify-between items-center px-4 pt-10 z-20">
            <TouchableOpacity
              className="w-12 h-12 rounded-full bg-[#F3F3F326]/[15%] items-center justify-center"
              onPress={onBack}
            >
              <Ionicons name="chevron-back-sharp" size={22} color="white" />
            </TouchableOpacity>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="w-12 h-12 rounded-full bg-[#F3F3F326]/[15%] items-center justify-center"
                onPress={() => setShowTextOverlay(true)}
              >
                <Ionicons name="text" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                className="w-12 h-12 rounded-full bg-[#F3F3F326]/[15%] items-center justify-center"
                onPress={() => setShowCropOverlay(true)}
              >
                <Ionicons name="crop" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Video timeline */}
          {isVideo && (
            <View
              className="absolute left-0 right-0 flex-row justify-center items-center z-10"
              style={{ top: 100 }}
            >
              <View
                className="bg-white flex-row items-center py-1"
                style={{
                  width: "95%",
                  height: 56,
                  borderRadius: 15,
                  overflow: "hidden",
                }}
              >
                {/* Left handle */}
                <Animated.View
                  {...leftPanResponder.panHandlers}
                  style={{
                    position: "absolute",
                    left: leftTrimPosition,
                    top: 0,
                    bottom: 0,
                    width: 12,
                    backgroundColor: "white",
                    borderTopLeftRadius: 8,
                    borderBottomLeftRadius: 8,
                    zIndex: 10,
                  }}
                />

                {/* Timeline thumbnails */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  scrollEnabled={false}
                >
                  <View className="flex-row items-center">
                    {videoThumbnails(images.img7).map((thumb, i) => (
                      <Image
                        key={i}
                        source={thumb}
                        className="w-10 h-14 mx-[1px]"
                      />
                    ))}
                  </View>
                </ScrollView>

                {/* Right handle */}
                <Animated.View
                  {...rightPanResponder.panHandlers}
                  style={{
                    position: "absolute",
                    left: rightTrimPosition,
                    top: 0,
                    bottom: 0,
                    width: 12,
                    backgroundColor: "white",
                    borderTopRightRadius: 8,
                    borderBottomRightRadius: 8,
                    zIndex: 10,
                  }}
                />

                {/* Moving progress indicator */}
                <Animated.View
                  style={{
                    position: "absolute",
                    left: progressPosition,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    backgroundColor: "white",
                    zIndex: 15,
                  }}
                />
              </View>
            </View>
          )}

          {/* Media preview */}
          <View className="flex-1 justify-center items-center">
            {isVideo ? (
              <>
                <Video
                  ref={videoRef}
                  source={{ uri: mediaUri }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode={ResizeMode.COVER}
                  isLooping={true}
                  shouldPlay={isPlaying}
                  onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                />
                <TouchableOpacity
                  className="absolute inset-0 items-center justify-center"
                  onPress={() => {
                    if (!isPlaying)
                      videoRef.current?.setPositionAsync(
                        Math.round(trimStart * 1000)
                      );
                    setIsPlaying(!isPlaying);
                  }}
                >
                  <View className="w-16 h-16 rounded-full bg-[#FFFFFF2E]/[18%] items-center justify-center">
                    <BlurView
                      intensity={20}
                      tint="dark"
                      experimentalBlurMethod="dimezisBlurView"
                      style={[StyleSheet.absoluteFill]}
                    />
                    <Ionicons
                      name={isPlaying ? "pause" : "play"}
                      size={32}
                      color="white"
                    />
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <Image
                source={
                  typeof mediaUri === "string" ? { uri: mediaUri } : mediaUri
                }
                className="w-full h-full rounded-2xl"
                resizeMode="cover"
              />
            )}

            {textOverlay && (
              <DraggableText
                text={textOverlay.text}
                color={textOverlay.color}
                styleId={textOverlay.style}
                onDelete={() => setTextOverlay(null)}
                stylesList={TEXT_STYLES}
              />
            )}
          </View>

          {/* Caption bar */}
          <Animated.View
            style={{
              position: "absolute",
              bottom: keyboardVisible ? keyboardHeight + 10 : 20,
              left: 0,
              right: 0,
              alignItems: "center",
            }}
          >
            <View className="w-[90%] max-w-[360px] overflow-hidden rounded-full">
              <BlurView
                intensity={40}
                tint="dark"
                className="flex-row items-center px-4 py-2 rounded-full"
              >
                <Ionicons
                  name="camera-outline"
                  size={22}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  placeholder="Add a caption"
                  placeholderTextColor="#aaa"
                  className="flex-1 text-white text-base px-2 py-3"
                  value={caption}
                  onChangeText={setCaption}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  className="bg-secondary rounded-full px-6 py-3 ml-2"
                  onPress={() => {
                    Keyboard.dismiss();
                    onPost(caption);
                  }}
                >
                  <Text className="text-white text-[16px] font-sfpro-bold">
                    Post
                  </Text>
                </TouchableOpacity>
              </BlurView>
            </View>
          </Animated.View>

          {/* Modals */}
          <TextOverlay
            visible={showTextOverlay}
            onClose={() => setShowTextOverlay(false)}
            onTextAdd={(txt, color, style) => {
              setTextOverlay({ text: txt, color, style });
              setShowTextOverlay(false);
            }}
          />

          {showCropOverlay && (
            <CropOverlay
              visible={showCropOverlay}
              mediaUri={mediaUri}
              isVideo={isVideo}
              onClose={() => setShowCropOverlay(false)}
              onCrop={handleCrop}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default EditScreen;
