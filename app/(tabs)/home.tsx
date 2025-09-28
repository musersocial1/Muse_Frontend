import AllFeeds from "@/components/feed/AllFeeds";
import UploadToast from "@/components/feed/UploadToast";
import PuffySmoke from "@/components/ui/PuffySmoke";
import { dummyAllPosts } from "@/constants/data";
import { images } from "@/constants/images";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";

import {
  Animated,
  Dimensions,
  Easing,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const Home: React.FC = () => {
  const [posts] = useState(dummyAllPosts);
  const [feedScrollEnabled, setFeedScrollEnabled] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState("All");

  const scrollY = useRef(new Animated.Value(0)).current;

  // Track scroll start position for dynamic interpolation
  const scrollStartPosition = useRef(0);
  const lastScrollY = useRef(0);
  const isScrollingDown = useRef(false);

  // Communities data for dropdown - "All" is default
  const communities = [
    { id: 0, name: "All", icon: "globe" },
    { id: 1, name: "General", icon: "users" },
    { id: 2, name: "Music", icon: "music" },
    { id: 3, name: "Sports", icon: "activity" },
    { id: 4, name: "Tech", icon: "cpu" },
    { id: 5, name: "Art", icon: "image" },
  ];

  const stories = [
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

  useEffect(() => {
    console.log("HOME: feedScrollEnabled changed to:", feedScrollEnabled);
  }, [feedScrollEnabled]);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleCommunitySelect = (community: (typeof communities)[0]) => {
    setSelectedCommunity(community.name);
    setDropdownVisible(false);
    console.log(`Selected: ${community.name}`);
  };

  const selectedCommunityData = communities.find(
    (c) => c.name === selectedCommunity
  );

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const THRESHOLD = 90;

  const pull = scrollY.interpolate({
    inputRange: [-150, 0],
    outputRange: [150, 0],
    extrapolate: "clamp",
  });

  const progress = pull.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
  });

  const headerTranslateY = pull.interpolate({
    inputRange: [0, 150],
    outputRange: [-30, 0],
  });

  // spinning refresh icon
  const spin = useRef(new Animated.Value(0)).current;
  const spinLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (refreshing) {
      spinLoopRef.current = Animated.loop(
        Animated.timing(spin, {
          toValue: 1,
          duration: 900,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      spinLoopRef.current.start();
    } else {
      if (spinLoopRef.current) {
        spinLoopRef.current.stop();
        spinLoopRef.current = null;
      }
      spin.setValue(0);
    }
  }, [refreshing]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const headerOpacity = refreshing ? 1 : progress;
  const [canTrigger, setCanTrigger] = useState(false);

  const { triggerUpload } = useLocalSearchParams();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const simulateUpload = () => {
    setUploadVisible(true);
    setUploadProgress(0);

    const totalMs = 50000000;
    const start = Date.now();
    const interval = setInterval(() => {
      const p = Math.min((Date.now() - start) / totalMs, 1);
      setUploadProgress(p);

      if (p >= 1) {
        clearInterval(interval);
        setTimeout(() => setUploadVisible(false), 800);
      }
    }, 100);
  };

  // Dynamic stories animations based on scroll start position + 60px range
  const storiesScale = scrollY.interpolate({
    inputRange: [scrollStartPosition.current, scrollStartPosition.current + 60],
    outputRange: [1, 0.5],
    extrapolate: "clamp",
  });

  const storiesTranslateX = scrollY.interpolate({
    inputRange: [scrollStartPosition.current, scrollStartPosition.current + 60],
    outputRange: [0, 220],
    extrapolate: "clamp",
  });

  const storiesMaxHeight = scrollY.interpolate({
    inputRange: [scrollStartPosition.current, scrollStartPosition.current + 60],
    outputRange: [140, 60],
    extrapolate: "clamp",
  });

  // Opacity animations - dynamic range
  const opacity = scrollY.interpolate({
    inputRange: [
      scrollStartPosition.current,
      scrollStartPosition.current + 2,
      scrollStartPosition.current + 60,
    ],
    outputRange: [1, 0, 0],
    extrapolate: "clamp",
  });

  const AbsoluteOpacity = scrollY.interpolate({
    inputRange: [
      scrollStartPosition.current,
      scrollStartPosition.current + 2,
      scrollStartPosition.current + 60,
    ],
    outputRange: [0, 1, 1],
    extrapolate: "clamp",
  });

  const [visibleStoriesCount, setVisibleStoriesCount] = useState(
    stories.length
  );

  // Function to handle clicking on compact stories - just reset to 0
  const handleStoriesClick = () => {
    // Just reset scroll position to 0 (no animation scaling)
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    // Reset tracking variables
    scrollStartPosition.current = 0;
    lastScrollY.current = 0;
    isScrollingDown.current = false;
  };

  // Enhanced scroll handler with dynamic start position tracking
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;

    // Track scroll direction
    if (currentScrollY > lastScrollY.current) {
      // Scrolling down - update start position if we weren't scrolling down before
      if (!isScrollingDown.current) {
        scrollStartPosition.current = currentScrollY;
        isScrollingDown.current = true;
      }
    } else if (currentScrollY < lastScrollY.current) {
      isScrollingDown.current = false;
    }

    // Reset everything when back to top
    if (currentScrollY === 0) {
      scrollStartPosition.current = 0;
      isScrollingDown.current = false;
      if (visibleStoriesCount !== stories.length) {
        setVisibleStoriesCount(stories.length);
      }
    }

    lastScrollY.current = currentScrollY;
  };

  const [visibleIds, setVisibleIds] = useState<any[]>([]);
  const scrollRef = useRef<any>(null);
  const [flatListScrollEnabled, setFlatListScrollEnabled] = useState(true);
  // Add these state variables near the top of your Home component
  const [showLikePuff, setShowLikePuff] = useState(false);
  const [showDislikePuff, setShowDislikePuff] = useState(false);
  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <Animated.View className="flex-1">
        {/* Custom pull-to-refresh header */}
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            alignItems: "center",
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
          }}
        >
          <View
            style={{
              width: "100%",
              height: insets.top * 7,
            }}
          >
            <LinearGradient
              colors={["#27D3C0", "#2E6BFF", "#27D3C0"]}
              locations={[0, 0.5, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1, opacity: 0.95 }}
            />
          </View>

          <View
            style={{
              position: "absolute",
              top: 40,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text className="text-white font-semibold">
              {refreshing
                ? "Refreshing…"
                : canTrigger
                ? "Release to refresh"
                : "Refresh"}
            </Text>

            <Animated.View style={{ transform: [{ rotate }] }}>
              <Feather name="rotate-cw" size={16} color="#fff" />
            </Animated.View>
          </View>
        </Animated.View>

        {/* Scrollable Content */}
        {/* <Animated.ScrollView
          // stickyHeaderIndices={[0]}
          // className="flex-1"
          scrollEnabled={feedScrollEnabled}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            zIndex: 99,
            backgroundColor: "#121212",
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
            overflow: "hidden",
          }}
          ref={scrollRef}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="transparent"
              colors={["transparent"]}
              progressBackgroundColor="transparent"
              progressViewOffset={100}
            />
          }
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
              useNativeDriver: false,
              listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
                const y = e.nativeEvent.contentOffset.y;
                const pulled = Math.max(0, -y);
                setCanTrigger(pulled > THRESHOLD && !refreshing);
                handleScroll(e);

                if (y > 30 && flatListScrollEnabled) {
                  setFlatListScrollEnabled(false);
                } else if (y <= 0 && !flatListScrollEnabled) {
                  setFlatListScrollEnabled(true);
                }
              },
            }
          )}
          onScrollEndDrag={(e) => {
            const y = e.nativeEvent.contentOffset.y;

            if (-y > THRESHOLD && !refreshing) {
              onRefresh();
            }
          }}
          scrollEventThrottle={16}
        ></Animated.ScrollView> */}
        <Animated.View style={{ zIndex: 100 }} className="bg-[#121212] pb-2">
          <Animated.View
            style={{
              zIndex: 100,
              maxHeight: storiesMaxHeight,
            }}
            className="relative"
          >
            {/* Header with Logo and Navigation */}
            <View className="w-full mb-4 flex-row px-4 items-center justify-between">
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
                <View className="relative">
                  <TouchableOpacity
                    className="flex-row items-center px-4 h-12 bg-[#3636365E]/[37%] overflow-hidden border-[#736F7366]/[40%] border rounded-full drop-shadow-lg shadow-sm z-20"
                    activeOpacity={0.7}
                    style={{ minWidth: 80, maxWidth: 160 }}
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

                  {dropdownVisible && (
                    <Animated.View className="absolute top-16 right-0 bg-[#1a1a1a]/95 rounded-2xl border border-[#736F7366]/[40%] shadow-2xl z-50 min-w-[200px]">
                      <BlurView
                        intensity={20}
                        style={[StyleSheet.absoluteFill, { borderRadius: 16 }]}
                        experimentalBlurMethod="dimezisBlurView"
                      />
                      <View className="p-2">
                        <Text className="text-white/60 text-xs font-medium px-3 py-2 uppercase tracking-wider">
                          Communities
                        </Text>
                        {communities.map((community) => (
                          <TouchableOpacity
                            key={community.id}
                            onPress={() => handleCommunitySelect(community)}
                            className={`flex-row items-center px-3 py-3 rounded-xl ${
                              selectedCommunity === community.name
                                ? "bg-white/20"
                                : "active:bg-white/10"
                            }`}
                            activeOpacity={0.7}
                          >
                            <View
                              className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                                selectedCommunity === community.name
                                  ? "bg-white/20"
                                  : "bg-white/10"
                              }`}
                            >
                              <Feather
                                name={community.icon as any}
                                size={14}
                                color="#fff"
                              />
                            </View>
                            <Text
                              className={`font-medium flex-1 ${
                                selectedCommunity === community.name
                                  ? "text-white"
                                  : "text-white/80"
                              }`}
                            >
                              {community.name}
                            </Text>
                            {selectedCommunity === community.name && (
                              <Feather name="check" size={16} color="#fff" />
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    </Animated.View>
                  )}
                </View>

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

            {/* Compact Stories (Absolute positioned) - with click handler */}
            <TouchableOpacity
              activeOpacity={1}
              onPress={handleStoriesClick}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
              }}
            >
              <Animated.View
                style={{
                  transformOrigin: "left center",
                  transform: [
                    { scale: storiesScale },
                    { translateX: storiesTranslateX },
                  ],
                  opacity: AbsoluteOpacity,
                }}
              >
                <FlatList
                  data={visibleIds}
                  scrollEnabled={flatListScrollEnabled}
                  viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
                  horizontal
                  keyExtractor={(_, index) => index.toString()}
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={88}
                  decelerationRate="fast"
                  contentContainerStyle={{ gap: 10, paddingLeft: 10 }}
                  renderItem={({ item, index }) => (
                    <Animated.View
                      style={{
                        transform: [
                          {
                            translateX:
                              index > 0
                                ? scrollY.interpolate({
                                    inputRange: [
                                      scrollStartPosition.current,
                                      scrollStartPosition.current + 60,
                                    ],
                                    outputRange: [0, -30 * index],
                                    extrapolate: "clamp",
                                  })
                                : 0,
                          },
                        ],
                      }}
                      className="relative"
                    >
                      <View className="w-20 h-20 rounded-full overflow-hidden border-[9px] border-[#B3B3B3]">
                        <Image
                          source={item}
                          className="w-full h-full rounded-full"
                          resizeMode="cover"
                        />
                      </View>
                    </Animated.View>
                  )}
                />
              </Animated.View>
            </TouchableOpacity>

            {/* Regular Stories */}
            <Animated.View style={{ opacity: opacity }}>
              <FlatList
                data={stories}
                onViewableItemsChanged={({ viewableItems }) => {
                  const visibleItems = viewableItems
                    .map((vi) => vi.item)
                    .slice(0, 5);
                  setVisibleIds(visibleItems);
                }}
                viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
                horizontal
                keyExtractor={(_, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                snapToInterval={88}
                decelerationRate="fast"
                contentContainerStyle={{ gap: 10, paddingLeft: 10 }}
                renderItem={({ item, index }) => (
                  <Animated.View className="relative">
                    <View className="w-20 h-20 rounded-full overflow-hidden border-[9px] border-[#B3B3B3]">
                      <Image
                        source={item}
                        className="w-full h-full rounded-full"
                        resizeMode="cover"
                      />
                    </View>
                  </Animated.View>
                )}
              />
            </Animated.View>
          </Animated.View>
        </Animated.View>
        <View className="flex-row flex-1 justify-center items-center gap-3">
          <AllFeeds
            posts={posts}
            addPost={() => setShowUpload(true)}
            setUploadVisible={setUploadVisible}
            simulateUpload={simulateUpload}
            externalScrollEnabled={feedScrollEnabled}
            setExternalScrollEnabled={setFeedScrollEnabled}
            onShowLikePuff={() => setShowDislikePuff(true)}
            onShowDislikePuff={() => setShowLikePuff(true)}
          />
        </View>

        {dropdownVisible && (
          <TouchableOpacity
            className="absolute inset-0 z-40"
            activeOpacity={1}
            onPress={() => setDropdownVisible(false)}
          />
        )}
      </Animated.View>

      {uploadVisible && (
        <UploadToast
          visible={uploadVisible}
          progress={uploadProgress}
          title="Uploading comment"
          avatars={[
            "https://randomuser.me/api/portraits/women/44.jpg",
            "https://randomuser.me/api/portraits/men/32.jpg",
          ]}
          onCancel={() => setUploadVisible(false)}
        />
      )}

      {/* Fixed Position Puff Animations */}
      <PuffySmoke
        type="like"
        visible={showLikePuff}
        x={width - 140} // Right side for like
        y={height * 0.45}
        onComplete={() => setShowLikePuff(false)}
      />

      <PuffySmoke
        type="dislike"
        visible={showDislikePuff}
        x={20} // Left side for dislike
        y={height * 0.45}
        onComplete={() => setShowDislikePuff(false)}
      />
    </SafeAreaView>
  );
};

export default Home;
