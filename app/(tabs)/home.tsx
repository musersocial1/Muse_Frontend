import AllFeeds from "@/components/feed/AllFeeds";
import { dummyAllPosts } from "@/constants/data";
import { images } from "@/constants/images";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <Animated.View className="flex-1">
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            paddingTop: 12,
            paddingBottom: 16,
          }}
        >
          <View className="flex-row justify-between items-center px-6">
            {/* Logo */}
            <TouchableOpacity
              activeOpacity={0.7}
              className="items-center justify-center z-20"
            >
              <Image
                source={images.logo_white}
                className="w-28"
                resizeMode="contain"
                style={{ opacity: 0.9 }}
              />
            </TouchableOpacity>

            <View className="flex-row space-x-3 gap-2">
              <View className="relative">
                <TouchableOpacity
                  onPress={() => setDropdownVisible(!dropdownVisible)}
                  className="flex-row items-center px-4 h-12 bg-[#3636365E]/[37%] overflow-hidden border-[#736F7366]/[40%] border rounded-full drop-shadow-lg shadow-sm  z-20"
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

        {/* Scrollable Content */}
        <Animated.ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 100 }} // Account for header height
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#fff"
              colors={["#fff"]}
              progressBackgroundColor="transparent"
              progressViewOffset={100}
            />
          }
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <View className="flex-row flex-1 justify-center items-center gap-3">
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
    </SafeAreaView>
  );
};

export default Home;
