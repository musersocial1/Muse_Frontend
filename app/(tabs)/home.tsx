import AllFeeds from "@/components/feed/AllFeeds";
import UploadToast from "@/components/feed/UploadToast";
import CommunitySwitcher from "@/components/modals/CommunitySwitcher";
import StoryCreator from "@/components/modals/StoryCreatorModal";
import StoryModal from "@/components/modals/StoryModal";
import PuffySmoke from "@/components/ui/PuffySmoke";
import { DUMMY_STORIES, dummyAllPosts } from "@/constants/data";
import { images } from "@/constants/images";
import { Feather, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const STORIES = [
  images.img6,
  images.img7,
  images.img8,
  images.img9,
  images.img10,
  images.img11,
  images.img12,
  images.img6,
  images.img7,
  images.img8,
  images.img9,
  images.img10,
  images.img11,
  images.img12,
];

const Home: React.FC = () => {
  const [posts] = useState(dummyAllPosts);
  const [feedScrollEnabled, setFeedScrollEnabled] = useState(true);
  const [selectedCommunity, setSelectedCommunity] = useState("All");
  const [openSwitcher, setOpenSwitcher] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showLikePuff, setShowLikePuff] = useState(false);
  const [showDislikePuff, setShowDislikePuff] = useState(false);
  const [topBarHeight, setTopBarHeight] = useState(0);
  const [visibleIds, setVisibleIds] = useState<any[]>([]);
  const [createStory, setCreateStory] = useState(false);
  const [viewStory, setViewStory] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const prevScrollY = useRef(0);
  const headerTranslateYAnim = useRef(new Animated.Value(0)).current;
  const uploadIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const insets = useSafeAreaInsets();
  const SCROLL_THRESHOLD = 5;
  StatusBar.setBarStyle("light-content");

  const scrollDirection = useRef<"up" | "down" | null>(null);

  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      const diff = value - prevScrollY.current;

      if (Math.abs(diff) > SCROLL_THRESHOLD) {
        if (diff > 0 && value > 50) {
          if (scrollDirection.current !== "down") {
            scrollDirection.current = "down";
            Animated.timing(headerTranslateYAnim, {
              toValue: -(topBarHeight + insets.top),
              duration: 300,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }).start();
          }
        } else if (diff < 0) {
          if (scrollDirection.current !== "up") {
            scrollDirection.current = "up";
            Animated.timing(headerTranslateYAnim, {
              toValue: 0,
              duration: 300,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }).start();
          }
        }
      }

      prevScrollY.current = value;
    });

    return () => {
      scrollY.removeListener(listenerId);
    };
  }, [scrollY, topBarHeight, insets.top, headerTranslateYAnim]);

  const onFeedScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  // Optimized upload simulation with cleanup
  // const simulateUpload = () => {
  //   // Clear any existing interval
  //   if (uploadIntervalRef.current) {
  //     clearInterval(uploadIntervalRef.current);
  //   }

  //   setUploadVisible(true);
  //   setUploadProgress(0);

  //   const totalMs = 5000; // Changed to 5 seconds for reasonable demo
  //   const start = Date.now();

  //   uploadIntervalRef.current = setInterval(() => {
  //     const p = Math.min((Date.now() - start) / totalMs, 1);
  //     setUploadProgress(p);

  //     if (p >= 1) {
  //       if (uploadIntervalRef.current) {
  //         clearInterval(uploadIntervalRef.current);
  //         uploadIntervalRef.current = null;
  //       }
  //       setTimeout(() => setUploadVisible(false), 800);
  //     }
  //   }, 100);
  // };

  useEffect(() => {
    return () => {
      if (uploadIntervalRef.current) {
        clearInterval(uploadIntervalRef.current);
      }
    };
  }, []);

  const StoriesHeader = useCallback(() => {
    return (
      <View style={{ paddingVertical: 8 }}>
        <FlatList
          data={[{ id: "add" }, ...STORIES]}
          onViewableItemsChanged={({ viewableItems }) => {
            const visibleItems = viewableItems.map((vi) => vi.item).slice(0, 5);
            setVisibleIds(visibleItems);
          }}
          viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
          horizontal
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          snapToInterval={88}
          decelerationRate="fast"
          contentContainerStyle={{
            gap: 10,
            paddingLeft: 10,
            paddingRight: 10,
          }}
          renderItem={({ item, index }) => {
            if (item.id === "add") {
              return (
                <View className="relative">
                  <TouchableOpacity
                    className="w-16 h-16 justify-center items-center rounded-full overflow-hidden bg-[#F3F3F326]/[15%]"
                    onPress={() => setCreateStory(true)}
                  >
                    <BlurView
                      intensity={25}
                      tint="dark"
                      className="w-16 h-16 rounded-full items-center justify-center"
                    >
                      <Ionicons name="add" size={28} color="white" />
                    </BlurView>
                  </TouchableOpacity>
                  <Text className="text-white/80 text-xs text-center mt-1">
                    Add Story
                  </Text>
                </View>
              );
            }

            return (
              <View className="relative">
                <TouchableOpacity
                  className="w-16 h-16 justify-center items-center rounded-full overflow-hidden border-[1.5px] border-[#FFFFFF]/70"
                  onPress={() => setViewStory(true)}
                >
                  <Image
                    source={item}
                    className="w-[85%] h-[85%] rounded-full"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    );
  }, [STORIES]);

  return (
    <View className="flex-1 bg-[#121212]">
      <View className="flex-1">
        {/* Main Header */}
        <Animated.View
          onLayout={(e) => setTopBarHeight(e.nativeEvent.layout.height)}
          style={{
            position: "absolute",
            top: insets.top,
            left: 0,
            right: 0,
            zIndex: 100,
            transform: [{ translateY: headerTranslateYAnim }],
            elevation: 12,
          }}
        >
          <View className="bg-[#121212]/[80%] w-[95%] mx-auto overflow-hidden rounded-full">
            <View style={{ zIndex: 100 }} className="relative">
              <BlurView
                intensity={50}
                style={[StyleSheet.absoluteFill, { borderRadius: 28 }]}
                experimentalBlurMethod="dimezisBlurView"
                tint="dark"
              />

              {/* Header Content */}
              <View className="w-full flex-row px-4 py-2 items-center justify-between">
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="items-center justify-center z-20"
                >
                  <Image
                    source={images.logo_white}
                    className="w-28 h-14"
                    resizeMode="contain"
                    style={{ opacity: 0.9 }}
                  />
                </TouchableOpacity>

                <View className="flex-row space-x-3 gap-2">
                  <TouchableOpacity
                    className="flex-row items-center px-4 h-12 bg-[#3636365E]/[37%] overflow-hidden border-[#736F7366]/[40%] border rounded-full drop-shadow-lg shadow-sm z-20"
                    activeOpacity={0.7}
                    style={{ minWidth: 80, maxWidth: 160 }}
                    onPress={() => setOpenSwitcher(true)}
                  >
                    <BlurView
                      intensity={10}
                      style={[StyleSheet.absoluteFill, { borderRadius: 28 }]}
                    />
                    <Text
                      className="text-white font-medium text-[16px] flex-1"
                      numberOfLines={1}
                    >
                      {selectedCommunity}
                    </Text>
                    <Feather
                      name="server"
                      size={16}
                      color="#fff"
                      style={{ opacity: 0.7, marginLeft: 4 }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => console.log("bell pressed")}
                    activeOpacity={0.7}
                    className="h-12 w-12 overflow-hidden border-[#736F7366]/[40%] border rounded-full bg-[#3636365E]/[37%] drop-shadow-lg shadow-sm items-center justify-center z-20"
                  >
                    <BlurView
                      intensity={10}
                      style={[StyleSheet.absoluteFill, { borderRadius: 28 }]}
                    />
                    <Feather
                      name="bell"
                      size={20}
                      color="#fff"
                      style={{ opacity: 0.9 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Feed Content */}
        <View className="flex-1">
          <AllFeeds
            posts={posts}
            setUploadVisible={setUploadVisible}
            // simulateUpload={simulateUpload}
            externalScrollEnabled={feedScrollEnabled}
            setExternalScrollEnabled={setFeedScrollEnabled}
            onShowLikePuff={() => setShowLikePuff(true)}
            onShowDislikePuff={() => setShowDislikePuff(true)}
            onScroll={onFeedScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingTop: topBarHeight + insets.top }}
            ListHeaderComponent={<StoriesHeader />}
          />
        </View>
      </View>

      {/* Upload Toast */}
      {uploadVisible && (
        <UploadToast
          visible={uploadVisible}
          progress={uploadProgress}
          title="Uploading comment"
          avatars={[
            "https://randomuser.me/api/portraits/women/44.jpg",
            "https://randomuser.me/api/portraits/men/32.jpg",
          ]}
          onCancel={() => {
            if (uploadIntervalRef.current) {
              clearInterval(uploadIntervalRef.current);
              uploadIntervalRef.current = null;
            }
            setUploadVisible(false);
          }}
        />
      )}

      {/* Puff Animations */}
      <PuffySmoke
        type="like"
        visible={showLikePuff}
        x={width - 140}
        y={height * 0.45}
        onComplete={() => setShowLikePuff(false)}
      />
      <PuffySmoke
        type="dislike"
        visible={showDislikePuff}
        x={20}
        y={height * 0.45}
        onComplete={() => setShowDislikePuff(false)}
      />

      {openSwitcher && (
        <>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setOpenSwitcher(false)}
            style={[StyleSheet.absoluteFillObject, { zIndex: 9998 }]}
          />

          <View
            style={[StyleSheet.absoluteFillObject, { zIndex: 9999 }]}
            pointerEvents="box-none"
          >
            <CommunitySwitcher onClose={() => setOpenSwitcher(false)} />
          </View>
        </>
      )}

      {viewStory && (
        <StoryModal
          visible={viewStory}
          onClose={() => setViewStory(false)}
          stories={DUMMY_STORIES}
          initialUserIndex={1}
        />
      )}
      {createStory && (
        <StoryCreator
          visible={createStory}
          onClose={() => setCreateStory(false)}
        />
      )}
    </View>
  );
};

export default Home;
