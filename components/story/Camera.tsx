import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import {
  CameraType,
  CameraView,
  FlashMode,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CameraScreenProps {
  onCapture: (content: string) => void;
  onClose: () => void;
  userAvatar?: string;
}

const ZOOM_LEVELS = [1, 2, 3, 4];
const MAX_RECORDING_DURATION = 30000; // 30 seconds

export default function CameraScreen({
  onCapture,
  onClose,
  userAvatar,
}: CameraScreenProps) {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [permissionsRequested, setPermissionsRequested] = useState(false);

  const cameraRef = useRef<CameraView>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [flashMode, setFlashMode] = useState<FlashMode>("off");
  const [cameraFacing, setCameraFacing] = useState<CameraType>("back");

  const recordingProgress = useRef(new Animated.Value(0)).current;
  const recordingTimer = useRef<any>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  // Request permissions once
  useEffect(() => {
    const requestPerms = async () => {
      if (!cameraPermission?.granted) await requestCameraPermission();
      if (!micPermission?.granted) await requestMicPermission();
      setPermissionsRequested(true);
    };
    if (!permissionsRequested) requestPerms();
  }, [permissionsRequested]);

  // Animate red ring progress
  const startRecordingAnimation = () => {
    recordingProgress.setValue(0);
    Animated.timing(recordingProgress, {
      toValue: 1,
      duration: MAX_RECORDING_DURATION,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    let duration = 0;
    recordingTimer.current = setInterval(() => {
      duration += 100;
      setRecordingDuration(duration);
      if (duration >= MAX_RECORDING_DURATION) {
        handleStopRecording();
      }
    }, 100);
  };

  const stopRecordingAnimation = () => {
    recordingProgress.stopAnimation();
    recordingProgress.setValue(0);
    if (recordingTimer.current) {
      clearInterval(recordingTimer.current);
    }
    setRecordingDuration(0);
  };

  const handleStartRecording = async () => {
    if (!cameraRef.current) return;

    try {
      setIsRecording(true);
      startRecordingAnimation();

      const video = await cameraRef.current.recordAsync({
        maxDuration: 30,
      });

      if (video) onCapture(video.uri);
    } catch (error) {
      console.error("Recording error:", error);
      Alert.alert("Error", "Failed to start recording");
      setIsRecording(false);
      stopRecordingAnimation();
    }
  };

  const handleStopRecording = async () => {
    if (!cameraRef.current) return;
    try {
      await cameraRef.current.stopRecording();
      setIsRecording(false);
      stopRecordingAnimation();
    } catch (error) {
      console.error("Stop recording error:", error);
    }
  };

  const handleRetake = async () => {
    if (isRecording) {
      await handleStopRecording();
    }
    handleStartRecording();
  };

  const handleTakePicture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
      });
      if (photo) onCapture(photo.uri);
    } catch (error) {
      console.error("Take picture error:", error);
      Alert.alert("Error", "Failed to take picture");
    }
  };

  const handleMediaPicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
      videoMaxDuration: 30,
    });

    if (!result.canceled && result.assets[0]) {
      onCapture(result.assets[0].uri);
    }
  };

  const toggleFlashMode = () => {
    const modes: FlashMode[] = ["off", "on", "auto"];
    const next = (modes.indexOf(flashMode) + 1) % modes.length;
    setFlashMode(modes[next]);
  };

  const toggleCamera = () => {
    setCameraFacing(cameraFacing === "back" ? "front" : "back");
  };

  const handleZoomPress = () => {
    setZoomLevel((prev) => (prev + 1) % ZOOM_LEVELS.length);
  };

  const hasPermission = cameraPermission?.granted && micPermission?.granted;

  if (!cameraPermission || !micPermission) {
    return (
      <View className="flex-1 bg-primary items-center justify-center">
        <Text className="text-white">Loading permissions...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View className="flex-1 bg-primary items-center justify-center px-6">
        <Text className="text-white mb-3 text-center">
          Camera & microphone access is required to use this feature
        </Text>
        <TouchableOpacity
          onPress={async () => {
            await requestCameraPermission();
            await requestMicPermission();
          }}
          className="bg-white px-5 py-3 rounded-full"
        >
          <Text className="font-semibold">Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const redBorderWidth = recordingProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={cameraFacing}
        mode="video"
        zoom={ZOOM_LEVELS[zoomLevel] / 10}
        flash={flashMode}
        videoQuality="1080p"
      >
        {/* Top Controls */}
        <View className="absolute top-12 left-4 right-4 flex-row justify-between z-10">
          <TouchableOpacity
            className="w-12 h-12 rounded-full bg-[#F3F3F326]/[15%] items-center justify-center"
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          <View className="flex-row gap-3">
            <TouchableOpacity
              className="w-12 h-12 rounded-full bg-[#F3F3F326]/[15%] items-center justify-center"
              onPress={toggleFlashMode}
            >
              <Ionicons
                name={
                  flashMode === "on"
                    ? "flash"
                    : flashMode === "auto"
                    ? "flash-outline"
                    : "flash-off"
                }
                size={20}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="w-12 h-12  rounded-full bg-[#F3F3F326]/[15%] items-center justify-center"
              onPress={toggleCamera}
            >
              <Ionicons name="camera-reverse" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Recording Timer */}
        {isRecording && (
          <View className="absolute top-24 self-center bg-red-500 px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-bold">
              {Math.floor(recordingDuration / 1000)}s / 30s
            </Text>
          </View>
        )}

        {/* Bottom Controls */}
        <BlurView
          intensity={50}
          className="absolute bottom-8 left-4 right-4 rounded-full overflow-hidden"
          tint="dark"
        >
          <View className="flex-row items-center justify-between px-6 py-2">
            <TouchableOpacity onPress={handleMediaPicker} activeOpacity={0.7}>
              <Image
                source={images.pan}
                className="w-12 h-12 rounded-full"
                resizeMode="cover"
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="relative items-center justify-center ml-10"
              onPress={() =>
                isRecording ? handleStopRecording() : handleStartRecording()
              }
              activeOpacity={0.8}
            >
              <View className="w-16 h-16 rounded-full border-4 border-white items-center justify-center relative overflow-hidden">
                <Animated.View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: redBorderWidth,
                    backgroundColor: "rgba(255,0,0,0.4)",
                  }}
                />
                <View
                  className={`${
                    isRecording ? "w-7 h-7 rounded" : "w-12 h-12 rounded-full"
                  } ${isRecording ? "bg-red-500" : "bg-white"}`}
                />
              </View>
            </TouchableOpacity>

            <View className="flex-row gap-3">
              <TouchableOpacity onPress={handleZoomPress} activeOpacity={0.7}>
                <View className="p-3 rounded-full bg-[#00000021]/[13%]">
                  <Text className="text-[#008CFF] font-bold text-[18px]">
                    {ZOOM_LEVELS[zoomLevel]}x
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleRetake} activeOpacity={0.7}>
                <View className="p-3 rounded-full bg-[#00000021]/[13%]">
                  <Image source={images.retake} className="h-6 w-6" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </CameraView>
    </View>
  );
}
