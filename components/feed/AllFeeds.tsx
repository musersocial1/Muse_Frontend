import { textComments, user, videoComments } from "@/constants/data";
import { icons } from "@/constants/icons";
import { usePostContext } from "@/context/PostsContext";
import { Post } from "@/types/community";
import { Feather, Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
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

const AnimatedGHFlatList = Animated.createAnimatedComponent(GHFlatList as any);

export type PostHeaderProps = {
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
  const baseRow = "flex-row  justify-between items-center  pt-2 pb-3  ";
  const overlayWrap =
    variant === "overlay" ? "absolute top-0 left-0 right-0 z-10 px-2" : "px-4";

  return (
    <View
      pointerEvents="box-none"
      className={`${[overlayWrap, containerClassName]
        .filter(Boolean)
        .join(" ")} z-[88]`}
    >
      <View className={baseRow}>
        <TouchableOpacity
          onPress={onAuthorPress}
          className={`flex-row shrink ${
            overlayWrap ? "bg-[#36363666]/[0%]" : ""
          }  rounded-full pl-1  pr-2 py-1  `}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.25,
            shadowRadius: 94.13,
            elevation: 16,
            overflow: "hidden",
          }}
          activeOpacity={0.8}
        >
          {/* {overlayWrap && (
            <BlurView
              intensity={50}
              style={[StyleSheet.absoluteFill, { borderRadius: 28 }]}
              experimentalBlurMethod="dimezisBlurView"
              tint="dark"
            />
          )} */}

          <View className="w-11 h-11 rounded-full overflow-hidden mr-1.5">
            <Image
              source={{ uri: post.author.avatar }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          <View>
            <View className="flex-col">
              <View className="flex-row  items-center pt-1">
                <Text className="text-white capitalize font-sfpro-bold text-[12px]  mr-1">
                  {post.author.username}
                </Text>
                {post.author.verified && (
                  <View className=" rounded-full items-center justify-center mr-1">
                    <Image source={icons.check} className="w-4 h-4" />
                  </View>
                )}
              </View>

              <Text className="text-white font-sfpro-bold text-[10px] pt-[5px]">
                TBD Podcast
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View
          // intensity={50}
          // tint="dark"
          className="flex-row gap-1  items-center p-2 rounded-full overflow-hidden"
        >
          <Text className="text-white ml-1 font-sfpro-medium text-[15px]">
            {post.timestamp}
          </Text>

          <TouchableOpacity onPress={onMenuPress} hitSlop={8}>
            <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export interface PostCardProps {
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

export function CollapsibleText({
  text,
  lines = 2,
  post,
  hasMedia,
}: {
  text: string;
  lines?: number;
  post: any;
  hasMedia: any;
}) {
  const [expanded, setExpanded] = useState(false);
  const MAX_WORDS = !hasMedia ? 30 : 13; // Adjust this number based on your needs

  const words = text.split(" ");
  const shouldTruncate = words.length > MAX_WORDS;
  const displayText =
    expanded || !shouldTruncate ? text : words.slice(0, MAX_WORDS).join(" ");

  return (
    <TouchableOpacity
      key={displayText}
      onPress={() => setExpanded((v) => !v)}
      activeOpacity={0.9}
    >
      <Text
        className="font-sfpro-medium text-white text-[14.5px]"
        // style={{ flexShrink: 1 }}
      >
        {hasMedia && (
          <>
            <Text className="  text-white text-[16px] font-sfpro-bold ">
              {post.author.username}{" "}
            </Text>{" "}
          </>
        )}
        {displayText}
        {shouldTruncate && (
          <Text className="text-[white]/70 text-[15px] font-sfpro-bold">
            {expanded ? " Read less" : " Read more"}
          </Text>
        )}
      </Text>
    </TouchableOpacity>
  );
}
export const PostCard: React.FC<PostCardProps> = ({
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
    <View className="my-[4px]  ">
      <Animated.View className="bg-[#1C1C1C] border border-white/10 rounded-[30px]  overflow-hidden relative">
        {!hasMedia && (
          <PostHeader
            post={post}
            onAuthorPress={() => setIsOpen(true)}
            onMenuPress={() => {}}
            variant="default"
          />
        )}

        {post.type === "image" && post.images && post.images.length > 0 && (
          <View className="px-2  mt-2">
            <View className="relative mb-3 w-full aspect-[2/1.7] rounded-[25px] overflow-hidden ">
              <PostHeader
                post={post}
                onAuthorPress={() => setIsOpen(true)}
                onMenuPress={() => {}}
                variant="overlay"
              />

              <View
                className="w-full h-16 z-[10] "
                style={StyleSheet.absoluteFill}
              >
                <LinearGradient
                  colors={["rgba(28, 28, 28, 1)", "rgba(0, 0, 0, 0)"]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={StyleSheet.absoluteFill}
                  // className="z-[1000]"
                />
              </View>
              <ScrollView
                horizontal
                pagingEnabled
                scrollEnabled={scrollEnabled}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
              >
                {post.images?.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      width: width - 30,
                      height: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#0a0a0a",
                    }}
                  >
                    <Image
                      source={typeof item === "string" ? { uri: item } : item}
                      resizeMode="cover"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </View>
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
          <View className="px-1 mt-2 ">
            <View className=" px-1  overflow-hidden  rounded-[20px]">
              <LinearGradient
                colors={["rgba(0, 0, 0, 0)", "rgba(18, 18, 18, 1)"]}
                start={{ x: 0.5, y: 0.78 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View className="relative   rounded-[20px] w-full gap-5 overflow-hidden  ">
                <PostHeader
                  post={post}
                  onAuthorPress={() => setIsOpen(true)}
                  onMenuPress={() => {}}
                  variant="overlay"
                />
                <View
                  className="w-full h-16 z-[10] "
                  style={StyleSheet.absoluteFill}
                >
                  <LinearGradient
                    colors={["rgba(28, 28, 28, 1)", "rgba(0, 0, 0, 0)"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={StyleSheet.absoluteFill}
                    // className="z-[1000]"
                  />
                </View>
                <View className="overflow-hidden ">
                  <View className="relative overflow-hidden aspect-[2/1.5] rounded-[15px] w-full">
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

                <View className="flex-row  pb-4 px-3 justify-between items-start">
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
          </View>
        )}

        {hasMedia && (
          <View className="flex-row px-6 items-center pb-4 justify-between pt-3">
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setOpenComments(true)}
                className="flex-row items-center rounded-full"
              >
                <View className="w-8 h-8 rounded-full items-center justify-center mr-1">
                  <Image source={icons.likes} className="w-7 h-7" />
                </View>
                <Text className="text-white font-sfpro-bold text-[14px]">
                  {post.likes}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center rounded-full">
                <View className="w-8 h-8 rounded-full items-center justify-center">
                  <Image source={icons.share} className="w-[23px] h-[23px]" />
                </View>
                <Text className="text-white font-sfpro-bold text-[14px]">
                  Share
                </Text>
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
              <CollapsibleText
                text={post.content}
                hasMedia={hasMedia}
                lines={2}
                post={post}
              />
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
                  <Image source={icons.likes} className="w-7 h-7" />
                </View>
                <Text className="text-white font-sfpro-bold text-[14px]">
                  {post.likes}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center rounded-full">
                <View className="w-8 h-8 rounded-full items-center justify-center">
                  <Image source={icons.share} className="w-[23px] h-[23px]" />
                </View>
                <Text className="text-white font-sfpro-bold text-[14px]">
                  Share
                </Text>
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
              {post.vComments?.slice(0, 4).map((commentItem, index) => (
                <View
                  key={index}
                  className="w-8 h-8 rounded-full overflow-hidden   bg-black"
                  style={{ marginLeft: index === 0 ? 0 : -16 }}
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
              <Ionicons name="play" size={16} color="white" />
              <Text className="text-white ml-1 text-[15px] font-sfpro-medium">
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
  onScroll?: (event: any) => void;
  scrollEventThrottle?: number;
  contentContainerStyle?: any;
  ListHeaderComponent?: React.ReactNode | null;
  stickyHeaderIndices?: number[] | undefined;
  ListHeaderComponentStyle?: any;
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
  ListHeaderComponent,
  stickyHeaderIndices,
  ListHeaderComponentStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedPosts, setFeedPosts] = useState<Post[]>(posts ?? []);
  const [openComponent, setOpenComments] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [videoData, setVideoData] = useState<any>(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const { setLiked, setDisliked } = usePostContext();

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
    setLiked((prev) => [...prev, posts?.find((p) => p.id === id)!]);
  };

  const removePostWithDislike = (id: string) => {
    onShowDislikePuff?.();
    setFeedPosts((prev) => prev.filter((p) => p.id !== id));
    setDisliked((prev) => [...prev, posts?.find((p) => p.id === id)!]);
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
    <View className="relative w-full ">
      <AnimatedGHFlatList
        data={feedPosts}
        keyExtractor={keyExtractor as any}
        nestedScrollEnabled
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScroll={onScroll} // animated onScroll from parent (useNativeDriver)
        scrollEventThrottle={scrollEventThrottle ?? 16}
        ListHeaderComponent={ListHeaderComponent}
        stickyHeaderIndices={stickyHeaderIndices}
        ListHeaderComponentStyle={ListHeaderComponentStyle}
        ListEmptyComponent={
          <View className="h-[300px] w-full items-center justify-center">
            <Text className="text-white/50 text-[16px]">
              No more posts to show
            </Text>
          </View>
        }
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
              onSwipeRight={() => removePostWithDislike(item.id)}
              onSwipeLeft={() => removePostWithLike(item.id)}
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
