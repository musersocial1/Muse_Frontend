import { images } from "@/constants/images";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DragToClose from "../navigations/DragToClose";
import { FadingBlurBackground } from "../ui/FadingBlurBackground";
import UserProfileCommunities from "./userProfileCommunities";

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

  // get full device height
  const SCREEN_HEIGHT = 700;

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

  const handleCommunitiesPress = () => {
    setIsOpen(true);
  };

  const renderProfileView = () => {
    return (
      <View className="px-6 pb-6">
        <Text className="text-[#FFFFFF] text-[20px] font-sfpro-bold text-center mb-6">
          User profile
        </Text>

        <View className="items-center mb-8">
          <View className="mb-2 relative items-center justify-center">
            <View className="w-[120px] aspect-square rounded-full overflow-hidden border-2 border-white/10">
              <Image
                source={images.img11}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Username + Verified */}
          <View className="items-center  gap-3">
            <View className="flex-row items-center ">
              <Text className="text-white text-[20px] font-sfpro-bold mr-2">
                {user.name}
              </Text>
              {user.verified && (
                <View className="w-6 h-6 bg-[#0368FF] rounded-full items-center justify-center">
                  <Feather name="check" size={12} color="white" />
                </View>
              )}
            </View>

            <Text className="text-white/60 text-[16px] font-sfpro-medium">
              {user.username}
            </Text>

            {/* Communities */}
            <TouchableOpacity
              onPress={handleCommunitiesPress}
              className="bg-[#FFFFFF]/[8%] rounded-full p-3 flex-row items-center mb-2"
              activeOpacity={0.8}
            >
              <View className="flex-row mr-1">
                {user.communities.slice(0, 3).map((community, index) => (
                  <View
                    key={community.id}
                    className="w-9 h-9 rounded-full overflow-hidden"
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

              <Text className="text-white/50 text-[16px] font-sfpro-medium mx-2">
                +{user.communities.length} communities
              </Text>

              <Feather name="chevron-right" size={20} color="#FFFFFF80" />
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
          <Text className="text-black text-center text-[16px] font-bold">
            Nudge
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={onClose}
      >
        <UserProfileCommunities
          visible={isOpen}
          onClose={() => setIsOpen(false)}
          user={user}
          onNudge={() => setIsOpen(false)}
        />
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
              className="flex-1 pb-0 px-3 items-center justify-end"
            >
              <Animated.View
                style={{
                  transform: [{ translateY: sheetY }],
                  width: "100%",
                }}
                {...responder.panHandlers}
                className="w-full max-w-lg"
              >
                <View className=" w-full border border-white/10 rounded-[30px] overflow-hidden">
                  <View className="flex-1 items-center  absolute top-0 left-0 right-0 bottom-0">
                    <View className="w-[220px]  pt-24  blur-2xl aspect-square rounded-full  border-2 border-white/10">
                      <Image
                        source={images.img11}
                        className="w-full rounded-full h-full"
                        resizeMode="cover"
                        blurRadius={150}
                      />
                    </View>
                  </View>
                  <BlurView
                    style={StyleSheet.absoluteFill}
                    tint="dark"
                    intensity={100}
                    experimentalBlurMethod="dimezisBlurView"
                  />
                  <DragToClose translateY={sheetY} onClose={onClose} />
                  {renderProfileView()}
                </View>
              </Animated.View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
};

export default UserProfileModal;
