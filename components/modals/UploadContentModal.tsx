import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CalendarSheet from "./Calendar";
import UploadProgressModal from "./UploadPgrogress";

interface UploadContentModalProps {
  visible: boolean;
  onClose: () => void;
  onPost: (contentData: ContentData) => void;
}

interface ContentData {
  type: "video" | "audio";
  file: any;
  title: string;
  description: string;
  publishDate: Date | null;
  hasScheduledPublish: boolean;
}

const formatLongDate = (d: Date) =>
  d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const toYYYYMMDD = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const UploadContentModal: React.FC<UploadContentModalProps> = ({
  visible,
  onClose,
  onPost,
}) => {
  const insets = useSafeAreaInsets();

  const [contentType, setContentType] = useState<"video" | "audio">("video");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hasScheduledPublish, setHasScheduledPublish] = useState(false);
  const [openPosting, setOpenPosting] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarTemp, setCalendarTemp] = useState<string | null>(null);

  const HIDE_OFFSET = 300;
  const sheetY = useRef(new Animated.Value(HIDE_OFFSET)).current;

  useEffect(() => {
    if (!visible) {
      setCalendarVisible(false);
      setCalendarTemp(null);
      setOpenPosting(false); // Reset upload progress when main modal closes
    }
  }, [visible]);

  const openCalendarSheet = (initialDate?: Date | null) => {
    setCalendarTemp(
      initialDate ? toYYYYMMDD(initialDate) : toYYYYMMDD(new Date())
    );
    setCalendarVisible(true);

    // Reset and animate in
    sheetY.setValue(HIDE_OFFSET);
    Animated.timing(sheetY, {
      toValue: 0,
      duration: 350,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeCalendarSheet = (after?: () => void) => {
    Animated.timing(sheetY, {
      toValue: HIDE_OFFSET,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setCalendarVisible(false);
      after?.();
    });
  };

  const blurOpacity = sheetY.interpolate({
    inputRange: [0, HIDE_OFFSET],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to access your media files.",
          [{ text: "OK" }]
        );
        return false;
      }
    }
    return true;
  };

  const pickFile = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      if (contentType === "video") {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: true,
          quality: 1,
        });

        if (!result.canceled) {
          setSelectedFile(result.assets[0]);
        }
      } else {
        const result = await DocumentPicker.getDocumentAsync({
          type: "audio/*",
          copyToCacheDirectory: true,
        });

        if (!result.canceled) {
          setSelectedFile(result.assets?.[0] ?? result);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick file");
    }
  };

  const handlePost = () => {
    const contentData: ContentData = {
      type: contentType,
      file: selectedFile,
      title,
      description,
      publishDate: selectedDate,
      hasScheduledPublish,
    };

    // Close this modal first, then show upload progress
    onClose();

    // Small delay to ensure the first modal is closed
    setTimeout(() => {
      onPost(contentData);
      setOpenPosting(true);
    }, 300);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setTitle("");
    setDescription("");
    setHasScheduledPublish(false);
    setSelectedDate(null);
    setCalendarVisible(false);
  };

  const handleScheduleToggle = (val: boolean) => {
    setHasScheduledPublish(val);

    if (val) {
      openCalendarSheet(selectedDate);
    } else {
      setSelectedDate(null);
      setCalendarVisible(false);
    }
  };

  const handleDateSelect = (date: string | null) => {
    if (date) {
      const d = new Date(date);
      setSelectedDate(d);
      setHasScheduledPublish(true);
    }
    setCalendarTemp(date);
  };

  return (
    <>
      {/* Main Upload Modal */}
      <Modal
        visible={visible && !calendarVisible && !openPosting} // Hide when child modals are open
        animationType="slide"
        transparent
        onRequestClose={onClose}
        presentationStyle="overFullScreen" // Ensure full screen coverage
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View
            className="flex-1 bg-primary"
            style={{
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
            }}
          >
            {/* Header */}
            <View className="flex-row justify-between items-center px-6 py-4">
              <TouchableOpacity onPress={onClose}>
                <Feather name="x" size={24} color="white" />
              </TouchableOpacity>

              <Text className="text-white text-[20px] font-bold">
                Upload content
              </Text>

              <TouchableOpacity>
                <Text className="text-[#0368FF] text-[16px] font-bold">
                  Drafts
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <View className="px-6 py-6">
                <View className="flex-row bg-[#FFFFFF0F]/[6%] rounded-[16px] p-2">
                  <TouchableOpacity
                    onPress={() => setContentType("video")}
                    className={`flex-1 py-4 rounded-[16px] ${
                      contentType === "video" ? "bg-[#0368FF]" : ""
                    }`}
                  >
                    <Text
                      className={`text-center font-bold ${
                        contentType === "video" ? "text-white" : "text-white/50"
                      }`}
                    >
                      Video
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setContentType("audio")}
                    className={`flex-1 py-4 rounded-full ${
                      contentType === "audio" ? "bg-[#0368FF]" : ""
                    }`}
                  >
                    <Text
                      className={`text-center font-bold ${
                        contentType === "audio" ? "text-white" : "text-white/50"
                      }`}
                    >
                      Audio
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Upload box */}
              <View className="px-6 mb-6">
                <Text className="text-white text-[16px] font-bold mb-2">
                  Upload {contentType}
                </Text>
                <Text className="text-white/50 text-[13px] font-medium mb-6">
                  Upload {contentType} file of your content
                </Text>

                <View className="relative rounded-2xl p-8 items-center mb-6 overflow-hidden">
                  <BlurView
                    tint="light"
                    intensity={10}
                    style={StyleSheet.absoluteFill}
                  />
                  <View className="w-16 h-16 bg-white/10 rounded-xl items-center justify-center mb-4">
                    <Feather
                      name={contentType === "video" ? "video" : "music"}
                      size={24}
                      color="white"
                    />
                  </View>

                  <Text className="text-white text-center text-[14px] font-bold mb-2">
                    Choose a {contentType} you want to upload here
                  </Text>

                  <Text className="text-white/50 text-center text-[12px] font-medium mb-6">
                    {contentType === "video"
                      ? "MP4, AVI, or MOV (max 1GB)"
                      : "MP3, WAV, or AAC (max 100MB)"}
                  </Text>

                  {selectedFile ? (
                    <Text className="text-green-400 text-sm font-bold py-3">
                      {selectedFile.name || "file selected"}
                    </Text>
                  ) : null}

                  <TouchableOpacity
                    onPress={pickFile}
                    className="bg-[#2F2F2F] rounded-full px-8 py-4"
                  >
                    <Text className="text-white font-medium">Browse file</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Content Details */}
              <View className="px-6 mb-6">
                <View className="relative overflow-hidden rounded-2xl mb-3">
                  <BlurView
                    tint="light"
                    intensity={10}
                    style={StyleSheet.absoluteFill}
                  />
                  <TextInput
                    value={title}
                    onChangeText={setTitle}
                    className="text-white text-[16px] font-bold rounded-xl px-4 py-4"
                    placeholder="Enter title"
                    placeholderTextColor="#6B7280"
                  />
                </View>

                <View className="relative overflow-hidden rounded-2xl">
                  <BlurView
                    tint="light"
                    intensity={10}
                    style={StyleSheet.absoluteFill}
                  />
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    className="text-white text-[16px] font-bold rounded-xl px-4 py-4 h-32"
                    placeholder="Enter description"
                    placeholderTextColor="#6B7280"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              <View className="px-6 mb-6">
                <View className="relative overflow-hidden rounded-2xl p-4">
                  <BlurView
                    tint="light"
                    intensity={10}
                    style={StyleSheet.absoluteFill}
                  />
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                      {selectedDate ? (
                        <Text className="text-white/50 text-[16px] font-bold mb-1">
                          {formatLongDate(selectedDate)}
                        </Text>
                      ) : (
                        <Text className="text-white/50 text-[16px] font-bold mb-1">
                          Add publish date
                        </Text>
                      )}
                    </View>

                    <View className="flex-row items-center">
                      <TouchableOpacity
                        onPress={() => openCalendarSheet(selectedDate)}
                        className="mr-4 p-2"
                      >
                        <Feather name="calendar" size={20} color="#6B7280" />
                      </TouchableOpacity>

                      <Switch
                        value={hasScheduledPublish}
                        onValueChange={handleScheduleToggle}
                        trackColor={{ false: "#374151", true: "#0368FF" }}
                        thumbColor="white"
                      />
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View className="px-6 py-4">
              <View className="flex-row space-x-4 gap-4">
                <TouchableOpacity
                  onPress={handleReset}
                  className="flex-1 bg-[#282828] rounded-full py-4"
                >
                  <Text className="text-white text-center text-lg font-bold">
                    Reset
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handlePost}
                  className="flex-1 bg-[#0368FF] rounded-full py-4"
                >
                  <Text className="text-white text-center text-lg font-bold">
                    Post
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Calendar Modal - Separate top-level modal */}
      <Modal
        visible={calendarVisible}
        transparent
        animationType="none"
        onRequestClose={() => closeCalendarSheet()}
        presentationStyle="overFullScreen"
        statusBarTranslucent={true}
      >
        <CalendarSheet
          visible={calendarVisible}
          onClose={() => closeCalendarSheet()}
          sheetY={sheetY}
          insets={insets}
          blurOpacity={blurOpacity}
          selectedDate={calendarTemp}
          onSelectDate={handleDateSelect}
        />
      </Modal>

      {/* Upload Progress Modal - Separate top-level modal */}
      <Modal
        visible={openPosting}
        transparent
        animationType="slide"
        onRequestClose={() => setOpenPosting(false)}
        presentationStyle="overFullScreen"
        statusBarTranslucent={true}
      >
        <UploadProgressModal
          visible={openPosting}
          onClose={() => setOpenPosting(false)}
        />
      </Modal>
    </>
  );
};

export default UploadContentModal;
