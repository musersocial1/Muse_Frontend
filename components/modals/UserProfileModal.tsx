import { images } from "@/constants/images";
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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DragToClose from "../navigations/DragToClose";
import { FadingBlurBackground } from "../ui/FadingBlurBackground";

interface Community {
  id: string;
  name: string;
  memberCount: number;
  profileImage: string;
  memberImages: string[];
}

interface UserProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: {
    name: string;
    username: string;
    profileImage: string;
    verified: boolean;
    communities: Community[];
  };
  onNudge: () => void;
}

type ViewMode = "profile" | "communities";

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  visible,
  onClose,
  user,
  onNudge,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("profile");
  const [searchQuery, setSearchQuery] = useState("");

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
        setViewMode("profile");
        setSearchQuery("");
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

  const handleCommunitiesPress = () => {
    setViewMode("communities");
  };

  const handleBackPress = () => {
    setViewMode("profile");
  };

  const renderProfileView = () => {
    return (
      <View className="px-6 pb-6">
        <Text className="text-[#FFFFFF] text-[20px] font-bold text-center mb-8">
          User profile
        </Text>

        <View className="items-center mb-8">
          <View className="mb-2 relative items-center justify-center">
            <View className="w-[140px] h-[140px] rounded-full overflow-hidden border-2 border-white/10">
              <Image
                source={images.img11}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Username + Verified */}
          <View className="items-center">
            <View className="flex-row items-center mb-2">
              <Text className="text-white text-[28px] font-bold mr-2">
                {user.name}
              </Text>
              {user.verified && (
                <View className="w-6 h-6 bg-[#0368FF] rounded-full items-center justify-center">
                  <Feather name="check" size={12} color="white" />
                </View>
              )}
            </View>

            <Text className="text-white/60 text-[18px] font-medium mb-6">
              {user.username}
            </Text>

            {/* Communities */}
            <TouchableOpacity
              onPress={handleCommunitiesPress}
              className="bg-[#FFFFFF]/[8%] rounded-full px-4 py-2 flex-row items-center mb-8"
              activeOpacity={0.8}
            >
              <View className="flex-row mr-1">
                {user.communities.slice(0, 2).map((community, index) => (
                  <View
                    key={community.id}
                    className="w-8 h-8 rounded-full overflow-hidden"
                    style={{ marginLeft: index > 0 ? -8 : 0 }}
                  >
                    <Image
                      source={{
                        uri:
                          community.memberImages[index] ||
                          community.profileImage,
                      }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </View>

              <Text className="text-white/80 text-[16px] font-medium mr-2">
                +{user.communities.length} communities
              </Text>

              <Feather name="chevron-right" size={16} color="#FFFFFF80" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Nudge Button */}
        <TouchableOpacity
          onPress={() => {
            onNudge();
            closeWithSlide();
          }}
          className="bg-white rounded-full py-5"
          activeOpacity={0.8}
          style={{
            shadowColor: "#FFFFFF",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Text className="text-black text-center text-[18px] font-bold">
            Nudge
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCommunitiesView = () => {
    return (
      <View className="px-6 pb-6">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={handleBackPress}
            className="w-12 h-12 bg-[#F3F3F326]/[15%] rounded-full items-center justify-center"
            activeOpacity={0.8}
          >
            <Feather name="chevron-left" size={20} color="white" />
          </TouchableOpacity>

          <Text className="text-[#FFFFFF] text-[20px] font-bold flex-1 text-center">
            Communities
          </Text>
        </View>

        {/* Search Bar */}
        <View className="bg-[#3636364D]/[30%] rounded-full px-4 py-4 flex-row items-center mb-6  border border-[#FFFFFF1A]/[10%]">
          <Feather name="search" size={20} color="#FFFFFF60" className="mr-3" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search"
            placeholderTextColor="#FFFFFF60"
            className="flex-1 text-white font-bold text-[16px] ml-1"
          />
        </View>

        {/* Communities List */}
        <ScrollView className="mb-6" showsVerticalScrollIndicator={false}>
          {user.communities.map((community) => (
            <View
              key={community.id}
              className="bg-[#2C2C2C] rounded-[24px] p-4 mb-4"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="w-14 h-14 rounded-full overflow-hidden mr-4">
                    <Image
                      source={{ uri: community.profileImage }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-white text-[18px] font-bold mb-1">
                      {community.name}
                    </Text>

                    <View className="flex-row items-center">
                      <View className="flex-row mr-2">
                        {community.memberImages
                          .slice(0, 4)
                          .map((image, index) => (
                            <View
                              key={index}
                              className="w-5 h-5 rounded-full overflow-hidden "
                              style={{ marginLeft: index > 0 ? -6 : 0 }}
                            >
                              <Image
                                source={{ uri: image }}
                                className="w-full h-full"
                                resizeMode="cover"
                              />
                            </View>
                          ))}
                      </View>

                      <Text className="text-[#FFFFFF]/60 text-[14px] font-medium">
                        +{community.memberCount} Members
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Details Button */}
                <TouchableOpacity
                  className="bg-white rounded-full px-6 py-3.5"
                  activeOpacity={0.8}
                >
                  <Text className="text-black text-[14px] font-bold">
                    Details
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Done Button */}
        <TouchableOpacity
          onPress={closeWithSlide}
          className="bg-white rounded-full py-5"
          activeOpacity={0.8}
        >
          <Text className="text-black text-center text-[18px] font-bold">
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
                {viewMode === "profile"
                  ? renderProfileView()
                  : renderCommunitiesView()}
              </View>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default UserProfileModal;
