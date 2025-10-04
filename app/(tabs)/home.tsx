import AllFeeds from "@/components/feed/AllFeeds";
import UploadToast from "@/components/feed/UploadToast";
import CommunitySwitcher from "@/components/modals/CommunitySwitcher";
import PuffySmoke from "@/components/ui/PuffySmoke";
import { dummyAllPosts } from "@/constants/data";
import { images } from "@/constants/images";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useLocalSearchParams } from "expo-router";
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
  Easing,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  const [openSwitcher, setOpenSwitcher] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const prevScrollY = useRef(0);
  const scrollDirection = useRef<"up" | "down">("down");

  const stories = useMemo(
    () => [
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
    ],
    []
  );

  const insets = useSafeAreaInsets();

  // Pull-to-refresh helpers
  const pull = scrollY.interpolate({
    inputRange: [-150, 0],
    outputRange: [150, 0],
    extrapolate: "clamp",
  });
  const progress = pull.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
  });

  const [topBarHeight, setTopBarHeight] = useState(0);
  const headerTranslateYAnim = useRef(new Animated.Value(0)).current;

  const SCROLL_THRESHOLD = 5; // Minimum scroll to trigger hide/show

  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      const diff = value - prevScrollY.current;

      // Determine scroll direction with threshold
      if (Math.abs(diff) > SCROLL_THRESHOLD) {
        if (diff > 0 && value > 0) {
          // Scrolling down - hide header (as soon as we scroll down)
          if (scrollDirection.current !== "down") {
            scrollDirection.current = "down";
            Animated.timing(headerTranslateYAnim, {
              toValue: -(topBarHeight + insets.top),
              duration: 250,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }).start();
          }
        } else if (diff < 0) {
          // Scrolling up - show header
          if (scrollDirection.current !== "up") {
            scrollDirection.current = "up";
            Animated.timing(headerTranslateYAnim, {
              toValue: 0,
              duration: 250,
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
  }, [insets.top, topBarHeight, headerTranslateYAnim, scrollY]);

  const onFeedScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
      }),
    [scrollY]
  );

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
  }, [refreshing, spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const headerOpacity = refreshing ? 1 : progress;

  const { triggerUpload } = useLocalSearchParams();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const simulateUpload = () => {
    setUploadVisible(true);
    setUploadProgress(0);

    const totalMs = 50000000; // NOTE: Very long (13+ hours).
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

  const [visibleIds, setVisibleIds] = useState<any[]>([]);
  const [showLikePuff, setShowLikePuff] = useState(false);
  const [showDislikePuff, setShowDislikePuff] = useState(false);

  const StoriesHeader = useCallback(() => {
    return (
      <View style={{ paddingVertical: 8 }}>
        <FlatList
          data={stories}
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
          contentContainerStyle={{ gap: 10, paddingLeft: 10, paddingRight: 10 }}
          renderItem={({ item }) => (
            <View className="relative">
              <View className="w-16 h-16 rounded-full overflow-hidden border-[4px] border-[#B3B3B3]">
                <Image
                  source={item}
                  className="w-full h-full rounded-full"
                  resizeMode="cover"
                />
              </View>
            </View>
          )}
        />
      </View>
    );
  }, [stories]);

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <Animated.View className="flex-1">
        {/* Main Header  */}
        <Animated.View
          onLayout={(e) => setTopBarHeight(e.nativeEvent.layout.height)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            transform: [{ translateY: headerTranslateYAnim }],
            elevation: 12,
            backgroundColor: "transparent",
          }}
        >
          <Animated.View className="bg-[#121212]/[80%] rounded-full mx-5">
            <Animated.View
              style={{
                zIndex: 100,
              }}
              className="relative"
            >
              <BlurView
                intensity={5}
                style={[StyleSheet.absoluteFill, { borderRadius: 28 }]}
                experimentalBlurMethod="dimezisBlurView"
                tint="dark"
              />
              {/* Header with Logo and Navigation */}
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
                  <View className="relative">
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
            </Animated.View>
          </Animated.View>
        </Animated.View>

        {/* Feed Content */}
        <View className="flex-1 ">
          <AllFeeds
            posts={posts}
            addPost={() => setShowUpload(true)}
            setUploadVisible={setUploadVisible}
            simulateUpload={simulateUpload}
            externalScrollEnabled={feedScrollEnabled}
            setExternalScrollEnabled={setFeedScrollEnabled}
            onShowLikePuff={() => setShowDislikePuff(true)}
            onShowDislikePuff={() => setShowLikePuff(true)}
            onScroll={onFeedScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingTop: topBarHeight }}
            ListHeaderComponent={<StoriesHeader />}
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

          <Animated.View
            style={[StyleSheet.absoluteFillObject, { zIndex: 9999 }]}
            pointerEvents="box-none"
          >
            <CommunitySwitcher
              onClose={() => {
                setOpenSwitcher(false);
                setDropdownVisible(false);
              }}
            />
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Home;
