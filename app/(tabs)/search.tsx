import Podcasts from "@/components/discover/podcasts";
import { categories } from "@/constants/data";
import { images } from "@/constants/images";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { discoverAPI } from "@/lib/api/discover";
import { Category, Story } from "@/types/discover";
import { Feather } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

interface SearchResult {
  id: number;
  title: string;
  creator: string;
  avatar: any;
  verified: boolean;
}

interface SearchResultCardProps {
  result: SearchResult;
  index: number;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({
  result,
  index,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 400,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, [animatedValue, index]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View style={{ transform: [{ translateY }], opacity }}>
      <TouchableOpacity
        className="flex-row items-center p-3"
        onPress={() =>
          router.replace(RouterConstantUtil.discover.podcats as any)
        }
      >
        <View className="relative mr-4">
          <Image
            source={result.avatar || images.img1}
            className="w-16 h-16 rounded-full"
            resizeMode="cover"
          />
        </View>

        <View className=" ">
          <Text className="text-white text-[18px] font-sfpro-bold tracking-wider mb-1">
            {result.title}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-[#AEAEAE] text-[13px] font-sfpro-regular tracking-wider">
              {result.creator}
            </Text>
            {result.verified && (
              <View className="ml-2 w-4 h-4 bg-secondary rounded-full items-center justify-center">
                <Feather name="check" size={10} color="white" />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface CategoryCardProps {
  category: Category;
  index: number;
  setModalVisible: (visible: boolean) => void;
}

interface StoryCardProps {
  story: Story;
  index: number;
}

const playlists: Category[] = [
  {
    id: 1,
    name: "The weekend playlist for chilled",
    img: images.playlis1,
  },
  {
    id: 2,
    name: "The weekend playlist for chilled",
    img: images.playlis2,
  },
  {
    id: 3,
    name: "The weekend playlist for chilled",
    img: images.playlis1,
  },
];

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  index,
  setModalVisible,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 600,
      delay: index * 200,
      useNativeDriver: true,
    }).start();
  }, [animatedValue, index]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        opacity,
        marginRight: 12,
      }}
      className="w-[180px] aspect-square rounded-full bg-white overflow-hidden relative"
    >
      <Image
        source={category.img}
        className="absolute w-full h-full"
        style={{
          opacity: 1,
          zIndex: 2,
        }}
        resizeMode="cover"
      />

      <TouchableOpacity
        className=""
        activeOpacity={0.85}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 3,
        }}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <View className="flex-1 justify-center items-center">
          <Text className="text-white font-bold text-[20px] text-center">
            {category.name}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const CARD_W = 200;
const CARD_H = 180;
const RADIUS = 16;

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: RADIUS,
    overflow: "hidden",
    marginRight: 12,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
});

const PlaylistCard: React.FC<CategoryCardProps> = ({
  category,
  index,
  setModalVisible,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 600,
      delay: index * 200,
      useNativeDriver: true,
    }).start();
  }, [animatedValue, index]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });
  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View className=" w-[200px] h-[220px] rounded-2xl overflow-hidden mr-4">
      <Animated.View
        style={[styles.card, { transform: [{ translateY }], opacity }]}
      >
        <Image
          source={category.img}
          resizeMode="cover"
          style={[
            styles.image,
            { transform: [{ scale: 1.34 }], width: "100%", height: "100%" },
          ]}
        />

        {/* Overlay press */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setModalVisible(true)}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
      {/* Text at bottom */}
      <View className="w-[80%] p-1 mb-4 ">
        <Text
          className="text-white/60 font-bold text-[18px]  "
          numberOfLines={3}
        >
          {category.name}
        </Text>
      </View>
    </View>
  );
};

const StoryCard: React.FC<StoryCardProps> = ({ story, index }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      delay: index * 150,
      useNativeDriver: true,
    }).start();
  }, [animatedValue, index]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      style={{
        transform: [{ translateX }],
        opacity,
      }}
      className=" px-2   rounded-2xl"
    >
      <TouchableOpacity
        className="flex-row bg-transparent rounded-[22px] items-center"
        activeOpacity={0.85}
      >
        <Image
          source={story.image || images.img1}
          className="w-[30%] aspect-[1/0.9] rounded-[20px] mr-[14px] bg-neutral-900"
          resizeMode="contain"
        />
        <View className="flex-1  justify-center">
          <View className="flex-row justify-between items-center">
            <Text
              className="text-[#AEAEAE] text-[13px] font-sfpro-regular capitalize mb-[2px]"
              numberOfLines={1}
            >
              {story.category} · {story.categoryLabel}
            </Text>
            <TouchableOpacity hitSlop={10}>
              <Feather name="more-horizontal" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          <Text
            className="text-white font-sfpro-bold tracking-wider text-[19px] mb-[6px] mt-[1px]"
            numberOfLines={1}
          >
            {story.title}
          </Text>
          <View className="flex-row  items-center mb-[2px]">
            <Image
              source={story.image || images.img1}
              className="w-[22px] h-[22px] rounded-full mr-[7px] bg-neutral-800"
            />
            <Text
              className="text-white/50 font-neutral-bold text-base"
              numberOfLines={1}
            >
              {story.creator}
            </Text>
            <View className="w-1 h-1 bg-[white]/50   rounded-full mx-2" />
            <Text
              className="text-white/50 text-sm font-neutral-regular "
              numberOfLines={1}
            >
              {story.creatorType}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const EmptyState: React.FC<{
  title: string;
  subtitle: string;
  icon?: string;
}> = ({ title, subtitle, icon = "search" }) => (
  <View className="flex-1 justify-center items-center py-20">
    <Feather name={icon as any} size={48} color="#9CA3AF" />
    <Text className="text-white text-xl font-semibold mt-4 mb-2">{title}</Text>
    <Text className="text-[#AEAEAE] text-center px-8">{subtitle}</Text>
  </View>
);

const ErrorState: React.FC<{
  title: string;
  subtitle: string;
  onRetry?: () => void;
}> = ({ title, subtitle, onRetry }) => (
  <View className="flex-1 justify-center items-center py-20">
    <Feather name="alert-circle" size={48} color="#EF4444" />
    <Text className="text-white text-xl font-semibold mt-4 mb-2">{title}</Text>
    <Text className="text-[#AEAEAE] text-center px-8 mb-6">{subtitle}</Text>
    {onRetry && (
      <TouchableOpacity
        onPress={onRetry}
        className="bg-white/10 px-6 py-3 rounded-full"
      >
        <Text className="text-white font-semibold">Try Again</Text>
      </TouchableOpacity>
    )}
  </View>
);

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const contentAnimated = useRef(new Animated.Value(0)).current;
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Art House",
    "Comedy Spot",
    "Eats of Lagos",
    "Coding with Coffee",
  ]);

  // API state
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [feedStories, setFeedStories] = useState<Story[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [feedPagination, setFeedPagination] = useState({
    from: 0,
    total: 0,
    hasMore: true,
  });

  const headerAnimated = useRef(new Animated.Value(0)).current;
  const fabAnimated = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const searchTimeoutRef = useRef<any>(null);

  useEffect(() => {
    Animated.timing(headerAnimated, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    Animated.timing(contentAnimated, {
      toValue: 1,
      duration: 700,
      delay: 200,
      useNativeDriver: true,
    }).start();

    // loadFeed();
  }, []);

  const transformToStory = (item: any, index: number): Story => ({
    id: item.id || index + 1,
    title: item.title || item.name || "Untitled",
    category: item.category || "General",
    categoryLabel: item.categoryLabel || item.label || "New",
    creator: item.creator || item.author || "Unknown Creator",
    creatorType: item.creatorType || item.type || "Creator",
    muses: item.muses || item.views || item.likes || "0",
    image: item.image ? { uri: item.image } : images.img1,
  });

  const transformToSearchResult = (item: any, index: number): SearchResult => ({
    id: item.id || index + 1,
    title: item.name || "Untitled",
    creator: item.creatorUsername || "Unknown Creator",
    avatar: item.overImage || images.img1,
    verified: Boolean(item.verified),
  });

  const loadFeed = async (loadMore = false) => {
    try {
      if (loadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoadingFeed(true);
        setFeedError(null);
      }

      const from = loadMore ? feedPagination.from : 0;
      const response = await discoverAPI.getFeed(10, from);

      console.log(response, "looaded feed");

      if (!response || !Array.isArray(response.results)) {
        throw new Error("Invalid response format");
      }

      const transformedStories = response.results.map(transformToStory);

      if (loadMore) {
        setFeedStories((prev) => [...prev, ...transformedStories]);
      } else {
        setFeedStories(transformedStories);
      }

      setFeedPagination({
        from: from + transformedStories.length,
        total: response.total || 0,
        hasMore:
          transformedStories.length > 0 &&
          from + transformedStories.length < (response.total || 0),
      });
    } catch (error) {
      console.error("Failed to load feed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load feed";

      if (!loadMore) {
        setFeedError(errorMessage);
        setFeedStories([]);
      }
    } finally {
      setIsLoadingFeed(false);
      setIsLoadingMore(false);
    }
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    try {
      setIsSearching(true);
      setSearchError(null);

      const response = await discoverAPI.search(query, 10, 0);

      console.log("result from search", response);

      if (!response || !Array.isArray(response.results)) {
        throw new Error("Invalid search response format");
      }

      const transformedResults = response.results.map(transformToSearchResult);
      setSearchResults(transformedResults);
    } catch (error) {
      console.error("Search failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Search failed";
      setSearchError(errorMessage);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.length > 0) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(searchQuery);
      }, 300);
    } else {
      setSearchResults([]);
      setSearchError(null);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const [showdiscover, setshowdiscover] = useState(true);

  useEffect(() => {
    Animated.timing(headerAnimated, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.timing(fabAnimated, {
      toValue: 1,
      duration: 600,
      delay: 1000,
      useNativeDriver: true,
    }).start();
  }, [headerAnimated, fabAnimated]);

  const fabScale = fabAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const [searchFocused, setSearchFocused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const searchInputRef = useRef<TextInput>(null);

  const handleSelectRecentSearch = (text: string) => {
    searchInputRef.current?.blur();
    setTimeout(() => {
      setSearchQuery(text);
    }, 50);
  };

  // Handle scroll to load more feed items
  const handleFeedScroll = useCallback(
    (event: any) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;
      const paddingToBottom = 20;

      if (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
      ) {
        if (feedPagination.hasMore && !isLoadingMore && !isLoadingFeed) {
          loadFeed(true);
        }
      }
    },
    [feedPagination.hasMore, isLoadingMore, isLoadingFeed]
  );

  const renderSearchContent = () => {
    if (isSearching) {
      return (
        <View className="flex-1 justify-center items-center py-10">
          <ActivityIndicator size="large" color="white" />
          <Text className="text-white/50 mt-2">Searching...</Text>
        </View>
      );
    }

    if (searchError) {
      return (
        <ErrorState
          title="Search Error"
          subtitle={searchError}
          onRetry={() => performSearch(searchQuery)}
        />
      );
    }

    if (searchResults.length === 0 && searchQuery.length > 0) {
      return (
        <EmptyState
          title="No Results Found"
          subtitle={`No results found for "${searchQuery}". Try a different search term.`}
          icon="search"
        />
      );
    }

    return (
      <View className="mt-4">
        {searchResults.map((result, index) => (
          <SearchResultCard key={result.id} result={result} index={index} />
        ))}
      </View>
    );
  };

  const renderFeedContent = () => {
    if (isLoadingFeed) {
      return (
        <View className="flex-1 justify-center items-center py-10">
          <ActivityIndicator size="large" color="white" />
          <Text className="text-white/50 mt-2">Loading feed...</Text>
        </View>
      );
    }

    if (feedError) {
      return (
        <ErrorState
          title="Failed to Load Feed"
          subtitle={feedError}
          onRetry={() => loadFeed()}
        />
      );
    }

    if (feedStories.length === 0) {
      return (
        <EmptyState
          title="No Stories Available"
          subtitle="There are no stories to display at the moment."
          icon="file-text"
        />
      );
    }

    return (
      <View className="px-2 gap-6">
        {feedStories.map((story, index) => (
          <StoryCard key={story.id} story={story} index={index} />
        ))}

        {isLoadingMore && (
          <View className="py-4 items-center">
            <ActivityIndicator size="small" color="white" />
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      {modalVisible && (
        <Podcasts
          modalVisible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      )}
      <SafeAreaView className="flex-1 bg-[#121212]">
        <Animated.View
          style={{ opacity: headerAnimated }}
          className="px-3 py-2"
        >
          <View className="flex-row items-center gap-3">
            <View className="flex-1 flex-row items-center bg-[#363636B2]/[75%] border border-[#575757] rounded-full px-4 py-3.5 relative">
              {!showdiscover || searchQuery.length > 0 ? (
                <TouchableOpacity
                  onPress={() => {
                    searchInputRef.current?.blur();
                    setSearchFocused(false);
                    setSearchQuery("");
                    setshowdiscover(true);
                  }}
                  className="mr-3"
                  hitSlop={10}
                >
                  <Feather name="arrow-left" size={20} color="white" />
                </TouchableOpacity>
              ) : (
                <Feather
                  name="search"
                  size={20}
                  color="white"
                  className="mr-3"
                />
              )}
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => {
                  setSearchFocused(true);
                  setshowdiscover(false);
                }}
                onBlur={() => setSearchFocused(false)}
                ref={searchInputRef}
                placeholder="Find communities or creators"
                placeholderTextColor="#8E8E93"
                className="flex-1 text-white/50 text-lg font-neutral-medium leading-[20px]"
                style={{ color: "#fff" }}
              />

              {searchQuery.length > 0 && (
                <TouchableOpacity
                  className="absolute bg-white rounded-full right-4"
                  style={{ padding: 4 }}
                  onPress={() => setSearchQuery("")}
                >
                  <Feather name="x" size={10} color="black" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: contentAnimated }} className="flex-1">
          {searchQuery.length === 0 && !showdiscover ? (
            // Show Recent Searches when focused but empty
            <ScrollView
              className="flex-1 px-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            >
              <View className="mt-6 px-2">
                <Text className="text-[#FFFFFF] text-[16px] font-semibold mb-4">
                  Recent Searches
                </Text>
                {recentSearches.length === 0 ? (
                  <Text className="text-[#AEAEAE] text-[15px]">
                    No recent searches
                  </Text>
                ) : (
                  recentSearches.map((text, idx) => (
                    <TouchableOpacity
                      key={idx}
                      className="flex-row items-center py-5 border-b border-[#282828]"
                      onPress={() => handleSelectRecentSearch(text)}
                    >
                      <Feather
                        name="clock"
                        size={18}
                        color="#9CA3AF"
                        className="mr-4"
                      />
                      <Text className="text-white text-[16px]">{text}</Text>
                      <Feather
                        name="x"
                        size={18}
                        color="#9CA3AF"
                        className="mr-2 absolute right-0"
                      />
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </ScrollView>
          ) : !showdiscover && searchQuery.length > 0 ? (
            // Show Search Results when typing
            <ScrollView
              className="flex-1 px-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            >
              {renderSearchContent()}
            </ScrollView>
          ) : (
            <>
              <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 90 }}
                onScroll={handleFeedScroll}
                scrollEventThrottle={16}
              >
                <View className="mt-6 pb-1 ">
                  <Text className="text-white text-[20px] tracking-wider font-sfpro-medium px-3 mb-6">
                    Categories
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, gap: 2 }}
                  >
                    {categories.map((category, index) => (
                      <CategoryCard
                        key={category.id}
                        category={category}
                        index={index}
                        setModalVisible={setModalVisible}
                      />
                    ))}
                  </ScrollView>
                </View>

                <View className="mt-6 pb-1 ">
                  <Text className="text-white text-[20px] tracking-wider font-sfpro-medium px-3 mb-6">
                    Playlist of the day
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, gap: 2 }}
                  >
                    {playlists.map((playlist, index) => (
                      <PlaylistCard
                        key={playlist.id}
                        category={playlist}
                        index={index}
                        setModalVisible={setModalVisible}
                      />
                    ))}
                  </ScrollView>
                </View>

                <View className="mt-8">
                  <View className="flex-row justify-between items-center px-3 mb-6">
                    <Text className="text-[#FFFFFF] text-[20px] font-sfpro-medium tracking-wider">
                      Today's best for you
                    </Text>
                    <TouchableOpacity>
                      <Feather name="chevron-right" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>

                  {renderFeedContent()}
                </View>
              </ScrollView>
            </>
          )}
        </Animated.View>
      </SafeAreaView>
    </>
  );
};

export default Search;
