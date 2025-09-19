import AllFeeds from "@/components/feed/AllFeeds";
import UploadToast from "@/components/feed/UploadToast";
import { dummyAllPosts } from "@/constants/data";
import { images } from "@/constants/images";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
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
  RefreshControl,
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

const { width } = Dimensions.get("window");

const Home: React.FC = () => {
  const [posts] = useState(dummyAllPosts);
  const [feedScrollEnabled, setFeedScrollEnabled] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState("All");

  const scrollY = useRef(new Animated.Value(0)).current;

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

  // Add debug logging to see when scroll state changes
  useEffect(() => {
    console.log("HOME: feedScrollEnabled changed to:", feedScrollEnabled);
  }, [feedScrollEnabled]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
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

  const circleScale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
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
      // start infinite spin
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
      // stop & reset
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

  const headerOpacity = refreshing
    ? 1 // stay visible while refreshing
    : progress;
  const [canTrigger, setCanTrigger] = useState(false);

  const { triggerUpload } = useLocalSearchParams();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Simulate a 5s upload
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

  const [hasStartedScrolling, setHasStartedScrolling] = useState(false);
  const [hasScrolled70, setHasScrolled70] = useState(false);
  // Add these animation interpolations after your existing interpolations
  const hasVibratedRef = useRef(false);
  // Stories animations based on scroll (0 to 150)
  const storiesScale = scrollY.interpolate({
    inputRange: [0, 130],
    outputRange: [1, 0.5], // Scale from 100% to 30%
    extrapolate: "clamp",
  });

  const storiesTranslateX = scrollY.interpolate({
    inputRange: [0, 130],
    outputRange: [0, 220], // Move right by 30px
    extrapolate: "clamp",
  });

  const storiesMaxHeight = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [140, 60], // Height from 400px to 200px
    extrapolate: "clamp",
  });

  const opacity = scrollY.interpolate({
    inputRange: [0, 2], // scroll range
    outputRange: [1, 0], // 👈 numbers (1 = visible, 0 = hidden)
    extrapolate: "clamp",
  });
  const AbsoluteOpacity = scrollY.interpolate({
    inputRange: [0, 2], // scroll range
    outputRange: [0, 1], // 👈 numbers (1 = visible, 0 = hidden)
    extrapolate: "clamp",
  });

  const storiesTranslateY = scrollY.interpolate({
    inputRange: [0, 130],
    outputRange: [0, -150], // Move up by 20px
    extrapolate: "clamp",
  });

  // State for stories count
  const [visibleStoriesCount, setVisibleStoriesCount] = useState(
    stories.length
  );

  // Update the handleScroll function to include stories slicing logic
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.y;

    // Console log the scroll value from 0 to 150
    if (scrollOffset >= 0 && scrollOffset <= 150) {
      console.log(`Scroll value: ${scrollOffset}`);
    }

    // // Slice stories to 6 when scrolling starts
    // if (scrollOffset > 0 && visibleStoriesCount !== 5) {
    //   setVisibleStoriesCount(5);
    // }

    // Reset to full stories when back to top
    if (scrollOffset === 0 && visibleStoriesCount !== stories.length) {
      setVisibleStoriesCount(stories.length);
    }
    // Vibrate when stories start collapsing
    if (scrollOffset >= 30 && !hasVibratedRef.current) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      hasVibratedRef.current = true;
    }

    // Reset vibration flag when back to top
    if (scrollOffset === 0) {
      hasVibratedRef.current = false;
      if (visibleStoriesCount !== stories.length) {
        setVisibleStoriesCount(stories.length);
      }
    }
  };

  const [visibleIds, setVisibleIds] = useState<any[]>([]);

  // const viewabilityConfig = useRef({
  //   itemVisiblePercentThreshold: 50, // item is "visible" if >=50% of it is on screen
  // });

  // const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
  //   const ids = viewableItems.map((vi: any) => vi.item.id);
  //   setVisibleIds(ids);
  //   console.log("Currently visible stories:", ids);
  // });

  const scrollRef = useRef<any>(null);
  const [flatListScrollEnabled, setFlatListScrollEnabled] = useState(true);

  return (
    <SafeAreaView className="flex-1  bg-[#121212]">
      <Animated.View className="flex-1 ">
        {/* Custom pull-to-refresh header */}
        {/* Custom pull-to-refresh header */}
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            // top: insets.top, // let the gradient fill under the status bar
            left: 0,
            top: 0,
            right: 0,
            alignItems: "center",
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
          }}
        >
          {/* Rounded gradient cap */}
          <View
            style={{
              width: "100%",
              height: insets.top * 7, // adjust 100–140 to taste
            }}
          >
            <LinearGradient
              // teal → deep blue (center) → teal
              colors={["#27D3C0", "#2E6BFF", "#27D3C0"]}
              locations={[0, 0.5, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }} // horizontal sweep
              style={{ flex: 1, opacity: 0.95 }}
            />
          </View>

          {/* Label + spinning refresh icon */}
          <View
            style={{
              position: "absolute",
              top: 40, // below the notch
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
            className=""
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
        <Animated.ScrollView
          stickyHeaderIndices={[0]} // 👈 make the first child sticky
          className="flex-1"
          // nestedScrollEnabled={true}
          scrollEnabled={feedScrollEnabled}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            // top: insets.top + 0,
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
              // hide default spinner (we overlay our own)
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
                const pulled = Math.max(0, -y); // positive while pulling down
                setCanTrigger(pulled > THRESHOLD && !refreshing);
                handleScroll(e);
                // 🔑 Toggle FlatList scroll
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

            if (y > 0 && y < 30) {
              scrollRef.current?.scrollTo({ y: 0, animated: true });
            } else if (y >= 30 && y < 100) {
              scrollRef.current?.scrollTo({ y: 100, animated: true });
            }
          }}
          scrollEventThrottle={16}
        >
          <Animated.View
            style={{
              zIndex: 100,
              // height: storiesMaxHeight, // Add this line
            }}
            className="  bg-[#121212] "
          >
            <Animated.View
              style={{
                zIndex: 100,
                maxHeight: storiesMaxHeight, // Add this line
              }}
              className=" relative    "
            >
              <View className="w-full mb-4 flex-row  px-4  items-center justify-between">
                {/* Logo */}

                <TouchableOpacity
                  activeOpacity={0.7}
                  className="items-center  justify-center z-20"
                >
                  <Image
                    source={images.logo_white}
                    className="w-28 h-14"
                    resizeMode="contain"
                    style={{ opacity: 0.9 }}
                  />
                </TouchableOpacity>

                <View className="flex-row space-x-3  gap-2">
                  <View className="relative">
                    <TouchableOpacity
                      // onPress={() =>
                      //   router.replace(RouterConstantUtil.tabs.communities as any)
                      // }
                      // onPress={() => setDropdownVisible(!dropdownVisible)}
                      className="flex-row items-center px-4 h-12 bg-[#3636365E]/[37%] overflow-hidden border-[#736F7366]/[40%] border rounded-full drop-shadow-lg shadow-sm  z-20"
                      activeOpacity={0.7}
                      style={{ minWidth: 80, maxWidth: 160 }}
                    >
                      <BlurView
                        intensity={10}
                        style={[StyleSheet.absoluteFill, { borderRadius: 28 }]}
                        // experimentalBlurMethod="dimezisBlurView"
                      />

                      <Text
                        className="text-white  font-medium text-[16px] flex-1"
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
                          style={[
                            StyleSheet.absoluteFill,
                            { borderRadius: 16 },
                          ]}
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

                  {/* Notification Bell */}
                  <TouchableOpacity
                    onPress={() => console.log("bell pressed")}
                    activeOpacity={0.7}
                    className="h-12 w-12 overflow-hidden border-[#736F7366]/[40%] border rounded-full bg-[#3636365E]/[37%] drop-shadow-lg shadow-sm items-center justify-center z-20"
                  >
                    <BlurView
                      intensity={10}
                      style={[StyleSheet.absoluteFill, { borderRadius: 28 }]}
                      // experimentalBlurMethod="dimezisBlurView"
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
              <Animated.View
                style={{
                  transformOrigin: "left center", // Scale from left side
                  transform: [
                    { scale: storiesScale },
                    { translateX: storiesTranslateX },
                    // { translateY: storiesTranslateY },
                  ],
                  opacity: AbsoluteOpacity,
                }}
                className=" bottom-0  absolute"
              >
                <Animated.View className=" ">
                  <FlatList
                    data={visibleIds}
                    contentContainerClassName=""
                    scrollEnabled={flatListScrollEnabled} // 👈 controlled here
                    viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
                    horizontal
                    keyExtractor={(_, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={80 + 8} // 👈 item width + gap
                    decelerationRate="fast" // 👈 makes snapping quick
                    contentContainerStyle={{ gap: 10, paddingLeft: 10 }}
                    renderItem={({ item, index }) => {
                      // const isVisible = visibleIds.includes(index.toString());
                      // console.log(visibleIds);

                      // if (!isVisible) {
                      //   return null; // 👈 don't render if not visible
                      // }
                      return (
                        <Animated.View
                          style={{
                            transform: [
                              {
                                translateX:
                                  index > 0
                                    ? scrollY.interpolate({
                                        inputRange: [0, 100],
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
                      );
                    }}
                  />
                </Animated.View>
              </Animated.View>
              <Animated.View
                style={{
                  opacity: opacity,
                }}
                className=""
              >
                <FlatList
                  data={stories}
                  contentContainerClassName=""
                  onViewableItemsChanged={({ viewableItems }) => {
                    const visibleItems = viewableItems
                      .map((vi) => vi.item) // 👈 store the actual story (image) not index
                      .slice(0, 4); // limit to 4

                    setVisibleIds(visibleItems);
                    console.log("Currently visible stories:", visibleItems);
                  }}
                  viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
                  horizontal
                  keyExtractor={(_, index) => index.toString()}
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={80 + 8} // 👈 item width + gap
                  decelerationRate="fast" // 👈 makes snapping quick
                  contentContainerStyle={{ gap: 10, paddingLeft: 10 }}
                  renderItem={({ item, index }) => {
                    return (
                      <Animated.View
                        // style={{
                        //   transform: [
                        //     {
                        //       translateX:
                        //         index > 0
                        //           ? scrollY.interpolate({
                        //               inputRange: [0, 100],
                        //               outputRange: [0, -30 * index],
                        //               extrapolate: "clamp",
                        //             })
                        //           : 0,
                        //     },
                        //   ],
                        // }}
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
                    );
                  }}
                />
              </Animated.View>
            </Animated.View>
          </Animated.View>

          <View className="flex-row   flex-1 justify-center items-center gap-3">
            <AllFeeds
              posts={posts}
              addPost={() => setShowUpload(true)}
              setUploadVisible={setUploadVisible}
              simulateUpload={simulateUpload}
              externalScrollEnabled={feedScrollEnabled}
              setExternalScrollEnabled={setFeedScrollEnabled} // This is the key prop
            />
          </View>
        </Animated.ScrollView>

        {dropdownVisible && (
          <TouchableOpacity
            className="absolute inset-0 z-40"
            activeOpacity={1}
            onPress={() => setDropdownVisible(false)}
          />
        )}
      </Animated.View>

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
          onCancel={() => setUploadVisible(false)}
        />
      )}
    </SafeAreaView>
  );
};

export default Home;
