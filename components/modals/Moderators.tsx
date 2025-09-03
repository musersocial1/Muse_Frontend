import { icons } from "@/constants/icons";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DragToClose from "../navigations/DragToClose";
import { FadingBlurBackground } from "../ui/FadingBlurBackground";

interface Moderator {
  id: string;
  name: string;
  email: string;
  status: "pending" | "active" | "declined";
  initials: string;
  permissions?: {
    memberPosts: boolean;
    creatorPosts: boolean;
    exclusiveContent: boolean;
    groups: boolean;
    communityAnalytics: boolean;
    communityCashflow: boolean;
  };
}

interface ModeratorsModalProps {
  visible: boolean;
  onClose: () => void;
  moderators: any[];
  onCancelRequest?: (moderatorId: string) => void;
  onAddModerator?: () => void;
}

type ViewMode = "list" | "detail";

const ModeratorsModal: React.FC<ModeratorsModalProps> = ({
  visible,
  onClose,
  moderators,
  onCancelRequest = (id) => console.log("Cancel request:", id),
  onAddModerator = () => console.log("Add moderator"),
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedModerator, setSelectedModerator] = useState<Moderator | null>(
    null
  );

  const insets = useSafeAreaInsets();
  const HIDE_OFFSET = 300;
  const sheetY = useRef(new Animated.Value(HIDE_OFFSET)).current;

  useEffect(() => {
    if (visible) {
      sheetY.setValue(HIDE_OFFSET);
      Animated.timing(sheetY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      sheetY.setValue(HIDE_OFFSET);
      setTimeout(() => {
        setViewMode("list");
        setSelectedModerator(null);
      }, 300);
    }
  }, [visible]);

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
    }).start(() => onClose());
  };

  const handleModeratorPress = (moderator: Moderator) => {
    setSelectedModerator(moderator);
    setViewMode("detail");
  };

  const handleCancelRequest = () => {
    if (selectedModerator) {
      onCancelRequest(selectedModerator.id);
      setViewMode("list");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <View className="bg-[#5B391B] rounded-full px-4 py-2">
            <Text className="text-[#E6C7AB] text-[12px] font-bold">
              Pending
            </Text>
          </View>
        );
      case "active":
        return (
          <View className="bg-green-500 rounded-full px-4 py-2">
            <Text className="text-white text-[12px] font-bold">Active</Text>
          </View>
        );
      case "declined":
        return (
          <View className="bg-red-600 rounded-full px-4 py-2">
            <Text className="text-white text-[12px] font-bold">Declined</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const renderDetailView = () => {
    if (!selectedModerator) return null;

    return (
      <View className="px-6 pb-6">
        <Text className="text-[#FFFFFF] text-[20px] font-bold text-center mb-7">
          Moderators
        </Text>

        <View className="items-center mb-8 ">
          <View className="w-20 h-20 bg-[#0368FF] rounded-full items-center justify-center mb-4">
            <Text className="text-white text-2xl font-bold">
              {selectedModerator.initials}
            </Text>
          </View>

          <Text className="text-white text-xl font-bold ">
            {selectedModerator.name}
          </Text>

          <Text className="text-white/50 text-[15px] font-medium mb-4">
            {selectedModerator.email}
          </Text>

          {getStatusBadge(selectedModerator.status)}
        </View>

        <View className="flex-row  gap-2 space-x-3 mb-2">
          <TouchableOpacity
            onPress={() => setViewMode("list")}
            className="flex-1 bg-[#FFFFFF24] rounded-full py-4"
            activeOpacity={0.8}
          >
            <Text className="text-white text-center text-lg font-bold">
              Done
            </Text>
          </TouchableOpacity>

          {selectedModerator.status === "pending" && (
            <TouchableOpacity
              onPress={handleCancelRequest}
              className="flex-1 bg-white rounded-full py-4"
              activeOpacity={0.8}
            >
              <Text className="text-black text-center text-lg font-bold">
                Cancel request
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderListView = () => {
    if (moderators.length === 0) {
      return (
        <View className="px-6 pb-6 items-center">
          <Text className="text-[#FFFFFF] text-[20px] font-bold text-center mb-7">
            Moderators
          </Text>

          <View className="w-16 h-16  rounded-full items-center justify-center mb-6">
            <Image
              source={icons.no_moderators}
              className="h-full w-full"
              resizeMode="cover"
            />
          </View>

          <Text className="text-white text-[16px] font-bold text-center mb-4">
            You have not added{"\n"}any moderators
          </Text>

          <Text className="text-white/50 text-center font-medium text-[14px] mb-8 leading-6">
            Moderators help ou manage sections on{"\n"}the platform you give
            them access to
          </Text>

          <TouchableOpacity
            onPress={() => {
              onAddModerator();
              closeWithSlide();
            }}
            className="bg-[#0368FF] rounded-full py-5 px-8 w-full max-w-sm"
            activeOpacity={0.8}
          >
            <Text className="text-white text-center text-lg font-bold">
              Add moderator
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View className="px-6 pb-6">
        <Text className="text-white text-xl font-bold text-center mb-8">
          Moderators
        </Text>

        <ScrollView className="mb-6" showsVerticalScrollIndicator={false}>
          {moderators.map((moderator) => (
            <TouchableOpacity
              key={moderator.id}
              onPress={() => handleModeratorPress(moderator)}
              className="flex-row items-center bg-[#242424] rounded-full p-4 mb-3"
              activeOpacity={0.8}
            >
              <View className="w-12 h-12 bg-[#0368FF] rounded-full items-center justify-center mr-1">
                <Text className="text-white text-lg font-bold">
                  {moderator.initials}
                </Text>
              </View>

              <View className="flex-1">
                <Text className="text-white text-[16px] font-bold mb-1">
                  {moderator.name}
                </Text>
                <Text className="text-gray-400 text-[13px] font-medium">
                  {moderator.email}
                </Text>
              </View>

              <View className="flex-row items-center">
                {getStatusBadge(moderator.status)}
                <Feather
                  name="chevron-right"
                  size={20}
                  color="#9CA3AF"
                  className="ml-3"
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          onPress={closeWithSlide}
          className="bg-[#FFFFFF24]/[14%] rounded-full py-5"
          activeOpacity={0.8}
        >
          <Text className="text-white text-center text-[14px] font-bold">
            Done
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1">
        <TouchableOpacity
          activeOpacity={1}
          style={StyleSheet.absoluteFill}
          onPress={closeWithSlide}
        >
          <FadingBlurBackground opacity={blurOpacity} />
        </TouchableOpacity>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View
            pointerEvents="box-none"
            style={{ marginBottom: insets.bottom }}
            className="flex-1 pb-3 px-3 items-center justify-end"
          >
            <Animated.View
              style={{
                transform: [{ translateY: sheetY }],
                width: "100%",
              }}
              className="w-full max-w-lg"
            >
              <View className="bg-[#1D1D1C] w-full border border-white/10 rounded-[30px] overflow-hidden">
                <DragToClose translateY={sheetY} onClose={onClose} />
                {viewMode === "detail" ? renderDetailView() : renderListView()}
              </View>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default ModeratorsModal;
