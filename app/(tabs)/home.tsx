import AllFeeds from "@/components/feed/AllFeeds";
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
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const Home: React.FC = () => {
  const [posts] = useState(dummyAllPosts);
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

  useEffect(() => {
    if (true) {
      simulateUpload();
    }
  }, [true]);

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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            // top: insets.top + 0,
            zIndex: 99,
            backgroundColor: "#121212",
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
            overflow: "hidden",
          }}
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
              },
            }
          )}
          onScrollEndDrag={(e) => {
            const y = e.nativeEvent.contentOffset.y;
            if (-y > THRESHOLD && !refreshing) {
              onRefresh(); // uses your existing setRefreshing(true) logic
            }
          }}
          scrollEventThrottle={16}
        >
          <View
            style={{
              zIndex: 100,
            }}
            className=" py-4  bg-[#121212] "
          >
            <View className="flex-row   justify-between items-center px-6">
              {/* Logo */}
              <TouchableOpacity
                activeOpacity={0.7}
                className="items-center  justify-center z-20"
              >
                <Image
                  source={images.logo_white}
                  className="w-28 h-full"
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
                        style={[StyleSheet.absoluteFill, { borderRadius: 16 }]}
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
          <View className="flex-row   flex-1 justify-center items-center gap-3">
            <AllFeeds posts={posts} addPost={() => setShowUpload(true)} />
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
      {/* {uploadVisible && (
        <UploadToast
          visible={uploadVisible}
          progress={uploadProgress}
          title="Uploading your posts"
          avatars={[
            "https://randomuser.me/api/portraits/women/44.jpg",
            "https://randomuser.me/api/portraits/men/32.jpg",
          ]}
          onCancel={() => setUploadVisible(false)}
        />
      )} */}
    </SafeAreaView>
  );
};

export default Home;
