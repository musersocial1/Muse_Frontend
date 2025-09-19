import { textComments, user, videoComments } from "@/constants/data";
import { icons } from "@/constants/icons";
import { Post } from "@/types/community";
import { Feather, Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { BlurView } from "expo-blur";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import NudgeSuccessModal from "../modals/NudgeSuccessModal";
import RecordCommentModal from "../modals/RecordCommentModal";
import UserProfileModal from "../modals/UserProfileModal";
import VideoCommentsModal from "../modals/VideoComments";
import SwipeableCard from "./SwipeableCard";

const { width } = Dimensions.get("window");

interface PostCardProps {
  post: Post;
  setIsOpen: (val: boolean) => void;
  setOpenComments: (val: boolean) => void;
  setShowRecordModal: (val: boolean) => void;
  onImageScrollStateChange?: (isScrolling: boolean) => void; // Add this
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  setIsOpen,
  setOpenComments,
  setShowRecordModal,
  onImageScrollStateChange, // Add this
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = React.useRef<any[]>([]).current;

  return (
    // <View className="px-[10px] py-[8px] bg-[#121212] ">
    <Animated.View className="bg-[#1C1C1C] rounded-[30px]  overflow-hidden">
      <View className="flex-row  justify-between  items-center px-6 pt-6  pb-3">
        <TouchableOpacity
          onPress={() => setIsOpen(true)}
          className=" flex-row shrink"
        >
          <View className="w-12 h-12 rounded-full overflow-hidden mr-2">
            <Image
              source={icons.user}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View>
            <View className="flex-col">
              <View className="flex-row  items-center">
                <Text className="text-white capitalize font-semibold text-[16px] mr-1">
                  {post.author.name}
                </Text>
                {post.author.verified && (
                  <View className="w-4 h-4 bg-[#0368FF] rounded-full items-center justify-center mr-2">
                    <Feather name="check" size={8} color="white" />
                  </View>
                )}
              </View>
              <Text className="text-white/50 font-sfpro-medium text-[15px]">
                {post.author.username}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View className="flex-row  gap-1 items-center">
          <View className="bg-[#FFFFFF]/[6%] px-4 py-3 rounded-full">
            <Text className="text-white/80 font-sfpro-bold text-[13px]">
              TBD Podcast
            </Text>
          </View>
          <Text className="text-white/50 ml-2 font-sfpro-medium text-[16px]">
            {post.timestamp}
          </Text>
          <TouchableOpacity className="">
            <Ionicons name="ellipsis-vertical" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      <View className=" pb-3  px-6 ">
        <Text className="text-white text-[17px]  font-sfpro-medium leading-[20px]">
          {post.content}
        </Text>
        <Text className="text-white/50 font-sfpro-bold text-[13px] pt-2">
          {post.likes.toLocaleString()} likes
        </Text>
      </View>

      {/* Post Image (if exists) */}
      {post.type === "image" && post.images && post.images.length > 0 && (
        <View className=" px-6">
          <View className="mb-3   w-full  aspect-[1/1.1]  rounded-[25px] overflow-hidden">
            {/* <FlatList
              data={post.images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Image
                  source={typeof item === "string" ? { uri: item } : item}
                  style={{ width: width - 42 }}
                  resizeMode="cover"
                  className=" h-full"
                />
              )}
              onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / (width - 80)
                );
                setActiveIndex(index);
              }}
              scrollEventThrottle={16}
            /> */}
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScrollBeginDrag={() => onImageScrollStateChange?.(true)}
              onScrollEndDrag={() => onImageScrollStateChange?.(false)}
              onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / (width - 42)
                );
                setActiveIndex(index);
              }}
              onMomentumScrollEnd={() => onImageScrollStateChange?.(false)} // 👈 extra safety
              scrollEventThrottle={16}
              contentContainerStyle={{ alignItems: "center" }}
            >
              {post.images?.map((item, index) => (
                <Image
                  key={index}
                  source={typeof item === "string" ? { uri: item } : item}
                  style={{ width: width - 42 }}
                  resizeMode="cover"
                  className="h-full"
                />
              ))}
            </ScrollView>

            {/* Dots Pagination */}
            <View className="absolute bottom-8 w-full flex-row justify-center">
              {post.images.map((_, i) => (
                <View
                  key={i}
                  className={`h-2  mx-1 rounded-full ${
                    i === activeIndex ? "bg-white w-6" : "bg-white/40 w-2"
                  }`}
                />
              ))}
            </View>
          </View>
        </View>
      )}
      {post.type === "video" && post.videos && post.videos.length > 0 && (
        <View className="  px-5">
          <View className="  rounded-[20px] w-full gap-5  overflow-hidden bg-[#242424] p-3 ">
            <View className=" overflow-hidden">
              <View className="relative  overflow-hidden aspect-[16/9] rounded-[15px] w-full">
                {/* Video Thumbnail */}
                <Image
                  source={post.thumbnail}
                  className="h-full w-full"
                  resizeMode="cover"
                />

                {/* Play Icon Overlay */}
                <View className="absolute  inset-0 items-center justify-center">
                  <View className="overflow-hidden rounded-full p-5">
                    <BlurView
                      style={StyleSheet.absoluteFill}
                      intensity={50}
                      experimentalBlurMethod="dimezisBlurView"
                    />
                    <Image
                      source={icons.play}
                      className="h-8 w-8 "
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </View>
            </View>

            <View className="flex-row pb-2 px-1 justify-between items-start  ">
              <View className="w-[80%]">
                <Text className="text-white text-[16px] font-sfpro-bold">
                  The travails of being a dancer in the modern age
                </Text>
                <Text className="text-white/50 text-[13px]  font-sfpro-medium mt-2">
                  Content from TBD Podcast
                </Text>
              </View>

              {/* Duration tag */}
              <View className="bg-[black]/[70%] rounded-full px-3 py-3 self-start">
                <Text className="text-white font-medium text-[12px]">
                  45:54
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Post Actions */}
      <View className="flex-row px-6 items-center pb-4 justify-between pt-4 ">
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => setOpenComments(true)}
            className="flex-row items-center bg-[#363636]/40 rounded-full p-3"
          >
            <View className="w-6 h-6 rounded-full items-center justify-center mr-1">
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={20}
                color="#D1D5DB"
              />
            </View>
            <Text className="text-white text-sm">{post.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowRecordModal(true)}
            className="flex-row items-center bg-[#363636]/[40%] rounded-full p-3"
          >
            <View className="w-5 h-5 rounded-full items-center justify-center mr-2 ">
              <Image source={icons.record} className="h-full w-full" />
            </View>
            <Text className="text-white font-sfpro-regular text-sm">
              Record a comment
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-1">
          <TouchableOpacity className="bg-[#363636]/[40%] p-3 rounded-full">
            <Feather name="send" size={18} color="white" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-[#363636]/[40%] p-3 rounded-full">
            <Feather name="bookmark" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      {post.vComments && post.vComments.length > 0 && (
        <View className=" pb-6 ">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}
          >
            {post.vComments.slice(0, 6).map((commentUri, index) => {
              return (
                <View key={index} className="relative ">
                  <View className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/40">
                    {/* <Image
                    source={{ uri: commentUri }}
                    className="w-full rounded-full h-full "
                    resizeMode="cover"
                  /> */}
                    <Video
                      source={{ uri: commentUri }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 999,
                      }}
                      resizeMode={ResizeMode.COVER}
                      shouldPlay
                      isLooping={false}
                      isMuted
                      // Limit playback to 3 seconds
                      onLoad={() => {
                        const loop = async () => {
                          try {
                            await videoRefs[index]?.playFromPositionAsync(0); // start from beginning
                            setTimeout(async () => {
                              await videoRefs[index]?.pauseAsync(); // pause after 3s
                              loop(); // restart again
                            }, 3000);
                          } catch (e) {
                            console.log("Video loop error", e);
                          }
                        };

                        loop(); // kick off the loop
                      }}
                      ref={(ref) => {
                        if (!videoRefs[index]) videoRefs[index] = ref;
                      }}
                    />
                  </View>
                </View>
              );
            })}
            {/* See All Button */}
            {post.vComments.length > 6 && (
              <TouchableOpacity className="items-center">
                <View className="w-20 h-20 rounded-full border-4 border-white/40 bg-[#2c2c2c] items-center justify-center">
                  <Text className="text-white  text-base font-neutral-medium">
                    See all
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}
    </Animated.View>
    // </View>
  );
};

interface AllFeedsProps {
  posts?: Post[];
  addPost?: () => void;
  setUploadVisible?: (val: boolean) => void;
  simulateUpload?: any;
}

const AllFeeds: React.FC<AllFeedsProps> = ({
  posts,
  addPost,
  setUploadVisible,
  simulateUpload,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedPosts, setFeedPosts] = useState<Post[]>(posts ?? []);

  const [openComponent, setOpenComments] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [videoData, setVideoData] = useState<any>(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  // In your PostCard component, add state
  const [isScrollingImages, setIsScrollingImages] = useState(false);

  const handleRecordComment = (video: any) => {
    setVideoData(video);
    // setOpenComments(false);
    setTimeout(() => {
      setShowRecordModal(true);
    }, 100);
  };
  const handleVideoPress = (video: any) => {
    setVideoData(video);
    setOpenComments(false);
    setTimeout(() => {
      setVideoModalVisible(true);
    }, 100);
  };

  const handleNudge = () => {
    setIsOpen(false);
    setTimeout(() => {
      setModalVisible(true);
    }, 100);
  };

  if (!feedPosts || feedPosts.length === 0) {
    return (
      <View className="px-6 pb-20 items-center justify-center flex-1">
        {/* Overlapping Cards with Shadow Effect */}
        <View className="mb-8 relative">
          {/* Card 3 - Back card */}
          <View
            className="absolute w-20 h-24 bg-[#6B46C1] rounded-2xl"
            style={{
              transform: [{ rotate: "-15deg" }],
              zIndex: 1,
              left: -10,
              top: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View className="w-full h-full rounded-2xl overflow-hidden">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1494790108755-2616c2e8e0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Card 2 - Middle card */}
          <View
            className="absolute w-20 h-24 bg-[#EF4444] rounded-2xl"
            style={{
              transform: [{ rotate: "8deg" }],
              zIndex: 2,
              left: 15,
              top: -5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View className="w-full h-full rounded-2xl overflow-hidden">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Card 1 - Front card */}
          <View
            className="w-20 h-24 bg-[#10B981] rounded-2xl"
            style={{
              zIndex: 3,
              left: 40,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View className="w-full h-full rounded-2xl overflow-hidden">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        <Text className="text-white text-[20px] font-semibold mb-3 text-center">
          You aren't in any communities yet
        </Text>
        <Text className="text-gray-400 text-[16px] text-center mb-8 leading-6">
          Tap below to explore and find your{"\n"}favorite communities!
        </Text>

        <TouchableOpacity
          onPress={addPost}
          className="bg-[#0368FF] rounded-full py-4 px-8"
          activeOpacity={0.8}
          style={{
            shadowColor: "#0368FF",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Text className="text-white text-[16px] font-semibold">
            Browse communities
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // New state for managing card removal
  const [removingCards, setRemovingCards] = useState<Set<string>>(new Set());

  const removePost = (id: string) => {
    console.log("Removing post:", id);
    setFeedPosts((prev) => prev.filter((p) => p.id !== id));
  };
  const [scrollEnabled, setScrollEnabled] = useState<boolean>(true);
  const [imageScrollingStates, setImageScrollingStates] = useState<{
    [key: string]: boolean;
  }>({});

  const handleImageScrollStateChange = (
    postId: string,
    isScrolling: boolean
  ) => {
    console.log("is scroling", isScrolling);
    setImageScrollingStates((prev) => ({
      ...prev,
      [postId]: isScrolling,
    }));
  };

  // Add this to your AllFeeds component state
  const [activeSwipeIndex, setActiveSwipeIndex] = useState<number | null>(null);

  // Update your handleSwipeProgress function
  const handleSwipeProgress = (
    postId: string,
    progress: number,
    isActive: boolean
  ) => {
    console.log(`Swipe progress for ${postId}:`, progress, isActive);

    if (isActive) {
      // Find the index of the post being swiped
      const swipeIndex = feedPosts.findIndex((post) => post.id === postId);
      if (swipeIndex !== -1) {
        setActiveSwipeIndex(swipeIndex);
        // console.log(`Now swiping on index: ${swipeIndex}`);
      }
    } else {
      // Clear the active swipe index when swipe ends
      setActiveSwipeIndex(null);
      // console.log("Swipe ended, cleared active index");
    }
  };
  // Add this to your AllFeeds component state
  const cardRefs = useRef<{ [key: string]: View | null }>({});

  return (
    <View className="relative">
      <FlatList
        data={feedPosts}
        keyExtractor={(item) => item.id}
        // renderItem={({ item }) => (
        //   <PostCard
        //     post={item}
        //     setIsOpen={setIsOpen}
        //     setOpenComments={setOpenComments}
        //     setShowRecordModal={setShowRecordModal}
        //   />
        // )}
        renderItem={({ item, index }) => (
          <View
            ref={(ref) => {
              cardRefs.current[item.id] = ref;
            }}
            collapsable={false} // Important for Android
          >
            <SwipeableCard
              onSwipeLeft={() => removePost(item.id)}
              onSwipeRight={() => removePost(item.id)}
              index={index}
              activeSwipeIndex={activeSwipeIndex}
              disabled={imageScrollingStates[item.id] || false} // Pass the state here
              onSwipeProgress={(progress, isActive) =>
                handleSwipeProgress(item.id, progress, isActive)
              }
              onGestureStateChange={(isActive) => setScrollEnabled(!isActive)}
              // isRemoving={removingCards.has(item.id)} // Pass removal state
            >
              <PostCard
                post={item}
                setIsOpen={setIsOpen}
                setOpenComments={setOpenComments}
                setShowRecordModal={setShowRecordModal}
                onImageScrollStateChange={(isScrolling) =>
                  handleImageScrollStateChange(item.id, isScrolling)
                }
              />
            </SwipeableCard>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        // scrollEnabled={false}
        contentContainerStyle={{
          paddingBottom: 20,
          paddingTop: 10,
        }}
        // Optimize for better performance
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={10}
        scrollEnabled={scrollEnabled}

        // ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
      />
      <UserProfileModal
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        user={user}
        onNudge={handleNudge}
      />
      <NudgeSuccessModal
        visible={modalVisible}
        onDone={() => setModalVisible(false)}
        undoNudge={() => setModalVisible(false)}
        avatarUrl={icons.user}
        username="Ericjames"
      />
      <VideoCommentsModal
        visible={openComponent}
        onClose={() => {
          setOpenComments(false);
          setVideoData(null);
        }}
        videoComments={videoComments}
        textComments={textComments}
        onLeaveComment={() => console.log("leave comment")}
        onRecordComment={handleRecordComment}
        onOpenVideo={handleVideoPress}
      />

      <RecordCommentModal
        visible={showRecordModal}
        onClose={() => setShowRecordModal(false)}
        onSubmit={(data) => {
          console.log("Posted:", data);
          setShowRecordModal(false);
          setUploadVisible?.(true);
          simulateUpload();
        }}
      />
    </View>
  );
};

export default AllFeeds;
