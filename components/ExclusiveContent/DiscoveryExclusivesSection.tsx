import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Platform } from "react-native";
import * as Animatable from "react-native-animatable";

import { isVideoCached, prefetchVideos } from "@/utils/videoPrefetch";
import { useRouter } from "expo-router";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import MediaPlayerModal from "../modals/MediaPlayer";

type Video = {
  id: string;
  title: string;
  thumb: string;
  age: string; // e.g. "5 Months ago"
  isNew?: boolean;
  links?: string;
  previews?: ImageSourcePropType[]; // 👈 previews are local images
};

type Community = {
  id: string;
  name: string;
  avatar: string;
  isNew?: boolean;
};

const FILTERS = [
  "All",
  "Most Recent",
  "Continue watching",
  "Over 1hr",
  "Podcasts",
  "Interviews",
  "Trending Now",
  "For You",
  "Comedy",
  "Tech & Business",
  "Music",
];

// 🎬 Clip image arrays
const clip1Images: ImageSourcePropType[] = [
  images.latest1_1,
  images.latest1_2,
  images.latest1_3,
  images.latest1_4,
  images.latest1_5,
  images.latest1_6,
  images.latest1_7,
  images.latest1_8,
  images.latest1_9,
  images.latest1_10,
  images.latest1_11,
];

const clip2Images: ImageSourcePropType[] = [
  images.latest2_1,
  images.latest2_2,
  images.latest2_3,
  images.latest2_4,
  images.latest2_5,
  images.latest2_10,
  images.latest2_12,
];

const LATEST: Video[] = [
  {
    id: "1",
    title: "Why Vertical LLM Agents Are The New $1 Billion SaaS Opportunities",
    thumb: images.latest1,
    age: "1 Week ago",
    isNew: true,
    previews: clip2Images, // 👈 Add clip2 images array here

    links:
      "https://firebasestorage.googleapis.com/v0/b/davis-d2094.appspot.com/o/muse%2Fvideoplayback.mp4?alt=media&token=40e4fe12-21e8-49c7-b101-1237a549a637",
  },
  {
    id: "2",
    title: "Conversations with Bornfrosh & Al",
    thumb: images.latest2,
    age: "2 Weeks ago",
    isNew: true,
    links:
      "https://firebasestorage.googleapis.com/v0/b/davis-d2094.appspot.com/o/muse%2FhateSpeech%20(online-video-cutter.com).mp4?alt=media&token=b928ad2a-cc6a-4d0b-82c8-067679ab6f5e",
    previews: clip1Images, // 👈 Add clip1 images array here
  },
  {
    id: "3",
    title: "The Startup Deep Dive",
    thumb:
      "https://images.unsplash.com/photo-1590608897129-79da98d159cc?q=80&w=1600&auto=format&fit=crop",
    age: "1 Month ago",
  },
  {
    id: "4",
    title: "Comedy Night Special",
    thumb:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop",
    age: "2 Months ago",
  },
];

const COMMUNITIES: Community[] = [
  {
    id: "c1",
    name: "JRE",
    avatar: images.Xcomm1, // local image
    isNew: true,
  },
  {
    id: "c2",
    name: "Call Her Daddy",
    avatar: images.Xcomm2, // local image
  },
  {
    id: "c3",
    name: "All In",
    avatar: images.Xcomm3, // local image
    isNew: true,
  },
  {
    id: "c4",
    name: "Tech Weekly",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "c5",
    name: "Comedy Central",
    avatar:
      "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "c6",
    name: "Startup Stories",
    avatar:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
    isNew: true,
  },
  {
    id: "c7",
    name: "Music Lounge",
    avatar:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "c8",
    name: "Foodies",
    avatar:
      "https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=800&auto=format&fit=crop",
  },
];

const CONTINUE: (Video & { progress: number })[] = [
  {
    id: "p1",
    title: "PBD Podcast – Business Leaders",
    thumb: images.Xpod1, // local image
    age: "1:05:24",
    progress: 0.4,
  },
  {
    id: "p2",
    title: "PBD Podcast – Debate Night",
    thumb: images.Xpod2, // local image
    age: "58:12",
    progress: 0.7,
  },
  {
    id: "p3",
    title: "Tech Founders Weekly",
    thumb:
      "https://images.unsplash.com/photo-1590608897129-79da98d159cc?q=80&w=1600&auto=format&fit=crop",
    age: "42:18",
    progress: 0.5,
  },
  {
    id: "p4",
    title: "Comedy Roundtable",
    thumb:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1600&auto=format&fit=crop",
    age: "36:45",
    progress: 0.25,
  },
  {
    id: "p5",
    title: "Startup Stories Podcast",
    thumb:
      "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?q=80&w=1600&auto=format&fit=crop",
    age: "1:15:03",
    progress: 0.9,
  },
];

// Inside your component:
const router = useRouter();

export default function DiscoveryExclusivesScreen() {
  const [currentMedia, setCurrentMedia] = useState<
    | {
        url: string;
        title: string;
        previews?: ImageSourcePropType[];
      }
    | any
  >(null);

  const [cachedUrls, setCachedUrls] = useState<Record<string, string>>({});
  const [prefetchProgress, setPrefetchProgress] = useState(0);

  // Updated section of DiscoveryExclusivesScreen

  // 🔥 PREFETCH ONLY 30% OF VIDEOS ON MOUNT
  useEffect(() => {
    const prefetchAllVideos = async () => {
      // Get all video URLs
      const videoUrls = LATEST.filter((item) => item.links).map(
        (item) => item.links!
      );

      console.log("🎬 Starting 30% prefetch for", videoUrls.length, "videos");

      // 🔥 Prefetch only 30% of each video in background
      prefetchVideos(
        videoUrls,
        (index, progress) => {
          console.log(`Video ${index + 1}: ${(progress * 100).toFixed(0)}%`);
          setPrefetchProgress(((index + progress) / videoUrls.length) * 100);
        },
        30 // 👈 Only download 30% of each video!
      ).then(() => {
        console.log("✅ All videos 30% ready!");
      });

      // Check each video for cached version
      const cached: Record<string, string> = {};
      for (const item of LATEST) {
        if (item.links) {
          const cachedPath = await isVideoCached(item.links);
          if (cachedPath) {
            cached[item.id] = cachedPath;
          }
        }
      }
      setCachedUrls(cached);
    };

    // Start prefetch after 1 second (let UI load first)
    const timer = setTimeout(prefetchAllVideos, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 🔥 USE CACHED URL WHEN OPENING PLAYER
  const openPlayer = async (item: Video | (Video & { progress?: number })) => {
    let videoUrl = item.links ?? images.media;

    // Check if we have a cached version (30% preloaded)
    if (item.links) {
      const cachedPath = await isVideoCached(item.links);
      if (cachedPath) {
        console.log("⚡ Using 30% cached video - will stream rest");
        videoUrl = cachedPath;
      } else {
        console.log("📡 Streaming full video");
        videoUrl = item.links; // Stream from original URL
      }
    }

    setCurrentMedia({
      url: videoUrl,
      title: item.title,
      previews: item.previews, // 👈 attach previews here
    });
    setShowPlayer(true);
  };
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);

  const { width } = Dimensions.get("window");
  const headerChips = useMemo(
    () =>
      FILTERS.map((f) => (
        <TouchableOpacity
          key={f}
          onPress={() => setActiveFilter(f)}
          className={`px-4  py-3 rounded-full mr-2 ${
            activeFilter === f ? "bg-white" : "bg-[#202020]"
          }`}
          activeOpacity={0.8}
        >
          <Text
            className={`text-[12px]  leading-[12px] font-sfpro-bold  ${
              activeFilter === f ? "text-black" : "text-white"
            }`}
          >
            {f}
          </Text>
        </TouchableOpacity>
      )),
    [activeFilter]
  );

  const [showAll, setShowAll] = useState(false);
  const insets = useSafeAreaInsets();
  const [showPlayer, setShowPlayer] = useState(false);

  //  Animated values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        bounciness: 6,
        speed: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <>
      <SafeAreaView
        style={{ paddingTop: Platform.OS == "ios" ? 0 : insets.top + 10 }}
        className="flex-1   bg-[#0B0B0B]"
      >
        {showPlayer && (
          <MediaPlayerModal
            isVisible={showPlayer}
            onClose={() => setShowPlayer(false)}
            // title="Conversations with Bornfrosh & Al • Conversations with Bornfrosh & Al • Conversations with Bornfrosh & Al"
            videoUrl={currentMedia.url}
            audioUrl={currentMedia.url}
            title={Array(3).fill(currentMedia.title).join(" • ")} // 👈 repeated title
            author="John"
            duration={0}
            previews={currentMedia.previews || []} // 👈 here
          />
        )}

        <Animatable.View
          // animation="non" // 👈 enters from right
          // duration={600}
          // exit="fadeOutLeft"        // 👈 exits to left (RN Animatable supports this now)
          // delay={60}
          style={{
            flex: 1,
            // paddingTop: insets.top + (Platform.OS === "ios" ? 0 : 10),
          }}
          className="flex-1   bg-[#0B0B0B]"
        >
          <ScrollView
            className="flex-1"
            //   contentContainerClassName="pb-"
            contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={[0]} // 👈 make the first child sticky
          >
            {/* Search + download */}
            <View className="  pb-4  bg-[#0B0B0B]">
              <View className="flex-row px-2 items-center">
                <View className="flex-1 flex-row items-center bg-[#1A1A1A] rounded-full px-4 ">
                  <Ionicons name="search" size={20} color="#ffffff" />
                  <TextInput
                    placeholder="Search"
                    placeholderTextColor="#9ca3af"
                    className="flex-1 text-white text-[14px] font-sfpro-medium tracking-wider h-[3.5rem] ml-2"
                  />
                </View>

                <TouchableOpacity
                  className="ml-2 w-[3.4rem] h-[3.4rem] rounded-full bg-white items-center justify-center"
                  activeOpacity={0.8}
                >
                  <Image
                    source={icons.Xdownloads}
                    className="w-7 h-7"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              {/* Filter chips */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mt-4 px-2"
              >
                {headerChips}
              </ScrollView>
            </View>

            {/* Latest */}
            {/* Latest */}
            <Section title="Latest">
              <View className="flex-row flex-wrap px-3 gap-4">
                {LATEST.slice(0, showAll ? LATEST.length : 2).map((item) => (
                  <View key={item.id} className="w-[48%]  ">
                    <VideoCard
                      item={item}
                      onPress={() => openPlayer(item)}
                      setShowPlayer={setShowPlayer}
                    />
                  </View>
                ))}
              </View>
              <SeeAll
                label={showAll ? "Show less" : `See All ${LATEST.length} more`}
                onPress={() => setShowAll(!showAll)}
              />
            </Section>

            {/* Your communities */}
            <Section title="Your communities">
              <View className="flex-row flex-wrap mt-2 px-3  justify-between">
                {COMMUNITIES.slice(0, showAll ? COMMUNITIES.length : 3).map(
                  (item) => (
                    <View key={item.id} className="w-[32%] ">
                      <CommunityBubble item={item} />
                    </View>
                  )
                )}
              </View>
              <SeeAll />
            </Section>

            {/* Continue watching */}
            <Section title="Continue watching">
              <FlatList
                data={CONTINUE}
                keyExtractor={(i) => i.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 12 }}
                ItemSeparatorComponent={() => <View className="w-3" />}
                renderItem={({ item }) => <ContinueCard item={item} />}
              />
            </Section>
          </ScrollView>
        </Animatable.View>
      </SafeAreaView>
    </>
  );
}

/* --------------------------------- UI bits -------------------------------- */

function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View className={`mt-3 mb-3  ${className}`}>
      <Text className=" text-white px-3 text-[18px] font-sfpro-bold">
        {title}
      </Text>
      <View className="mt-3">{children}</View>
    </View>
  );
}

function SeeAll({
  label = "See All",
  onPress,
}: {
  label?: string;
  onPress?: () => void;
}) {
  return (
    <View className="items-center mt-6">
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center px-5 py-3 rounded-full bg-white/10"
      >
        <Text className="text-white font-sfpro-bold leading-[13px] text-[13px] mr-1">
          {label}
        </Text>
        <Ionicons name="chevron-down" size={17} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

function VideoCard({
  item,
  setShowPlayer,
  onPress,
}: {
  item: Video;
  onPress: () => void;

  setShowPlayer: (val: boolean) => void;
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="rounded-[13px]  border border-white/5  overflow-hidden bg-[#141414]">
        <ImageBackground
          source={
            typeof item.thumb === "string" ? { uri: item.thumb } : item.thumb
          }
          className="w-full aspect-[1/0.63]"
          resizeMode="cover"
        >
          {item.isNew && (
            <View className="absolute right-2 top-2 px-4 py-2 overflow-hidden   rounded-full">
              <BlurView
                style={StyleSheet.absoluteFill}
                intensity={70}
                experimentalBlurMethod="dimezisBlurView"
                tint="dark"
              />
              <Text className="text-[13px] leading-[13px] font-sfpro-medium text-white">
                New
              </Text>
            </View>
          )}
        </ImageBackground>
      </View>
      <Text
        numberOfLines={1}
        className="text-white font-sfpro-medium text-[15px] mt-2 "
      >
        {item.title}
      </Text>
      <Text className="text-white/40 text-[13px] font-sfpro-medium mt-1">
        {item.age}
      </Text>
    </TouchableOpacity>
  );
}

function CommunityBubble({ item }: { item: Community }) {
  return (
    <TouchableOpacity
      onPress={() => {
        router.push("/(community)/user-view-community");
      }}
      className=" w-full  items-center"
    >
      {item.isNew && (
        <View
          style={{
            transform: [{ rotate: "-10deg" }], // 👈 tilt the badge
          }}
          className="absolute z-[100] left-[7px] top-[-4px]"
        >
          <View className="p-1 rounded-full bg-[#3B82F6]">
            <Text className="text-[13px] leading-[18px] text-white font-sfpro-bold tracking-wider">
              NEW
            </Text>
          </View>
        </View>
      )}
      <View
        className={`${
          item.isNew ? "border-[3.5px] border-[#8F0B02]" : ""
        } w-full aspect-square rounded-full overflow-hidden `}
      >
        <Image
          source={
            typeof item.avatar === "string"
              ? { uri: item.avatar } // remote url
              : item.avatar // local require() from images
          }
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
    </TouchableOpacity>
  );
}

function ContinueCard({ item }: { item: Video & { progress: number } }) {
  return (
    <TouchableOpacity activeOpacity={0.95} className="w-[260px] ">
      <View className="rounded-[16px] aspect-[1/0.65] w-full   overflow-hidden bg-[#141414]">
        <Image
          source={
            typeof item.thumb === "string"
              ? { uri: item.thumb } // remote URL
              : item.thumb // local image from require()
          }
          className="w-full h-full"
          resizeMode="cover"
        />

        <View className=" z-[100] absolute right-2 bottom-2  px-3 py-2 rounded-full overflow-hidden">
          <BlurView
            style={StyleSheet.absoluteFill}
            intensity={60}
            experimentalBlurMethod="dimezisBlurView"
            tint="dark"
          />
          <Text className="text-white text-[12px] font-sfpro-medium leading-[12px]  mt-1">
            {item.age}
          </Text>
        </View>

        {/* progress bar */}
        <View className="absolute  left-0 right-0 bottom-0 ">
          <View className="h-[3.4px] rounded-full overflow-hidden">
            <View
              className="h-full bg-[#0368FF]"
              style={{
                width: `${Math.min(100, Math.max(0, item.progress * 100))}%`,
              }}
            />
          </View>
        </View>
      </View>

      <Text
        numberOfLines={1}
        className="text-white font-sfpro-medium leading-[15px] text-[15px] mt-2"
      >
        {item.title}
      </Text>
      <View className="flex-row mt-2 gap-2 items-center">
        <Text
          numberOfLines={1}
          className="text-white/50 font-sfpro-medium text-[14px] leading-[14px]  "
        >
          54M views
        </Text>
        <View className="w-1.5 h-1.5 rounded-full bg-white/50" />
        <Text
          numberOfLines={1}
          className="text-white/50 font-sfpro-medium text-[14px] leading-[14px]  "
        >
          5 Months ago
        </Text>
      </View>
    </TouchableOpacity>
  );
}
