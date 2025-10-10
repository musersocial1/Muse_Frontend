import DeletePostFlowModal from "@/components/modals/DeletePostFlowModal";
import FlagMemberFlowModal from "@/components/modals/FlagMemberModal";
import FlagPostFlowModal from "@/components/modals/FlagPostFlowModal";
import { videoComments } from "@/constants/data";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Feather, Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  GestureResponderEvent,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

interface VideoReplyModalProps {
  onClose: () => void;
  startIndex?: number;
  showVideoReply: boolean;
  videos: any[];
}

export default function VideoReply({
  onClose,
  startIndex = 0,
  videos,
  showVideoReply,
}: VideoReplyModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const [deletePost, setDeletePost] = useState(false);
  const [flagPost, setFlagPost] = useState(false);
  const [flagMember, setFlagMember] = useState(false);
  const activeVideo = videos[currentIndex];

  const currentVideo = videoComments[currentIndex];

  const beforeUser = currentIndex > 0 ? videos[currentIndex - 1].user : null;
  const activeUser = videos[currentIndex]?.user;
  const afterUser =
    currentIndex < videos.length - 1 ? videos[currentIndex + 1].user : null;
  const translateY = useRef(new Animated.Value(0)).current;
  const infoOpacity = useRef(new Animated.Value(1)).current;

  const fadeOutInfo = () => {
    Animated.timing(infoOpacity, {
      toValue: 0.4,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const fadeInInfo = () => {
    Animated.timing(infoOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const shiftHeader = (direction: "up" | "down") => {
    Animated.timing(translateY, {
      toValue: direction === "down" ? -52 : 52, // shift stack
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      // reset after animation
      translateY.setValue(0);
    });
  };

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

  const [displayedUser, setDisplayedUser] = useState(videos[startIndex]?.user);
  const [incomingUser, setIncomingUser] = useState<any | null>(null);

  const slideAnimPrev = useRef(new Animated.Value(0)).current;
  const slideAnimNext = useRef(new Animated.Value(0)).current;

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const index = Math.round(contentOffset.y / height);

    if (index !== currentIndex && index >= 0 && index < videos.length) {
      const direction = index > currentIndex ? "down" : "up";
      shiftHeader(direction);

      setCurrentIndex(index);
      setShowMenu(false);
    }
  };

  const insets = useSafeAreaInsets();
  React.useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: startIndex * height,
        animated: false,
      });
    }
  }, [startIndex]);

  const renderVideoItem = (item: (typeof videoComments)[0], index: number) => (
    <View key={item.id} style={{ height }} className="relative">
      <View className="flex-1 bg-primary ">
        <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
          <Image
            source={{ uri: item.posterUri }}
            style={StyleSheet.absoluteFillObject}
            className="h-full w-full"
            resizeMode="cover"
          />

          <View className="absolute inset-0 items-center justify-center ">
            <TouchableOpacity className="w-16 h-16 rounded-full overflow-hidden items-center justify-center bg-black/40">
              <BlurView style={StyleSheet.absoluteFill} intensity={50} />
              <Image
                source={icons.play}
                className="h-8 w-8 "
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
        {/* Bottom info */}
        <Animated.View
          style={{
            opacity: infoOpacity,
            paddingBottom: Platform.OS == "android" ? 5 : insets.bottom + 5,
          }}
          className="absolute  left-0 right-0 bottom-0 px-6 z-10"
        >
          <View
            style={{
              width,
              position: "absolute",
              bottom: 0,
              top: 0,
            }}
          >
            <MaskedView
              style={StyleSheet.absoluteFill}
              maskElement={
                <>
                  {/* Base gradient mask */}
                  <LinearGradient
                    colors={["transparent", "black"]}
                    locations={[0, 0.7]}
                    style={StyleSheet.absoluteFill}
                  />

                  {/* Alt gradient mask, fades in/out */}
                  <Animated.View style={[StyleSheet.absoluteFill]}>
                    <LinearGradient
                      colors={["rgba(0,0,0,0)", "black"]}
                      locations={[0, 1]}
                      style={StyleSheet.absoluteFill}
                    />
                  </Animated.View>
                </>
              }
            >
              {/* Single BlurView behind mask */}
              <BlurView
                style={StyleSheet.absoluteFill}
                experimentalBlurMethod="dimezisBlurView"
                tint="systemChromeMaterialDark"
                intensity={100}
              />
              <BlurView
                style={StyleSheet.absoluteFill}
                experimentalBlurMethod="dimezisBlurView"
                tint="systemChromeMaterialDark"
                intensity={100}
              />
            </MaskedView>
          </View>
          <View className="flex-row items-center mb-1.5">
            <Image
              source={{ uri: item.user.avatar }}
              className="w-12 h-12 rounded-full mr-2.5"
            />
            <Text className="text-white font-sfpro-bold  text-[15px]">
              @{item.user.name}
            </Text>
          </View>

          <Text
            className="text-white font-sfpro-bold text-[16px] mb-0.5 w-full max-w-[70%]"
            numberOfLines={2}
          >
            {item.description}
          </Text>

          <Text className="text-white/60 text-[14px] font-sfpro-bold my-2">
            {item.likes.toLocaleString()} Likes
          </Text>

          <View className="flex-row  items-center justify-between ">
            <View className="flex-row items-center gap-3 space-x-6">
              <TouchableOpacity className="flex-row items-center bg-[#363636]/40 rounded-full overflow-hidden p-3">
                <BlurView
                  style={[StyleSheet.absoluteFill]}
                  tint="light"
                  intensity={50}
                  // experimentalBlurMethod="dimezisBlurView"
                />
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={26}
                  color="#D1D5DB"
                />
                <Text className="ml-1 text-white text-base">
                  {item.comments}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center rounded-full overflow-hidden w-14 h-14 justify-center p-3">
                <BlurView
                  style={[StyleSheet.absoluteFill]}
                  tint="light"
                  intensity={50}
                  // experimentalBlurMethod="dimezisBlurView"
                />
                <Feather name="heart" size={22} color="#D1D5DB" />
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center gap-3 space-x-6">
              <TouchableOpacity className=" w-14 h-14 justify-center  overflow-hidden p-4 rounded-full">
                <BlurView
                  style={[StyleSheet.absoluteFill]}
                  tint="light"
                  intensity={50}
                  // experimentalBlurMethod="dimezisBlurView"
                />
                <Feather name="send" size={20} color="white" />
              </TouchableOpacity>

              <TouchableOpacity className=" w-14 h-14 justify-center  overflow-hidden items-center rounded-full">
                <BlurView
                  style={[StyleSheet.absoluteFill]}
                  tint="light"
                  intensity={50}
                  // experimentalBlurMethod="dimezisBlurView"
                />
                <Feather name="bookmark" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={showVideoReply} // or whatever state controls visibility
      animationType="slide" // or "fade", "none"
      presentationStyle="fullScreen" // for full screen modal
      onRequestClose={() => onClose()} // Android back button handling
    >
      {/* Top bar */}
      <View
        style={{ top: Platform.OS == "android" ? 10 : insets.top }}
        className="absolute   left-0 right-0 z-10 flex-row items-center justify-between px-5"
      >
        <View className="flex-row  relative   items-center z-[200]">
          <TouchableOpacity
            onPress={() => {
              onClose();
            }}
            activeOpacity={0.7}
            className="h-14 w-14 overflow-hidden border-white/50 border rounded-full b items-center justify-center z-20"
          >
            <BlurView
              style={[StyleSheet.absoluteFill]}
              tint="dark"
              intensity={90}
              experimentalBlurMethod="dimezisBlurView"
            />
            <Feather name="chevron-left" size={20} color="#D1D5DB" />
          </TouchableOpacity>
        </View>

        <View
          className="flex-row rounded-full items-center justify-center overflow-hidden"
          style={{
            minWidth: width * 0.46,
            maxWidth: width * 0.7,
          }}
        >
          <View
            className="flex-row  items-center px-4"
            style={{
              borderRadius: 40,
              // backgroundColor: "rgba(0,0,0,0.25)",
              overflow: "hidden",
            }}
          >
            <BlurView
              style={[StyleSheet.absoluteFill]}
              tint="dark"
              intensity={90}
              experimentalBlurMethod="dimezisBlurView"
            />

            <Text className="text-white/70 text-sm mr-1.5">Replying to:</Text>

            <View style={{ height: 52, overflow: "hidden" }}>
              <Animated.View
                style={{
                  transform: [{ translateY }],
                }}
              >
                {beforeUser && (
                  <View
                    style={{
                      height: 52,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{ uri: beforeUser.avatar }}
                      className="w-7 h-7 rounded-full mr-1.5"
                    />
                    <Text className="text-white font-bold text-[15px]">
                      {beforeUser.name}
                    </Text>
                  </View>
                )}

                {activeUser && (
                  <View
                    style={{
                      height: 52,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{ uri: activeUser.avatar }}
                      className="w-7 h-7 rounded-full mr-1.5"
                    />
                    <Text className="text-white font-bold text-[15px]">
                      {activeUser.name}
                    </Text>
                  </View>
                )}

                {afterUser && (
                  <View
                    style={{
                      height: 52,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{ uri: afterUser.avatar }}
                      className="w-7 h-7 rounded-full mr-1.5"
                    />
                    <Text className="text-white font-bold text-[15px]">
                      {afterUser.name}
                    </Text>
                  </View>
                )}
              </Animated.View>
            </View>
          </View>
        </View>

        {/* Menu */}
        <View className="flex-row relative  items-center  z-[200]">
          <TouchableOpacity
            onPress={() => setShowMenu(!showMenu)}
            activeOpacity={0.7}
            className="h-14 w-14 overflow-hidden border-white/30 border rounded-full  items-center justify-center z-20"
          >
            <BlurView
              style={[StyleSheet.absoluteFill]}
              tint="dark"
              intensity={90}
              experimentalBlurMethod="dimezisBlurView"
            />
            <Feather
              name="more-vertical"
              size={20}
              color="#D1D5DB"
              // style={{ opacity: 0.7 }}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* Dropdown menu */}
      {showMenu && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowMenu(false)} // 👈 close menu on outside press
          className="z-[100]"
          style={StyleSheet.absoluteFill} // covers the whole screen
        >
          {/* Stop touches from bubbling down */}
          <View style={{ flex: 1 }}>
            {/* your menu */}
            <View
              className="absolute top-40 right-[7%] bg-[#12121299]/[50%] overflow-hidden  rounded-2xl z-50 min-w-[200px] p-2"
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
                tint="dark"
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
          </View>
        </TouchableOpacity>
      )}
      <ScrollView
        ref={scrollViewRef}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScrollBeginDrag={fadeOutInfo}
        onMomentumScrollEnd={(e) => {
          fadeInInfo();
          handleScroll(e); // keep your index handling
        }}
        onScrollEndDrag={fadeInInfo}
      >
        {videos.map((item, index) => renderVideoItem(item, index))}
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
    </Modal>
  );
}
