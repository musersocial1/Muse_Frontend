import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Feather } from "@expo/vector-icons";
import { Video } from "expo-av";
import { BlurView } from "expo-blur";
import {
  CameraType,
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type RecordCommentModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: { videoUri: string | null; comment: string }) => void;
};

const fmtTime = (secs: number) => {
  const mm = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const ss = Math.floor(secs % 60)
    .toString()
    .padStart(2, "0");
  return `${mm}:${ss}`;
};

type Flow = "camera" | "recording" | "preview" | "comment";

const RecordCommentModal: React.FC<RecordCommentModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const textInputRef = useRef<TextInput>(null);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();

  const [cameraType, setCameraType] = useState<CameraType>("front");
  const [flow, setFlow] = useState<Flow>("camera");
  const [secs, setSecs] = useState(0);
  const timerRef = useRef<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [permissionsRequested, setPermissionsRequested] = useState(false);

  const hasPermission =
    cameraPermission?.granted && microphonePermission?.granted;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  useEffect(() => {
    if (visible && !permissionsRequested) {
      const requestPermissions = async () => {
        if (!cameraPermission?.granted) {
          await requestCameraPermission();
        }
        if (!microphonePermission?.granted) {
          await requestMicrophonePermission();
        }
        setPermissionsRequested(true);
      };

      requestPermissions();
    }

    // Reset permission request flag when modal closes
    if (!visible) {
      setPermissionsRequested(false);
    }
  }, [visible]);

  // Reset on close
  useEffect(() => {
    if (!visible) {
      setFlow("camera");
      setRecordedUri(null);
      setComment("");
      setSecs(0);
      setIsInputFocused(false);
      setIsKeyboardVisible(false);
      setPermissionsRequested(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [visible]);

  // Timer
  const startTimer = () => {
    setSecs(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecs((s) => s + 1);
    }, 1000);
  };
  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  // Recording
  const startRecording = async () => {
    if (!cameraRef.current || isProcessing) return;
    try {
      setIsProcessing(true);
      setFlow("recording");
      startTimer();

      // Updated recordAsync call
      const res = await cameraRef.current.recordAsync({
        maxDuration: 60,
        // videoQuality: "720p"
      });

      setRecordedUri(res?.uri || null);
      stopTimer();
      setIsProcessing(false);
      setFlow("preview");
    } catch (error) {
      console.error("Recording error:", error);
      stopTimer();
      setIsProcessing(false);
      setFlow("camera");
    }
  };

  const stopRecording = async () => {
    if (!cameraRef.current) return;
    try {
      cameraRef.current.stopRecording();
    } catch (error) {
      console.error("Stop recording error:", error);
    }
  };

  // UI Controls
  const onCapturePress = () => {
    if (flow === "camera") startRecording();
    else if (flow === "recording") stopRecording();
  };

  const onRetry = () => {
    setRecordedUri(null);
    setComment("");
    setSecs(0);
    setFlow("camera");
    stopTimer();
  };

  const onAccept = () => setFlow("comment");

  const handlePost = () => {
    onSubmit({ videoUri: recordedUri, comment });
    onClose();
    setTimeout(() => {
      setRecordedUri(null);
      setComment("");
      setFlow("camera");
      setSecs(0);
      setIsInputFocused(false);
    }, 300);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const handleRequestPermissions = async () => {
    await requestCameraPermission();
    await requestMicrophonePermission();
    setPermissionsRequested(true);
  };

  // Permissions loading
  if (!cameraPermission || !microphonePermission) {
    return (
      <Modal visible={visible} animationType="slide" transparent>
        <View className="flex-1 bg-black items-center justify-center">
          <Text className="text-white">Loading permissions...</Text>
        </View>
      </Modal>
    );
  }

  // Permissions denied
  if (!hasPermission) {
    return (
      <Modal visible={visible} animationType="slide" transparent>
        <View className="flex-1 bg-black items-center justify-center">
          <Text className="text-white text-center mb-4">
            Camera & microphone permissions are required
          </Text>
          <TouchableOpacity
            onPress={handleRequestPermissions}
            className="bg-secondary rounded-full px-6 py-4 mb-4"
          >
            <Text className="text-white font-semibold">Grant Permissions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onClose}
            className="bg-white rounded-full px-5 py-2"
          >
            <Text className="text-black font-semibold">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <View className="flex-1 bg-primary ">
        {/* CAMERA/RECORDING */}
        {(flow === "camera" || flow === "recording") && (
          <View className="flex-1 ">
            <CameraView
              ref={cameraRef}
              style={{ flex: 1 }}
              facing={cameraType}
              mode="video"
              className="w-full h-full justify-end items-center"
            >
              {/* Top bar */}
              <View className="absolute top-10 left-0 right-0 flex-row items-center justify-between px-5 pt-5 z-10">
                {/* Close */}
                <TouchableOpacity
                  onPress={onClose}
                  className="w-14 h-14 rounded-full bg-[#70707082]/[51%] items-center justify-center"
                  activeOpacity={0.8}
                >
                  <Feather name="x" size={22} color="white" />
                </TouchableOpacity>
                <View className="flex-1 items-center">
                  <View className="px-7 py-4 rounded-full bg-[#0368FF]">
                    <Text className="text-[15px] font-medium text-white">
                      {fmtTime(secs)}
                    </Text>
                  </View>
                </View>
                <View className="w-10" />
              </View>

              <View className="absolute bottom-20 left-0 right-0 flex-row items-center justify-center">
                <TouchableOpacity
                  onPress={onCapturePress}
                  activeOpacity={0.8}
                  className="items-center justify-center"
                >
                  <View
                    className="items-center justify-center"
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 36,
                      backgroundColor: "#0000009C",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {flow === "recording" ? (
                      <View
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          backgroundColor: "#E02424",
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          width: 65,
                          height: 65,
                          borderRadius: 35,
                          borderWidth: 4,
                          borderColor: "#E5E5E5",
                          backgroundColor: "white",
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
                {/* Spacer */}
                <View className="w-10" />
              </View>
            </CameraView>
          </View>
        )}

        {/* PREVIEW */}
        {flow === "preview" && recordedUri && (
          <View className="flex-1 bg-primary justify-center items-center">
            <View className="absolute top-10 left-0 right-0 flex-row items-center justify-between px-5 pt-5 z-10">
              <TouchableOpacity
                onPress={onClose}
                className="w-14 h-14 rounded-full bg-[#70707082]/[51%] items-center justify-center"
                activeOpacity={0.8}
              >
                <Feather name="x" size={22} color="white" />
              </TouchableOpacity>
              <View className="flex-1 items-center">
                <View className="px-7 py-4 rounded-full bg-[#0368FF]">
                  <Text className="text-[15px] font-medium text-white">
                    {fmtTime(secs)}
                  </Text>
                </View>
              </View>
              <View className="w-10" />
            </View>
            <Video
              source={{ uri: recordedUri }}
              className="w-full h-full"
              style={{ flex: 1, height: 500, width: 500 }}
              useNativeControls={true}
              shouldPlay={false}
              isLooping
            />
            <View className="absolute bottom-20 left-0 right-0 flex-row items-center justify-around">
              <TouchableOpacity
                onPress={onRetry}
                className="w-16 h-16 rounded-full bg-white items-center justify-center"
                activeOpacity={0.85}
              >
                <Feather name="rotate-ccw" size={27} color="#373737" />
              </TouchableOpacity>
              <View className="w-10" />
              <TouchableOpacity
                onPress={onAccept}
                className="w-16 h-16 rounded-full bg-[#0368FF] items-center justify-center"
                activeOpacity={0.85}
              >
                <Feather name="check" size={27} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* COMMENT */}
        {flow === "comment" && (
          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <View className="flex-1 bg-primary">
              {/* Top bar */}
              <View className="flex-row items-center pt-20 px-5">
                <TouchableOpacity
                  className="w-14 h-14 rounded-full items-center justify-center bg-[#70707082]/[51%]"
                  onPress={() => setFlow("preview")}
                  activeOpacity={0.8}
                >
                  <Feather name="chevron-left" size={30} color="#fff" />
                </TouchableOpacity>
                <View className="flex-1 items-center -ml-10">
                  <Text className="text-white font-bold text-[18px]">
                    Leave comment
                  </Text>
                </View>
                <View className="w-10" />
              </View>

              {/* Video thumbnail - Hide when keyboard is visible */}
              {!isKeyboardVisible && (
                <View className="relative items-center mt-6">
                  <Image
                    source={images.comment}
                    style={{
                      width: 168,
                      height: 248,
                      borderRadius: 20,
                      backgroundColor: "#222",
                    }}
                    resizeMode="cover"
                  />
                  <View className="absolute inset-0 items-center justify-center">
                    <View className="overflow-hidden rounded-full p-3">
                      <BlurView
                        style={StyleSheet.absoluteFill}
                        intensity={50}
                      />
                      <Image
                        source={icons.play}
                        className="h-5 w-5 "
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                </View>
              )}

              {/* Comment Bubble */}
              <View
                className={`px-7 ${
                  isKeyboardVisible ? "mt-6" : "mt-10"
                } flex-1`}
              >
                <View className="overflow-hidden rounded-[20px] px-6 py-8 relative">
                  <BlurView
                    intensity={10}
                    tint="light"
                    style={StyleSheet.absoluteFill}
                    className="bg-[rgba(28, 28, 28, 0.7)]"
                  />
                  <View className="flex-row items-start">
                    <Image
                      source={icons.user}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <TextInput
                      ref={textInputRef}
                      value={comment}
                      onChangeText={setComment}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholder="Start typing..."
                      placeholderTextColor="white"
                      className="flex-1 text-white text-[16px] font-neutral-regular tracking-widest leading-6 min-h-[100px]"
                      multiline
                      maxLength={500}
                      textAlignVertical="top"
                      style={{ padding: 0 }}
                      returnKeyType="default"
                      blurOnSubmit={false}
                    />
                  </View>
                </View>
              </View>

              {/* Post Button - Only show when not typing */}
              {!isKeyboardVisible && !isInputFocused && (
                <View className="px-7 pb-9">
                  <TouchableOpacity
                    disabled={comment.trim().length === 0}
                    onPress={handlePost}
                    className={`h-16 rounded-full items-center justify-center ${
                      comment.trim().length > 0
                        ? "bg-[#0368FF]"
                        : "bg-[#232833]"
                    }`}
                    activeOpacity={comment.trim().length > 0 ? 0.9 : 1}
                  >
                    <Text className="text-white text-lg font-semibold">
                      Post
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        )}
      </View>
    </Modal>
  );
};

export default RecordCommentModal;
