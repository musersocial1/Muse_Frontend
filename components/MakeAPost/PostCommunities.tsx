import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
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
  onDone?: (selectedIds: string[]) => void; // 👈 add
}

type ViewMode = "profile" | "communities";

const PostCommunities: React.FC<UserProfileModalProps> = ({
  visible,
  onClose,
  user,
  onNudge,
  onDone,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("profile");
  const [searchQuery, setSearchQuery] = useState("");

  const insets = useSafeAreaInsets();
  // get full device height
  const SCREEN_HEIGHT = Dimensions.get("window").height;

  // instead of hardcoding 700
  const HIDE_OFFSET = SCREEN_HEIGHT;
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

  const [selectedCommunityIds, setSelectedCommunityIds] = useState<string[]>(
    []
  );

  const toggleCommunity = (id: string) => {
    setSelectedCommunityIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const closeWithSlide = () => {
    Animated.timing(sheetY, {
      toValue: HIDE_OFFSET,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,

      onPanResponderMove: (_, g) => {
        if (g.dy > 0) sheetY.setValue(g.dy);
      },

      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          Animated.timing(sheetY, {
            toValue: 600,
            duration: 220,
            useNativeDriver: true,
          }).start(() => onClose());
        } else {
          Animated.spring(sheetY, {
            toValue: 0,
            bounciness: 6,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const renderCommunitiesView = () => {
    return (
      <View className="px-6 pb-6 ">
        <View className="flex-row items-center justify-between mb-6">
          {/* <TouchableOpacity
            onPress={handleBackPress}
            className="w-11 h-11 bg-[#F3F3F326]/[15%] absolute top-[-1.5rem] left-[-0.5rem] rounded-full items-center justify-center"
            activeOpacity={0.8}
          >
            <Feather name="chevron-left" size={20} color="white" />
          </TouchableOpacity> */}

          <Text className="text-[#FFFFFF] text-[20px] font-bold flex-1 text-center">
            Select communities
          </Text>
        </View>

        {/* Search Bar */}
        <View className="bg-[#3636364D]/[30%] rounded-full px-4  flex-row items-center mb-4  border border-[#FFFFFF1A]/[10%]">
          <Feather name="search" size={20} color="#FFFFFF60" className="mr-2" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search"
            placeholderTextColor="#FFFFFF60"
            className={`flex-1 text-white font-sfpro-medium text-[16px] ml-1  ${
              Platform.OS == "android" ? "py-3" : "py-4"
            }`}
            verticalAlign="middle"
            // 👆 ensures same vertical height on iOS & Android
          />
        </View>

        {/* Communities List */}
        <ScrollView className="mb-2" showsVerticalScrollIndicator={false}>
          {user.communities.map((community) => {
            const isSelected = selectedCommunityIds.includes(community.id);

            return (
              <TouchableOpacity
                key={community.id}
                onPress={() => toggleCommunity(community.id)}
                activeOpacity={0.95}
                className="bg-[#2C2C2C] rounded-[24px] p-4 mb-4"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row  items-center flex-1">
                    <View className="w-14 h-14 rounded-full overflow-hidden mr-2">
                      <Image
                        source={{ uri: community.profileImage }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </View>

                    <View className="flex-1 ">
                      <Text className="text-white text-[16px] font-bold mb-1">
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

                        <Text className="text-[#FFFFFF]/50 text-[14px] font-sfpro-medium">
                          +{community.memberCount} Members
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Right side → radio button */}
                  <View
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                      isSelected
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-500"
                    }`}
                  >
                    {isSelected && (
                      <Feather
                        name="check"
                        size={14}
                        color="white"
                        className=" leading-[18px]"
                      />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Done Button */}
        <TouchableOpacity
          onPress={() => {
            onDone?.(selectedCommunityIds);
            closeWithSlide();
          }}
          className="bg-white rounded-full py-[18px]"
          activeOpacity={0.8}
        >
          <Text className="text-[#191919]  leading-[16px] text-center text-[18px] font-sfpro-bold">
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
      animationType="none"
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
            {...responder.panHandlers}
            pointerEvents="box-none"
            style={{
              marginBottom: Platform.OS == "ios" ? insets.bottom * 0.5 : 0,
            }}
            className="flex-1 pb-3 px-1.5  items-center justify-end"
          >
            <Animated.View
              style={{
                transform: [{ translateY: sheetY }],
                width: "100%",
              }}
              className="w-full  max-w-lg"
            >
              <View className=" w-full border border-white/10 rounded-[30px] overflow-hidden bg-[#111112]">
                {/* <BlurView
                  style={StyleSheet.absoluteFill}
                  tint="systemChromeMaterialDark"
                  intensity={100}
                /> */}
                <DragToClose translateY={sheetY} onClose={onClose} />
                {renderCommunitiesView()}
              </View>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default PostCommunities;
