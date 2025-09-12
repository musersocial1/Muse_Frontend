import { icons } from "@/constants/icons";
import { Feather, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  GestureResponderEvent,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type VideoReplyModalProps = {
  visible: boolean;
  onClose: () => void;
  videoUri: any;
  posterUri: string;
  user: { name: string; avatar: string };
  replyingTo: { name: string; avatar: string };
  likes: number;
  comments: number;
  description: string;
  onDelete: (e: GestureResponderEvent) => void;
  onFlagPost: (e: GestureResponderEvent) => void;
  onFlagMember: (e: GestureResponderEvent) => void;
};

const { width } = Dimensions.get("window");

export const VideoReplyModal: React.FC<VideoReplyModalProps> = ({
  visible,
  onClose,
  videoUri,
  posterUri,
  user,
  replyingTo,
  likes,
  comments,
  description,
  onDelete,
  onFlagPost,
  onFlagMember,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0.85);
      setShowMenu(false);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-primary">
        {/* Top bar */}
        <View className="absolute top-14 left-0 right-0 z-10 flex-row items-center justify-between px-5 mt-5">
          <View className="flex-row relative  items-center  py-4  z-[200]">
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              className="h-14 w-14 overflow-hidden border-white/30 border rounded-full bg-black/20 items-center justify-center z-20"
            >
              <BlurView
                style={[StyleSheet.absoluteFill]}
                experimentalBlurMethod="dimezisBlurView"
              />
              <Feather
                name="chevron-left"
                size={20}
                color="#D1D5DB"
                style={{ opacity: 0.7 }}
              />
            </TouchableOpacity>
          </View>

          <View
            className="flex-row items-center justify-center overflow-hidden"
            style={{
              minWidth: width * 0.46,
              maxWidth: width * 0.7,
              borderRadius: 40,
            }}
          >
            <LinearGradient
              colors={["rgba(255,255,255,0.25)", "rgba(102,102,102,0.25)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 40,
                padding: 1,
              }}
            >
              <View
                className="flex-row items-center px-4 py-3"
                style={{
                  borderRadius: 40,
                  backgroundColor: "rgba(0,0,0,0.25)",
                  overflow: "hidden",
                }}
              >
                <BlurView
                  intensity={60}
                  tint="dark"
                  experimentalBlurMethod="dimezisBlurView"
                  style={[StyleSheet.absoluteFill, { borderRadius: 40 }]}
                />

                <Text className="text-white/70 text-sm mr-1.5">
                  Replying to:
                </Text>
                <Image
                  source={{ uri: replyingTo.avatar }}
                  className="w-7 h-7 rounded-full mr-1.5"
                />
                <Text
                  className="text-white font-bold text-[15px]"
                  numberOfLines={1}
                >
                  {replyingTo.name}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Menu */}
          <View className="flex-row relative  items-center  py-4  z-[200]">
            <TouchableOpacity
              onPress={() => setShowMenu(!showMenu)}
              activeOpacity={0.7}
              className="h-14 w-14 overflow-hidden border-white/30 border rounded-full bg-black/20 items-center justify-center z-20"
            >
              <BlurView
                style={[StyleSheet.absoluteFill]}
                experimentalBlurMethod="dimezisBlurView"
              />
              <Feather
                name="more-vertical"
                size={20}
                color="#D1D5DB"
                style={{ opacity: 0.7 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Dropdown menu */}
        {showMenu && (
          <View
            className="absolute top-40 right-[10%] bg-[#121212CC]/[80%] rounded-2xl z-50 min-w-[200px] p-2"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.25,
              shadowRadius: 94.13,
              elevation: 16,
            }}
          >
            <TouchableOpacity
              className="flex-row items-center px-5 py-3.5"
              onPress={onDelete}
            >
              <Feather name="trash-2" size={20} color="#D1D5DB" />
              <Text className="ml-3 text-white text-base">Delete post</Text>
            </TouchableOpacity>
            <View className="h-px bg-white/10 mx-5" />
            <TouchableOpacity
              className="flex-row items-center px-5 py-3.5"
              onPress={onFlagPost}
            >
              <Feather name="flag" size={20} color="#D1D5DB" />
              <Text className="ml-3 text-white text-base">Flag post</Text>
            </TouchableOpacity>
            <View className="h-px bg-white/10 mx-5" />
            <TouchableOpacity
              className="flex-row items-center px-5 py-3.5"
              onPress={onFlagMember}
            >
              <Feather name="user-x" size={20} color="#D1D5DB" />
              <Text className="ml-3 text-white text-base">Flag member</Text>
            </TouchableOpacity>
          </View>
        )}

        <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
          <Image
            source={videoUri}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />

          <View className="absolute inset-0 items-center justify-center">
            <TouchableOpacity className="w-16 h-16 rounded-full overflow-hidden items-center justify-center bg-black/40">
              <BlurView
                style={StyleSheet.absoluteFill}
                experimentalBlurMethod="dimezisBlurView"
                intensity={50}
              />
              <Image
                source={icons.play}
                className="h-8 w-8"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 160,
            }}
            pointerEvents="none"
          />
        </Animated.View>

        {/* Bottom info */}
        <View className="absolute left-0 right-0 bottom-0 px-6 pb-10 z-10">
          <View className="flex-row items-center mb-1.5">
            <Image
              source={{ uri: user.avatar }}
              className="w-9 h-9 rounded-full mr-2.5"
            />
            <Text className="text-white font-bold text-[15px]">
              @{user.name}
            </Text>
          </View>

          {/* Description */}
          <Text
            className="text-white font-medium text-base mb-0.5"
            numberOfLines={2}
          >
            {description}
          </Text>

          {/* Likes */}
          <Text className="text-white/80 text-[15px] mb-2.5">2,007 Likes</Text>

          {/* Actions */}
          <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center gap-3 space-x-6">
              <TouchableOpacity className="flex-row items-center bg-[#363636]/40 rounded-full p-3">
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={26}
                  color="#D1D5DB"
                />
                <Text className="ml-1 text-white text-base">{comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center bg-[#363636]/40 rounded-full p-3">
                <Feather name="heart" size={26} color="#D1D5DB" />
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center gap-3 space-x-6">
              <TouchableOpacity className="bg-[#363636]/[40%] p-3 rounded-full">
                <Feather name="send" size={18} color="white" />
              </TouchableOpacity>

              <TouchableOpacity className="bg-[#363636]/[40%] p-3 rounded-full">
                <Feather name="bookmark" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
