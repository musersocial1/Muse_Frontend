import { textComments, user, videoComments } from "@/constants/data";
import { icons } from "@/constants/icons";
import { Post } from "@/types/community";

import React, { useCallback, useRef, useState } from "react";
import { Animated, View } from "react-native";
import { FlatList as GHFlatList } from "react-native-gesture-handler";
import NudgeSuccessModal from "../modals/NudgeSuccessModal";
import RecordCommentModal from "../modals/RecordCommentModal";
import UserProfileModal from "../modals/UserProfileModal";
import VideoReply from "../modals/video-reply";
import VideoCommentsModal from "../modals/VideoComments";
import { PostCard } from "./AllFeeds";

const AnimatedGHFlatList = Animated.createAnimatedComponent(GHFlatList as any);

interface NormalFeedsProps {
  posts?: Post[];
  addPost?: () => void;
  setUploadVisible?: (val: boolean) => void;
  simulateUpload?: any;
  externalScrollEnabled?: boolean;
  setExternalScrollEnabled?: (val: boolean) => void;
  onScroll?: () => void;
  ListHeaderComponent?: React.ReactNode;
}

const NormalFeeds: React.FC<NormalFeedsProps> = ({
  posts,
  addPost,
  setUploadVisible,
  simulateUpload,
  externalScrollEnabled,
  ListHeaderComponent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedPosts, setFeedPosts] = useState<Post[]>(posts ?? []);
  const [openComponent, setOpenComments] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [videoData, setVideoData] = useState<any>(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [activeSwipeStates, setActiveSwipeStates] = useState<{
    [key: string]: boolean;
  }>({});

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
        ListHeaderComponent={ListHeaderComponent}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item, index }: any) => (
          <View
            key={item.id}
            ref={(ref) => {
              cardRefs.current[item.id] = ref;
            }}
            collapsable={false}
            className="w-full"
          >
            <PostCard
              post={item}
              setIsOpen={setIsOpen}
              setOpenComments={setOpenComments}
              setShowRecordModal={setShowRecordModal}
              handleVideoCommentPress={handleVideoCommentPress}
              isVisible={visiblePostIds.includes(item.id)}
              setShowVideoReply={setShowVideoReply}
            />
          </View>
        )}
        scrollEnabled={effectiveScrollEnabled}
        showsVerticalScrollIndicator={false}
        // Replaced contentContainerClassName with style for compatibility
        // contentContainerStyle={contentContainerStyle}
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

export default NormalFeeds;
