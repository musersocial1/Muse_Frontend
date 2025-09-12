import DeletePostFlowModal from "@/components/modals/DeletePostFlowModal";
import FlagMemberFlowModal from "@/components/modals/FlagMemberModal";
import FlagPostFlowModal from "@/components/modals/FlagPostFlowModal";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { Feather, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  GestureResponderEvent,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

// Sample video data - replace with your actual data
const videoComments = [
  {
    id: "1",
    videoUri: images.comment,
    posterUri: images.img11,
    user: {
      name: "john_doe",
      avatar: icons.user,
    },
    replyingTo: {
      name: "sarah_smith",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
    },
    likes: 2007,
    comments: 156,
    description: "New season, new slay! 🔥 Whether it’s street style...",
  },
  {
    id: "2",
    videoUri: images.comment,
    posterUri: images.img11,
    user: {
      name: "john_doe",
      avatar: icons.user,
    },
    replyingTo: {
      name: "mike_johnson",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
    },
    likes: 1543,
    comments: 89,
    description: "New season, new slay! 🔥 Whether it’s street style...",
  },
  {
    id: "3",
    videoUri: images.comment,
    posterUri: images.img11,
    user: {
      name: "john_doe",
      avatar: icons.user,
    },
    replyingTo: {
      name: "lisa_brown",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
    },
    likes: 3421,
    comments: 234,
    description: "New season, new slay! 🔥 Whether it’s street style...",
  },
];

export default function VideoReply() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const [deletePost, setDeletePost] = useState(false);
  const [flagPost, setFlagPost] = useState(false);
  const [flagMember, setFlagMember] = useState(false);

  const currentVideo = videoComments[currentIndex];

  const handleDelete = (e: GestureResponderEvent) => {
    console.log("Delete post");
    setShowMenu(false);
    setDeletePost(true);
  };

  const handleFlagPost = (e: GestureResponderEvent) => {
    console.log("Flag post");
    setShowMenu(false);
    setFlagPost(true);
  };

  const handleFlagMember = (e: GestureResponderEvent) => {
    console.log("Flag member");
    setShowMenu(false);
    setFlagMember(true);
  };

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const index = Math.round(contentOffset.y / height);
    if (index !== currentIndex && index >= 0 && index < videoComments.length) {
      setCurrentIndex(index);
      setShowMenu(false);
    }
  };

  const renderVideoItem = (item: (typeof videoComments)[0], index: number) => (
    <View key={item.id} style={{ height }} className="relative">
      <View className="flex-1 bg-primary">
        {/* Top bar */}
        <View className="absolute top-14 left-0 right-0 z-10 flex-row items-center justify-between px-5 mt-5">
          <View className="flex-row relative  items-center  py-4  z-[200]">
            <TouchableOpacity
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace(RouterConstantUtil.tabs.home as any);
                }
              }}
              activeOpacity={0.7}
              className="h-14 w-14 overflow-hidden border-white/30 border rounded-full bg-black/20 items-center justify-center z-20"
            >
              <BlurView style={[StyleSheet.absoluteFill]} />
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
                  style={[StyleSheet.absoluteFill, { borderRadius: 40 }]}
                />

                <Text className="text-white/70 text-sm mr-1.5">
                  Replying to:
                </Text>
                <Image
                  source={{ uri: item.replyingTo.avatar }}
                  className="w-7 h-7 rounded-full mr-1.5"
                />
                <Text
                  className="text-white font-bold text-[15px]"
                  numberOfLines={1}
                >
                  {item.replyingTo.name}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Menu */}
          <View className="flex-row relative  items-center  py-4  z-[200]">
            <TouchableOpacity
              onPress={() =>
                setShowMenu(index === currentIndex ? !showMenu : false)
              }
              activeOpacity={0.7}
              className="h-14 w-14 overflow-hidden border-white/30 border rounded-full bg-black/20 items-center justify-center z-20"
            >
              <BlurView style={[StyleSheet.absoluteFill]} />
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
        {showMenu && index === currentIndex && (
          <View
            className="absolute top-40 right-[7%] bg-[#12121299]/[60%] overflow-hidden  rounded-2xl z-50 min-w-[200px] p-2"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.25,
              shadowRadius: 94.13,
              elevation: 16,
            }}
          >
            <BlurView
              style={[StyleSheet.absoluteFill, { shadowRadius: 94.13 }]}
              intensity={100}
              experimentalBlurMethod="dimezisBlurView"
            />

            <TouchableOpacity
              className="flex-row items-center px-5 py-5"
              onPress={handleDelete}
            >
              <Feather name="trash-2" size={20} color="#D1D5DB" />
              <Text className="ml-3 text-white text-base">Delete post</Text>
            </TouchableOpacity>
            <View className="h-px bg-white/10 mx-5" />
            <TouchableOpacity
              className="flex-row items-center px-5 py-5"
              onPress={handleFlagPost}
            >
              <Feather name="flag" size={20} color="#D1D5DB" />
              <Text className="ml-3 text-white text-base">Flag post</Text>
            </TouchableOpacity>
            <View className="h-px bg-white/10 mx-5" />
            <TouchableOpacity
              className="flex-row items-center px-5 py-5"
              onPress={handleFlagMember}
            >
              <Feather name="user-x" size={20} color="#D1D5DB" />
              <Text className="ml-3 text-white text-base">Flag member</Text>
            </TouchableOpacity>
          </View>
        )}

        <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
          <Image
            source={item.videoUri}
            style={StyleSheet.absoluteFillObject}
            className="rounded-2xl h-full w-full"
            resizeMode="cover"
          />

          <View className="absolute inset-0 items-center justify-center">
            <TouchableOpacity className="w-16 h-16 rounded-full overflow-hidden items-center justify-center bg-black/40">
              <BlurView style={StyleSheet.absoluteFill} intensity={50} />
              <Image
                source={icons.play}
                className="h-8 w-8 "
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={["transparent", "rgba(18, 18, 18, 1)"]}
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
              source={item.user.avatar}
              className="w-9 h-9 rounded-full mr-2.5"
            />
            <Text className="text-white font-bold text-[15px]">
              @{item.user.name}
            </Text>
          </View>

          <Text
            className="text-white font-medium text-base mb-0.5 w-full max-w-[70%]"
            numberOfLines={2}
          >
            {item.description}
          </Text>

          <Text className="text-white/80 text-[15px] my-2.5">
            {item.likes.toLocaleString()} Likes
          </Text>

          <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center gap-3 space-x-6">
              <TouchableOpacity className="flex-row items-center bg-[#363636]/40 rounded-full p-3">
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={26}
                  color="#D1D5DB"
                />
                <Text className="ml-1 text-white text-base">
                  {item.comments}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center bg-[#363636]/40 rounded-full p-3">
                <Feather name="heart" size={26} color="#D1D5DB" />
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center gap-3 space-x-6">
              <TouchableOpacity className="bg-[#363636]/[40%] p-4 rounded-full">
                <Feather name="send" size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity className="bg-[#363636]/[40%] p-4 rounded-full">
                <Feather name="bookmark" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-primary">
      <ScrollView
        ref={scrollViewRef}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {videoComments.map((item, index) => renderVideoItem(item, index))}
      </ScrollView>

      <DeletePostFlowModal
        visible={deletePost}
        post={{
          image: images.comment,
          description: "New season, new slay! 🔥 Whether it's street...",
        }}
        onClose={() => setDeletePost(false)}
      />
      <FlagPostFlowModal
        visible={flagPost}
        post={{
          image: images.comment,
          description: "New season, new slay! 🔥 Whether it's street...",
        }}
        onClose={() => setFlagPost(false)}
      />
      <FlagMemberFlowModal
        visible={flagMember}
        member={{
          avatar: images.comment,
          name: "Chris Melody",
          username: "Chris",
        }}
        onClose={() => setFlagMember(false)}
      />
    </View>
  );
}
