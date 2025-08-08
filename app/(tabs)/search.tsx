import Podcasts from "@/components/discover/podcasts";
import { images } from "@/constants/images";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { Category, Story } from "@/types/discover";
import { Feather } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

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

const searchResults: SearchResult[] = [
  {
    id: 1,
    title: "Art House",
    creator: "Amara Okafor",
    avatar: images.img3,
    verified: true,
  },
  {
    id: 2,
    title: "Foodies Lounge",
    creator: "Chika Eze",
    avatar: images.img2,
    verified: false,
  },
  {
    id: 3,
    title: "Comedy Spot",
    creator: "Tunde Bello",
    avatar: images.img3,
    verified: true,
  },
  {
    id: 4,
    title: "Music World",
    creator: "Lola George",
    avatar: images.img2,
    verified: true,
  },
];

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
    <Animated.View
      style={{ transform: [{ translateY }], opacity }}
      className=""
    >
      <TouchableOpacity
        className="flex-row items-center p-3"
        onPress={() =>
          router.replace(RouterConstantUtil.discover.podcats as any)
        }
      >
        <View className="relative mr-4">
          <Image
            source={result.avatar}
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
  setModalVisible: any;
}

interface StoryCardProps {
  story: Story;
  index: number;
}

const categories: Category[] = [
  {
    id: 1,
    name: "Food",
    color: "bg-gradient-to-br from-red-500 to-teal-400",
    img: images.food,
  },
  {
    id: 2,
    name: "Entertainment",
    color: "bg-gradient-to-br from-green-300 to-yellow-200",
    img: images.ent,
  },
  {
    id: 3,
    name: "Comedy",
    color: "bg-gradient-to-br from-yellow-400 to-green-400",
    img: images.Comedy,
  },
];

const stories: Story[] = [
  {
    id: 1,
    title: "The fashion get together",
    category: "Fashion",
    categoryLabel: "Trending",
    creator: "Anda Adams",
    creatorType: "Creator",
    muses: "239K",
    image: images.img1,
  },
  {
    id: 2,
    title: "F1 driver challenge",
    category: "Sports",
    categoryLabel: "Trending",
    creator: "Anda Adams",
    creatorType: "Creator",
    muses: "134.6K",
    image: images.img2,
  },
  {
    id: 3,
    title: "Recreating Picasso",
    category: "Creativity",
    categoryLabel: "Trending",
    creator: "Anda Adams",
    creatorType: "Creator",
    muses: "70.5K",
    image: images.img3,
  },
  {
    id: 4,
    title: "#30days abs challenge",
    category: "Health",
    categoryLabel: "Trending",
    creator: "Anda Adams",
    creatorType: "Creator",
    muses: "45.2K",
    image: images.img1,
  },
  {
    id: 5,
    title: "Eats of Lagos",
    category: "Food",
    categoryLabel: "Hot",
    creator: "Chika Eze",
    creatorType: "Foodie",
    muses: "18.7K",
    image: images.img2,
  },
  {
    id: 6,
    title: "Nollywood on the Rise",
    category: "Entertainment",
    categoryLabel: "Trending",
    creator: "Emeka Uzoma",
    creatorType: "Director",
    muses: "56.2K",
    image: images.img3,
  },
  {
    id: 7,
    title: "Late Night Sketches",
    category: "Art",
    categoryLabel: "New",
    creator: "Tolu Adebayo",
    creatorType: "Artist",
    muses: "24.9K",
    image: images.img1,
  },
  {
    id: 8,
    title: "Coding with Coffee",
    category: "Tech",
    categoryLabel: "Trending",
    creator: "Lola George",
    creatorType: "Developer",
    muses: "31.5K",
    image: images.img2,
  },
  {
    id: 9,
    title: "Travel Diaries: Kenya",
    category: "Travel",
    categoryLabel: "Hot",
    creator: "Bisi Johnson",
    creatorType: "Traveler",
    muses: "12.8K",
    image: images.img3,
  },
  {
    id: 10,
    title: "The Big Debate",
    category: "Politics",
    categoryLabel: "Controversial",
    creator: "Musa Danjuma",
    creatorType: "Host",
    muses: "43.1K",
    image: images.img1,
  },
];

const CategoryCard = ({
  category,
  index,
  setModalVisible,
}: CategoryCardProps) => {
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
      className="w-[180px] aspect-square rounded-[24px] bg-white overflow-hidden relative" // w-52 is 208px, adjust as needed
    >
      <Image
        source={category.img}
        className="absolute w-full h-full"
        style={{
          opacity: 1, // fade image so circles are visible, adjust as needed!
          zIndex: 2,
        }}
        resizeMode="cover"
      />

      {/* Touchable content on top */}
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
        transform: [{ translateX }], // <-- Animation props stay inline!
        opacity,
      }}
      className=" px-2   rounded-2xl"
    >
      <TouchableOpacity
        className="flex-row bg-transparent rounded-[22px] items-center"
        activeOpacity={0.85}
      >
        {/* Remove the "s" Text here if not needed */}
        {/* <Text>s </Text> */}
        <Image
          source={story.image}
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
              source={story.image}
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

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const contentAnimated = useRef(new Animated.Value(0)).current;
  const [recentSearches, setRecentSearches] = useState([
    "Art House",
    "Comedy Spot",
    "Eats of Lagos",
    "Coding with Coffee",
  ]);

  const headerAnimated = useRef(new Animated.Value(0)).current;
  const fabAnimated = useRef(new Animated.Value(0)).current;
  const router = useRouter();
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
  }, [headerAnimated, contentAnimated]);

  // const navigateBack = () => {
  //   router.replace(RouterConstantUtil.tabs.home as any);
  // };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    console.log("Searching for:", text);
  };
  const [showdiscover, setshowdiscover] = useState(true);
  useEffect(() => {
    Animated.timing(headerAnimated, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Animate FAB with delay
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

  const navigateToSearch = () => {
    router.replace(RouterConstantUtil.tabs.search as any);
  };

  const [searchFocused, setSearchFocused] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const searchInputRef = useRef<TextInput>(null);
  const handleSelectRecentSearch = (text: string) => {
    // Keyboard.dismiss(); // force keyboard down, regardless of focus

    // Blur the search input (closes keyboard)
    searchInputRef.current?.blur();

    // Give keyboard a tiny moment to close before setting value
    setTimeout(() => {
      setSearchQuery(text);
      // ...add any other navigation or search logic you want
      // setshowdiscover(false) if needed
    }, 50); // 50ms is enough
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
                    // navigateBack();
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
            {/* settings button... */}
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
              <View className="mt-4">
                {searchResults.map((result, index) => (
                  <SearchResultCard
                    key={result.id}
                    result={result}
                    index={index}
                  />
                ))}
              </View>
            </ScrollView>
          ) : (
            <>
              <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 90 }}
              >
                <View className="mt-6 pb-1 ">
                  <Text className="text-white text-[18px] tracking-wider font-sfpro-bold px-3 mb-6">
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

                <View className="mt-8">
                  <View className="flex-row justify-between items-center px-3 mb-6">
                    <Text className="text-[#FFFFFF] text-[18px] font-sfpro-bold tracking-wider">
                      Today's best for you
                    </Text>
                    <TouchableOpacity>
                      <Feather name="chevron-right" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>

                  <View className="px-2 gap-6">
                    {stories.map((story, index) => (
                      <StoryCard key={story.id} story={story} index={index} />
                    ))}
                  </View>
                </View>
              </ScrollView>
            </>
          )}
        </Animated.View>

        {/* Search Results */}
      </SafeAreaView>
    </>
  );
};

export default Search;
