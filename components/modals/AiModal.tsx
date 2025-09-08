import { icons } from "@/constants/icons";
import { aiAPI } from "@/lib/api/ai";
import { showError, showSuccess } from "@/lib/toast";
import { Feather } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as Clipboard from "expo-clipboard";
import Constants from "expo-constants";
import * as FileSystem from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";

import { images } from "@/constants/images";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DragToClose from "../navigations/DragToClose";
import { FadingBlurBackground } from "../ui/FadingBlurBackground";

const { height: screenHeight } = Dimensions.get("window");

interface HistoryItem {
  id: string;
  title: string;
  preview: string;
}

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface Props {
  showAIModal: boolean;
  setShowAIModal: (value: boolean) => void;
}

const AIModal: React.FC<Props> = ({ showAIModal, setShowAIModal }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [inputHeight, setInputHeight] = useState<number>(0);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);

  const { extra } = Constants.expoConfig || {};

  // Animation for the pulsing AI avatar
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Animation for recording state
  const recordingAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(recordingAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(recordingAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      recordingAnim.setValue(1);
    }
  }, [isRecording]);

  const historyItems: HistoryItem[] = [
    { id: "1", title: "Make a funny post...", preview: "Spending habits" },
    { id: "2", title: "Kanye's history", preview: "Background info" },
    { id: "3", title: "New pope facts", preview: "Papal announcements" },
    { id: "4", title: "Time since release", preview: "Swift album timeline" },
  ];

  const getModalHeight = () => {
    return screenHeight * 0.7;
  };

  // Audio recording setup
  const setupAudio = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        showError(
          "Permission Required",
          "Microphone permission is required for voice input"
        );
        return false;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      return true;
    } catch (error) {
      console.error("Audio setup error:", error);
      showError("Audio Error", "Failed to setup audio recording");
      return false;
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      const hasPermission = await setupAudio();
      if (!hasPermission) return;

      const recordingInstance = new Audio.Recording();
      await recordingInstance.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      await recordingInstance.startAsync();
      setRecording(recordingInstance);
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
      showError("Recording Error", "Failed to start recording");
    }
  };

  // Stop recording and transcribe
  const stopRecording = async () => {
    try {
      if (!recording) return;

      setIsRecording(false);
      await recording.stopAndUnloadAsync();

      const uri = recording.getURI();
      if (!uri) {
        showError("Recording Error", "No audio recorded");
        return;
      }

      setIsTranscribing(true);

      // Transcribe using OpenAI Whisper API
      const transcription = await transcribeAudio(uri);
      if (transcription) {
        setAiInput(transcription);
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
      showError("Recording Error", "Failed to process recording");
    } finally {
      setRecording(null);
      setIsTranscribing(false);
    }
  };

  // TranscriPTION  using OpenAI Whisper API
  const transcribeAudio = async (audioUri: string): Promise<string | null> => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(audioUri);
      if (!fileInfo.exists) {
        throw new Error("Audio file does not exist");
      }

      const formData = new FormData();

      const audioFile = {
        uri: audioUri,
        type: "audio/m4a",
        name: "recording.m4a",
      } as any;

      formData.append("file", audioFile);
      formData.append("model", "whisper-1");
      formData.append("response_format", "json");

      const OPENAI_API_KEY = extra?.EXPO_PUBLIC_OPENAI_KEY;

      console.log("Sending request to OpenAI...");

      const response = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(
          `Transcription failed: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();
      console.log("Transcription result:", result);

      return result.text || null;
    } catch (error) {
      console.error("Transcription error:", error);
      showError("Transcription Error", `Failed to transcribe audio: ${error}`);
      return null;
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const sendTextMessage = async () => {
    if (!aiInput.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: aiInput.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setAiInput("");
    setIsLoading(true);

    try {
      const response = await aiAPI.sendChatMessage({
        conversationId,
        message: userMessage.content,
        type: "text",
      });

      if (response.success) {
        setConversationId(response.conversationId);

        if (response.aiMessage) {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: "ai",
            content:
              response.aiMessage.content ||
              response.aiMessage.message ||
              "Sorry, I couldn't generate a response.",
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, aiMessage]);
        }

        if (response.messages && Array.isArray(response.messages)) {
          const formattedMessages: Message[] = response.messages.map(
            (msg: any, index: number) => ({
              id: msg.id || msg._id || `${Date.now()}-${index}`,
              type: msg.sender === "ai" ? "ai" : "user",
              content: msg.content || msg.message || "",
              timestamp: new Date(msg.createdAt || msg.timestamp || Date.now()),
            })
          );
          setMessages(formattedMessages);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      showError("Error", "Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const regenerateResponse = async () => {
    if (messages.length === 0 || isLoading) return;

    const lastUserMessage = [...messages]
      .reverse()
      .find((msg) => msg.type === "user");
    if (!lastUserMessage) return;

    setMessages((prev) => {
      const lastMessage = prev[prev.length - 1];
      if (lastMessage?.type === "ai") {
        return prev.slice(0, -1);
      }
      return prev;
    });

    setIsLoading(true);

    try {
      const response = await aiAPI.sendChatMessage({
        conversationId,
        message: lastUserMessage.content,
        type: "text",
      });

      if (response.success && response.aiMessage) {
        const aiMessage: Message = {
          id: Date.now().toString(),
          type: "ai",
          content:
            response.aiMessage.content ||
            response.aiMessage.message ||
            "Sorry, I couldn't generate a response.",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Error regenerating response:", error);
      showError("Error", "Failed to regenerate response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = async (content: string) => {
    try {
      await Clipboard.setStringAsync(content);
      showSuccess("Copied", "Message copied to clipboard");
    } catch (error) {
      showError("Error", "Failed to copy message");
    }
  };

  useEffect(() => {
    if (!showAIModal) {
      setMessages([]);
      setConversationId(undefined);
      setAiInput("");
      setIsRecording(false);
      setIsTranscribing(false);
      if (recording) {
        recording.stopAndUnloadAsync();
        setRecording(null);
      }
    }
  }, [showAIModal]);

  const MAX_SINGLE_LINE_HEIGHT = 40;

  const isMultiLine = inputHeight > MAX_SINGLE_LINE_HEIGHT;
  const onInputContentSizeChange = (event: any) => {
    const height = event.nativeEvent.contentSize.height;
    setInputHeight(height);
  };

  const insets = useSafeAreaInsets();
  const HIDE_OFFSET = 700;
  const sheetY = useRef(new Animated.Value(HIDE_OFFSET)).current;

  useEffect(() => {
    if (showAIModal) {
      sheetY.setValue(HIDE_OFFSET);
      Animated.timing(sheetY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      sheetY.setValue(HIDE_OFFSET);
      // setTimeout(() => {
      //   setViewMode("profile");
      //   setSearchQuery("");
      // }, 300);
    }
  }, [showAIModal]);

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
    }).start(() => setShowAIModal(false));
  };

  return (
    <Modal
      visible={showAIModal}
      transparent
      animationType="none"
      onRequestClose={() => closeWithSlide()}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={StyleSheet.absoluteFill}
        onPress={closeWithSlide}
      >
        <FadingBlurBackground opacity={blurOpacity} />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 px-2 items-center justify-end "
      >
        <Animated.View
          style={{
            transform: [{ translateY: sheetY }],
            height: getModalHeight(),
            maxHeight: screenHeight * 0.6,
            // marginBottom: insets.bottom,
            width: "100%",
          }}
          className={`w-full ${
            Platform.OS == "android" ? "bg-neutral-500" : ""
          } relative max-w-lg border-2 border-white/10    mb-4 rounded-[40px] overflow-hidden`}
        >
          <BlurView
            style={StyleSheet.absoluteFill}
            intensity={90}
            tint="systemThickMaterialDark"
          />
          <View className="w-full aspect-[1/1]   absolute bottom-0 left-0 right-0 ">
            <Image
              source={images.aibackground}
              className="w-full h-full object-cover"
            />
          </View>

          <DragToClose translateY={sheetY} onClose={closeWithSlide} />

          <View className="flex-row   justify-between px-6  pb-4">
            {showHistory ? (
              <>
                <TouchableOpacity
                  onPress={() => setShowHistory(false)}
                  className="w-12 h-12 bg-[#FFFFFF2E]/[16%] rounded-full items-center justify-center"
                >
                  <Feather name="chevron-left" size={22} color="white" />
                </TouchableOpacity>

                <Text className="text-[#FFFFFF]/50 text-xl font-semibold">
                  History
                </Text>

                <View className="w-12 h-12" />
              </>
            ) : (
              <>
                <View className="w-12 h-12 " />

                <Text className="text-white  text-xl font-semibold">
                  Merlin AI
                </Text>

                <TouchableOpacity
                  onPress={() => setShowHistory(true)}
                  className="w-12 h-12 bg-white/10 rounded-full items-center justify-center"
                >
                  <Feather name="clock" size={22} color="white" />
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Content */}
          <View className="flex-1">
            {showHistory ? (
              <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                {historyItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    className="bg-[#FFFFFF30]/[19%] rounded-full p-4 mb-3 flex-row justify-between items-center"
                  >
                    <View className="flex-1 pr-3">
                      <Text className="text-[#FFFFFF] font-bold text-[13px] ">
                        {item.title}
                      </Text>
                    </View>
                    <Feather name="more-horizontal" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <ScrollView
                ref={scrollViewRef}
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                {messages.length === 0 ? (
                  <View className="flex-1 items-center justify-center">
                    <Text className="text-white/60 text-base text-center">
                      Ask me anything! I'm here to help.
                    </Text>
                  </View>
                ) : (
                  messages.map((message) => (
                    <View key={message.id} className="mb-6">
                      <View className="flex-row items-start">
                        <View className="w-8 h-8 rounded-full mr-3 items-center justify-center">
                          {message.type === "user" ? (
                            <View className="w-8 h-8 rounded-full items-center justify-center">
                              <Image
                                source={icons.user}
                                className="w-full h-full object-cover"
                              />
                            </View>
                          ) : (
                            <Animated.View
                              style={{ transform: [{ scale: pulseAnim }] }}
                              className="w-8 h-8 rounded-full items-center justify-center overflow-hidden"
                            >
                              <LinearGradient
                                colors={[
                                  "#05F4B4",
                                  "#FF14BB",
                                  "#1100FF",
                                  "#F09C53",
                                ]}
                                locations={[0, 0.33, 0.66, 1]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 16,
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <View className="w-3 h-3 bg-[#1100FF] rounded-full" />
                              </LinearGradient>
                            </Animated.View>
                          )}
                        </View>

                        <View
                          className={`flex-1 p-4 ${
                            message.type === "user"
                              ? "border-b border-white/10"
                              : ""
                          }`}
                        >
                          <Text className="text-white text-base leading-6">
                            {message.content}
                          </Text>
                        </View>
                      </View>

                      {message.type === "ai" && (
                        <View className="flex-row ml-11 mt-2 gap-3">
                          <TouchableOpacity
                            onPress={regenerateResponse}
                            disabled={isLoading}
                            className="bg-white/10 rounded-full p-3 border border-white/20"
                          >
                            <Feather
                              name="refresh-cw"
                              size={18}
                              color={isLoading ? "#666" : "white"}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => copyMessage(message.content)}
                            className="bg-white/10 rounded-full p-3 border border-white/20"
                          >
                            <Feather name="copy" size={18} color="white" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ))
                )}

                {isLoading && (
                  <View className="mb-6 flex-row items-start">
                    <Animated.View
                      style={{ transform: [{ scale: pulseAnim }] }}
                      className="w-8 h-8 rounded-full items-center text-center justify-center overflow-hidden"
                    >
                      <LinearGradient
                        colors={["#05F4B4", "#FF14BB", "#1100FF", "#F09C53"]}
                        locations={[0, 0.33, 0.66, 1]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <View className="w-3 h-3 bg-[#1100FF] rounded-full animate-pulse" />
                      </LinearGradient>
                    </Animated.View>
                    <Text className="text-[#FFFFFF]/50 mr-2 pt-2 pl-3 fnt-medium">
                      Coming right up..
                    </Text>
                  </View>
                )}

                {isTranscribing && (
                  <View className="mb-6 flex-row items-center justify-center">
                    <Feather name="mic" size={20} color="#9CA3AF" />
                    <Text className="text-[#FFFFFF]/50 ml-2 font-medium">
                      Transcribing...
                    </Text>
                  </View>
                )}
              </ScrollView>
            )}
          </View>

          {!showHistory && (
            <View className=" p-4 pt-4">
              <View
                className={`flex-row ${
                  isMultiLine ? "items-end" : "items-center"
                } bg-[#FFFFFF30]/[19%] overflow-hidden  border border-[#00000029]/[16%] px-5 ${
                  isMultiLine ? "rounded-lg py-3" : "rounded-full py-3"
                }`}
              >
                <BlurView
                  style={StyleSheet.absoluteFill}
                  intensity={70}
                  tint="dark"
                />
                <Feather
                  name="plus"
                  size={20}
                  color="white"
                  style={{
                    marginRight: 10,
                    marginBottom: isMultiLine ? 8 : 0,
                  }}
                />

                <TextInput
                  className="flex-1 text-white border2 placeholder:text-white text-[16px] ml-0"
                  placeholder="Type or tap mic to speak"
                  placeholderTextColor="#9CA3AF"
                  value={aiInput}
                  onChangeText={setAiInput}
                  multiline
                  maxLength={500}
                  onContentSizeChange={onInputContentSizeChange}
                  style={{
                    marginBottom: isMultiLine ? 6 : 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                  }}
                />

                {/* Mic Button */}
                <TouchableOpacity
                  onPress={toggleRecording}
                  disabled={isTranscribing}
                  className="mr-2"
                >
                  <Animated.View
                    style={{
                      transform: [{ scale: recordingAnim }],
                    }}
                    className={`p-2 rounded-full ${
                      isRecording
                        ? "bg-red-500"
                        : isTranscribing
                        ? "bg-gray-500"
                        : "bg-white/20"
                    }`}
                  >
                    <Feather
                      name="mic"
                      size={20}
                      color={isTranscribing ? "#666" : "white"}
                    />
                  </Animated.View>
                </TouchableOpacity>

                {/* Send Button */}
                <TouchableOpacity
                  onPress={sendTextMessage}
                  disabled={isLoading || !aiInput.trim()}
                  className={`rounded-full p-2 bg-secondary  items-center justify-center ${
                    aiInput.trim() && !isLoading
                      ? "bg-secondary "
                      : " bg-white/20"
                  }`}
                >
                  <Feather
                    name="arrow-up"
                    size={20}
                    color={aiInput.trim() && !isLoading ? "white" : "white"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AIModal;
