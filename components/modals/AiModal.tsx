import { icons } from "@/constants/icons";
import { aiAPI } from "@/lib/api/ai";
import { showError, showSuccess } from "@/lib/toast";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";

import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [aiInput, setAiInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputHeight, setInputHeight] = useState<number>(0);

  const scrollViewRef = useRef<ScrollView>(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (isVoiceMode && !showHistory) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [isVoiceMode, showHistory]);

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

  const historyItems: HistoryItem[] = [
    { id: "1", title: "Make a funny post...", preview: "Spending habits" },
    { id: "2", title: "Kanye's history", preview: "Background info" },
    { id: "3", title: "New pope facts", preview: "Papal announcements" },
    { id: "4", title: "Time since release", preview: "Swift album timeline" },
  ];

  const getModalHeight = () => {
    if (isVoiceMode) {
      return 400;
    }
    return screenHeight * 0.7;
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

  const toggleVoiceRecording = () => {
    setIsListening(!isListening);
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
      setIsListening(false);
      setIsVoiceMode(true);
    }
  }, [showAIModal]);

  const MAX_SINGLE_LINE_HEIGHT = 40;

  const isMultiLine = inputHeight > MAX_SINGLE_LINE_HEIGHT;
  const onInputContentSizeChange = (event: any) => {
    const height = event.nativeEvent.contentSize.height;
    setInputHeight(height);
  };

  return (
    <Modal
      visible={showAIModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowAIModal(false)}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end bg-black/50"
      >
        <View
          className="mx-4 mb-4 bg-neutral-900 rounded-3xl overflow-hidden"
          style={{
            height: getModalHeight(),
            maxHeight: screenHeight * 0.8,
          }}
        >
          <TouchableOpacity
            onPress={() => setShowAIModal(false)}
            className="items-center py-3"
          >
            <View className="w-12 h-1 bg-white/30 rounded-full" />
          </TouchableOpacity>

          <View className="flex-row items-center justify-between px-6 pb-4">
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
                <TouchableOpacity
                  onPress={() => setIsVoiceMode((prev) => !prev)}
                  className="w-12 h-12 bg-white/10 rounded-full items-center justify-center"
                >
                  {isVoiceMode ? (
                    <Feather name="message-circle" size={22} color="white" />
                  ) : (
                    <Feather name="mic" size={22} color="white" />
                  )}
                </TouchableOpacity>

                <Text className="text-white text-xl font-semibold">
                  {isVoiceMode ? "Voice Chat" : "Merlin"}
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
            ) : isVoiceMode ? (
              <View className="flex-1 items-center justify-center">
                <TouchableOpacity
                  onPress={toggleVoiceRecording}
                  disabled={isLoading}
                >
                  <Animated.View
                    style={{ transform: [{ scale: scaleAnim }] }}
                    className={`w-24 h-24 rounded-full items-center justify-center ${
                      isListening ? "bg-red-600" : "bg-neutral-800"
                    }`}
                  >
                    <Feather name="mic" size={40} color="white" />
                  </Animated.View>
                </TouchableOpacity>
                <Text className="text-white/80 text-base mt-4">
                  {isListening ? "Listening..." : "Tap to speak"}
                </Text>
              </View>
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
                      Comming right up..
                    </Text>
                  </View>
                )}
              </ScrollView>
            )}
          </View>

          {!showHistory && !isVoiceMode && (
            <View className="px-6 pb-8 pt-4">
              <View
                className={`flex-row ${
                  isMultiLine ? "items-end" : "items-center"
                } bg-[#FFFFFF30]/[19%] border border-[#00000029]/[16%] px-5 ${
                  isMultiLine ? "rounded-lg py-3" : "rounded-full py-3"
                }`}
              >
                <Feather
                  name="plus"
                  size={20}
                  color="white"
                  style={{ marginRight: 12, marginBottom: isMultiLine ? 8 : 0 }}
                />

                <TextInput
                  className="flex-1 text-white text-base ml-4"
                  placeholder="Ask Merlin AI"
                  placeholderTextColor="#9CA3AF"
                  value={aiInput}
                  onChangeText={setAiInput}
                  multiline
                  maxLength={50}
                  onContentSizeChange={onInputContentSizeChange}
                  style={{
                    marginBottom: isMultiLine ? 6 : 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                  }}
                />

                <TouchableOpacity
                  onPress={() => {
                    if (aiInput.trim()) {
                      sendTextMessage();
                    } else {
                      setIsVoiceMode(true);
                    }
                  }}
                  disabled={isLoading}
                  className={`rounded-full ${
                    aiInput.trim() && !isLoading ? "bg-white p-3" : "p-0"
                  }`}
                >
                  {aiInput.trim() ? (
                    <Feather
                      name="arrow-up"
                      size={20}
                      color={isLoading ? "#666" : "black"}
                    />
                  ) : (
                    <Image source={icons.voice} className="h-12 w-12" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AIModal;
