import { textComments, user, videoComments } from "@/constants/data";
import { icons } from "@/constants/icons";
import { Post } from "@/types/community";
import { Feather, Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { BlurView } from "expo-blur";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  FlatList as GHFlatList,
  ScrollView,
} from "react-native-gesture-handler";
import NudgeSuccessModal from "../modals/NudgeSuccessModal";
import RecordCommentModal from "../modals/RecordCommentModal";
import UserProfileModal from "../modals/UserProfileModal";
import VideoReply from "../modals/video-reply";
import VideoCommentsModal from "../modals/VideoComments";
import SwipeableCard from "./SwipeableCard";

const { width, height } = Dimensions.get("window");

// Wrap RNGH FlatList so native onScroll works with useNativeDriver
const AnimatedGHFlatList = Animated.createAnimatedComponent(GHFlatList as any);

type PostHeaderProps = {
  post: any; // Replace with your Post type
  onAuthorPress?: () => void;
  onMenuPress?: () => void;
  variant?: "default" | "overlay";
  containerClassName?: string;
};

export const PostHeader: React.FC<PostHeaderProps> = ({
  post,
  onAuthorPress,
  onMenuPress,
  variant = "default",
  containerClassName = "",
}) => {
  const baseRow = "flex-row justify-between items-center px-2 pt-3.5 pb-3 ";
  const overlayWrap =
    variant === "overlay" ? "absolute top-0 left-0 right-0 z-10" : "";

  return (
    <View
      pointerEvents="box-none"
      className={[overlayWrap, containerClassName].filter(Boolean).join(" ")}
    >
      <View className={baseRow}>
        <TouchableOpacity
          onPress={onAuthorPress}
          className="flex-row shrink bg-[#36363666]/[40%] rounded-full px-2 py-1  "
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.25,
            shadowRadius: 94.13,
            elevation: 16,
          }}
          activeOpacity={0.8}
        >
          <View className="w-12 h-12 rounded-full overflow-hidden mr-2">
            <Image
              source={{ uri: post.author.avatar }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          <View>
            <View className="flex-col">
              <View className="flex-row items-center pt-1">
                <Text className="text-white capitalize font-semibold text-[14px] mr-1.5">
                  {post.author.username}
                </Text>
                {post.author.verified && (
                  <View className="w-3.5 h-3.5 bg-[#0368FF] rounded-full items-center justify-center mr-2">
                    <Feather name="check" size={8} color="white" />
                  </View>
                )}
              </View>

              <Text className="text-white font-sfpro-medium text-[13px] pt-1">
                TBD Podcast
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View className="flex-row gap-1 items-center">
          <Text className="text-white/50 ml-2 font-sfpro-medium text-[16px]">
            {post.timestamp}
          </Text>

          <TouchableOpacity onPress={onMenuPress} hitSlop={8}>
            <Ionicons name="ellipsis-vertical" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

interface PostCardProps {
  post: Post;
  setIsOpen: (val: boolean) => void;
  setOpenComments: (val: boolean) => void;
  setShowRecordModal: (val: boolean) => void;
  onImageScrollStateChange?: (isScrolling: boolean) => void;
  scrollEnabled?: boolean;
  isVisible?: boolean;
  handleVideoCommentPress?: () => void;
  setShowVideoReply: (val: boolean) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  setIsOpen,
  setOpenComments,
  setShowRecordModal,
  onImageScrollStateChange,
  scrollEnabled = true,
  isVisible,
  handleVideoCommentPress,
  setShowVideoReply,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = React.useRef<any[]>([]).current;

  const [playingVideoIndex, setPlayingVideoIndex] = useState<number | null>(
    null
  );

  const handleVideoPlayback = (videoRef: any, index: number) => {
    if (videoRef && index === 0) {
      videoRef.playAsync();
      setPlayingVideoIndex(0);
      setTimeout(() => {
        videoRef.setPositionAsync(0);
        videoRef.playAsync();
      }, 3000);
    }
  };

  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [shouldShowReadMore, setShouldShowReadMore] = useState(false);

  const checkTextLength = (text: string) => {
    return text.length > 250;
  };

  useEffect(() => {
    setShouldShowReadMore(checkTextLength(post.content));
  }, [post.content]);

  const getDisplayText = () => {
    if (!shouldShowReadMore || isTextExpanded) {
      return post.content;
    }
    return post.content.substring(0, 200) + "...";
  };

  const hasMedia = useMemo(
    () =>
      (post.type === "image" &&
        Array.isArray(post.images) &&
        post.images.length > 0) ||
      (post.type === "video" &&
        Array.isArray(post.videos) &&
        post.videos.length > 0),
    [post]
  );

  return (
    <View className="my-[4px]">
      <Animated.View className="bg-[#1C1C1C] rounded-[30px] overflow-hidden relative">
        {!hasMedia && (
          <PostHeader
            post={post}
            onAuthorPress={() => setIsOpen(true)}
            onMenuPress={() => {}}
            variant="default"
          />
        )}

        {post.type === "image" && post.images && post.images.length > 0 && (
          <View className="px-2 mt-2">
            <View className="relative mb-3 w-full aspect-[1/1.1] rounded-[25px] overflow-hidden">
              <PostHeader
                post={post}
                onAuthorPress={() => setIsOpen(true)}
                onMenuPress={() => {}}
                variant="overlay"
              />
              <ScrollView
                horizontal
                pagingEnabled
                scrollEnabled={scrollEnabled}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                contentContainerStyle={{ alignItems: "center" }}
              >
                {post.images?.map((item, index) => (
                  <Image
                    key={index}
                    source={typeof item === "string" ? { uri: item } : item}
                    style={{ width: width - 30 }}
                    resizeMode="cover"
                    className="h-full"
                  />
                ))}
              </ScrollView>

              {post.images.length > 1 && (
                <View className="absolute bottom-8 w-full flex-row justify-center">
                  {post.images.map((_, i) => (
                    <View
                      key={i}
                      className={`h-2 mx-1 rounded-full ${
                        i === activeIndex ? "bg-white w-6" : "bg-white/40 w-2"
                      }`}
                    />
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {post.type === "video" && post.videos && post.videos.length > 0 && (
          <View className="px-2">
            <View className="relative rounded-[20px] w-full gap-5 overflow-hidden bg-[#242424] p-2">
              <PostHeader
                post={post}
                onAuthorPress={() => setIsOpen(true)}
                onMenuPress={() => {}}
                variant="overlay"
              />
              <View className="overflow-hidden">
                <View className="relative overflow-hidden aspect-[16/14] rounded-[15px] w-full">
                  <Image
                    source={post.thumbnail}
                    className="h-full w-full"
                    resizeMode="cover"
                  />
                  <View className="absolute inset-0 items-center justify-center">
                    <View className="overflow-hidden rounded-full p-5">
                      <BlurView
                        style={StyleSheet.absoluteFill}
                        intensity={50}
                        experimentalBlurMethod="dimezisBlurView"
                      />
                      <Image
                        source={icons.play}
                        className="h-8 w-8"
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View className="flex-row pb-2 px-1 justify-between items-start">
                <View className="w-[80%]">
                  <Text className="text-white text-[16px] font-sfpro-bold">
                    The travails of being a dancer in the modern age
                  </Text>
                  <Text className="text-white/50 text-[13px] font-sfpro-medium mt-2">
                    Content from TBD Podcast
                  </Text>
                </View>
                <View className="bg-[black]/[70%] rounded-full px-3 py-3 self-start">
                  <Text className="text-white font-medium text-[12px]">
                    45:54
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {hasMedia && (
          <View className="flex-row px-6 items-center pb-4 justify-between pt-2">
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setOpenComments(true)}
                className="flex-row items-center rounded-full"
              >
                <View className="w-8 h-8 rounded-full items-center justify-center mr-1">
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={27}
                    color="#D1D5DB"
                  />
                </View>
                <Text className="text-white text-sm">{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity className="rounded-full">
                <Feather name="send" size={22} color="white" />
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-1">
              <TouchableOpacity className="rounded-full">
                <Feather name="bookmark" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View className="pb-3 px-6">
          <View className="flex-row flex-wrap items-baseline">
            <Text className="text-white text-[17px] inline-flex items-baseline  leading-[20px]">
              <Text className="font-sfpro-bold">{post.author.username}</Text>{" "}
              <Text className="font-sfpro-medium">{getDisplayText()}</Text>
              {shouldShowReadMore && (
                <TouchableOpacity
                  onPress={() => setIsTextExpanded(!isTextExpanded)}
                >
                  <Text className="text-[#0368FF] ml-3 inline-flex items-baseline text-[15px] -mb-1 leading-[15px] font-sfpro-medium">
                    {isTextExpanded ? "Read less" : "Read more"}
                  </Text>
                </TouchableOpacity>
              )}
            </Text>
          </View>
        </View>

        {!hasMedia && (
          <View className="flex-row px-6 items-center pb-4 justify-between pt-1">
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setOpenComments(true)}
                className="flex-row items-center rounded-full"
              >
                <View className="w-8 h-8 rounded-full items-center justify-center mr-1">
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={27}
                    color="#D1D5DB"
                  />
                </View>
                <Text className="text-white text-sm">{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity className="rounded-full">
                <Feather name="send" size={22} color="white" />
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-1">
              <TouchableOpacity className="rounded-full">
                <Feather name="bookmark" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View className="flex-row px-6 items-center pb-4 justify-between pt-2">
          <TouchableOpacity
            onPress={() => setShowVideoReply(true)}
            className="flex-row items-center"
          >
            <View className="flex-row">
              {post.vComments?.slice(0, 3).map((commentItem, index) => (
                <View
                  key={index}
                  className="w-8 h-8 rounded-full overflow-hidden border-2 border-black bg-black"
                  style={{ marginLeft: index === 0 ? 0 : -10 }}
                >
                  {commentItem.type === "video" ? (
                    <Video
                      source={{ uri: commentItem?.url || "" }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode={ResizeMode.COVER}
                      shouldPlay={false}
                      isMuted
                    />
                  ) : (
                    <Image
                      source={
                        typeof commentItem?.url === "string" &&
                        commentItem.url.startsWith("http")
                          ? { uri: commentItem.url }
                          : (commentItem?.url as any)
                      }
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  )}
                </View>
              ))}
            </View>

            <View className="flex-row items-center ml-1">
              <Ionicons name="play" size={16} color="#9CA3AF" />
              <Text className="text-white/60 ml-1 text-[14px] font-sfpro-medium">
                Watch comments
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowRecordModal(true)}
            className="flex-row items-center bg-[#363636]/[40%] rounded-full p-4"
          >
            <View className="w-5 h-5 rounded-full items-center justify-center mr-2">
              <Image source={icons.record} className="h-full w-full" />
            </View>
            <Text className="text-white font-sfpro-regular text-sm">
              Record a comment
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

interface AllFeedsProps {
  posts?: Post[];
  addPost?: () => void;
  setUploadVisible?: (val: boolean) => void;
  simulateUpload?: any;
  externalScrollEnabled?: boolean;
  setExternalScrollEnabled?: (val: boolean) => void;
  onShowLikePuff?: () => void;
  onShowDislikePuff?: () => void;
  onScroll?: (event: any) => void; // Animated.event from parent
  scrollEventThrottle?: number;
  contentContainerStyle?: any;
}

const AllFeeds: React.FC<AllFeedsProps> = ({
  posts,
  addPost,
  setUploadVisible,
  simulateUpload,
  setExternalScrollEnabled,
  externalScrollEnabled,
  onShowLikePuff,
  onShowDislikePuff,
  onScroll,
  scrollEventThrottle,
  contentContainerStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedPosts, setFeedPosts] = useState<Post[]>(posts ?? []);
  const [openComponent, setOpenComments] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [videoData, setVideoData] = useState<any>(null);
  const [showRecordModal, setShowRecordModal] = useState(false);

  const centerY = height / 2 - 100;
  const likePosition = { x: (width * 3.3) / 4 - 50, y: centerY };
  const dislikePosition = { x: (width * 0.45) / 4 - 50, y: centerY };

  const [activeSwipeIndex, setActiveSwipeIndex] = useState<number | null>(null);
  const [imageScrollingStates, setImageScrollingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [activeSwipeStates, setActiveSwipeStates] = useState<{
    [key: string]: boolean;
  }>({});

  const scrollStateTimeoutRef = useRef<number | null>(null);
  const cardRefs = useRef<{ [key: string]: View | null }>({});

  const handleRecordComment = (video: any) => {
    setVideoData(video);
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

  const removePostWithLike = (id: string) => {
    onShowLikePuff?.();
    setFeedPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const removePostWithDislike = (id: string) => {
    onShowDislikePuff?.();
    setFeedPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleGestureStateChange = (postId: string, isActive: boolean) => {
    setActiveSwipeStates((prev) => {
      const newState = { ...prev, [postId]: isActive };

      if (scrollStateTimeoutRef.current) {
        clearTimeout(scrollStateTimeoutRef.current);
      }

      // Debounce to avoid flapping scrollEnabled
      // @ts-ignore: setTimeout type
      scrollStateTimeoutRef.current = setTimeout(() => {
        const hasActiveGestures = Object.values(newState).some(Boolean);
        const hasImageScrolling =
          Object.values(imageScrollingStates).some(Boolean);
        const shouldDisableScroll = hasActiveGestures || hasImageScrolling;

        if (setExternalScrollEnabled) {
          setExternalScrollEnabled(!shouldDisableScroll);
        }
      }, 30);

      return newState;
    });
  };

  const handleImageScrollStateChange = (
    postId: string,
    isScrolling: boolean
  ) => {
    setImageScrollingStates((prev) => {
      const newState = { ...prev, [postId]: isScrolling };

      const hasActiveGestures = Object.values(activeSwipeStates).some(Boolean);
      const hasImageScrolling = Object.values(newState).some(Boolean);
      const shouldDisableScroll = hasActiveGestures || hasImageScrolling;

      if (setExternalScrollEnabled) {
        setExternalScrollEnabled(!shouldDisableScroll);
      }

      return newState;
    });
  };

  const handleSwipeProgress = (
    postId: string,
    progress: number,
    isActive: boolean
  ) => {
    if (isActive) {
      const swipeIndex = feedPosts.findIndex((post) => post.id === postId);
      if (swipeIndex !== -1 && swipeIndex !== activeSwipeIndex) {
        setActiveSwipeIndex(swipeIndex);
      }
    } else if (!isActive && activeSwipeIndex !== null) {
      setTimeout(() => {
        setActiveSwipeIndex(null);
      }, 50);
    }
  };

  useEffect(() => {
    return () => {
      if (scrollStateTimeoutRef.current) {
        clearTimeout(scrollStateTimeoutRef.current);
      }
    };
  }, []);

  const [visiblePostIds, setVisiblePostIds] = useState<string[]>([]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    const ids = viewableItems.map((v: any) => v.item.id);
    setVisiblePostIds(ids);
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  const [showVideoReply, setShowVideoReply] = useState(false);
  const handleVideoCommentPress = () => {
    setShowVideoReply(true);
  };

  const effectiveScrollEnabled = externalScrollEnabled ?? true;

  const keyExtractor = useCallback((item: Post) => item.id, []);

  return (
    <View className="relative w-full">
      <AnimatedGHFlatList
        data={feedPosts}
        keyExtractor={keyExtractor as any}
        nestedScrollEnabled
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScroll={onScroll} // animated onScroll from parent (useNativeDriver)
        scrollEventThrottle={scrollEventThrottle ?? 16}
        renderItem={({ item, index }: any) => (
          <View
            key={item.id}
            ref={(ref) => {
              cardRefs.current[item.id] = ref;
            }}
            collapsable={false}
            className="w-full"
          >
            <SwipeableCard
              onSwipeLeft={() => removePostWithDislike(item.id)}
              onSwipeRight={() => removePostWithLike(item.id)}
              index={index}
              activeSwipeIndex={activeSwipeIndex}
              disabled={imageScrollingStates[item.id] || false}
              onSwipeProgress={(progress, isActive) =>
                handleSwipeProgress(item.id, progress, isActive)
              }
              onGestureStateChange={(isActive) =>
                handleGestureStateChange(item.id, isActive)
              }
            >
              <PostCard
                post={item}
                setIsOpen={setIsOpen}
                setOpenComments={setOpenComments}
                setShowRecordModal={setShowRecordModal}
                onImageScrollStateChange={(isScrolling) =>
                  handleImageScrollStateChange(item.id, isScrolling)
                }
                handleVideoCommentPress={handleVideoCommentPress}
                isVisible={visiblePostIds.includes(item.id)}
                setShowVideoReply={setShowVideoReply}
              />
            </SwipeableCard>
          </View>
        )}
        scrollEnabled={effectiveScrollEnabled}
        showsVerticalScrollIndicator={false}
        // Replaced contentContainerClassName with style for compatibility
        contentContainerStyle={contentContainerStyle}
        maxToRenderPerBatch={2}
        windowSize={2}
        initialNumToRender={1}
        removeClippedSubviews
      />

      {showVideoReply && (
        <VideoReply
          videos={videoComments}
          showVideoReply={showVideoReply}
          startIndex={0}
          onClose={() => setShowVideoReply(false)}
        />
      )}

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
          simulateUpload?.();
        }}
      />
    </View>
  );
};

export default AllFeeds;
