import CarouselItem from "@/components/discover/CarouselItem";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { Podcast, PodcastItem } from "@/types/discover";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

interface PodcastListItemProps {
  podcast: PodcastItem;
  index: number;
}

const filterOptions = [
  "All podcasts",
  "Lifestyle",
  "Entertainment",
  "News & politics",
  "Food & Drinks",
];

const featuredPodcasts: Podcast[] = [
  {
    id: 1,
    title: "How to roll your feets",
    creator: "Anda Adams",
    creatorType: "Creator",
    image: images.img1,
    backgroundColor: "#8B4513",
    shadowColor: "#8B4513",
  },
  {
    id: 2,
    title: "The art of conversation",
    creator: "Sarah Johnson",
    creatorType: "Host",
    image: images.img2,
    backgroundColor: "#2E8B57",
    shadowColor: "#2E8B57",
  },
  {
    id: 3,
    title: "Tech talks daily",
    creator: "Mike Chen",
    creatorType: "Creator",
    image: images.img3,
    backgroundColor: "#4169E1",
    shadowColor: "#4169E1",
  },
];

const podcastList: PodcastItem[] = Array(16)
  .fill(null)
  .map((_, index) => ({
    id: index + 1,
    title: "The spot",
    creator: "Alleydavies",
    image: images.img4,
  }));

const PodcastListItem: React.FC<PodcastListItemProps> = ({
  podcast,
  index,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 400,
      delay: index * 80,
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
      style={{ transform: [{ translateX }], opacity }}
      className="mb-1"
    >
      <TouchableOpacity className="flex-row items-center p-4">
        <Image
          source={podcast.image}
          className="w-16 h-16 rounded-2xl mr-4"
          resizeMode="cover"
        />

        <View className="flex-1">
          <Text className="text-[#FFFFFF] text-[17px] font-semibold mb-1">
            {podcast.title}
          </Text>
          <Text className="text-[#AEAEAE] text-[13px] font-medium">
            {podcast.creator}
          </Text>
        </View>

        <TouchableOpacity className="p-2">
          <Feather name="chevron-right" size={18} color="#6B7280" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const FilterDropdown: React.FC<{
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ selectedFilter, onFilterChange, isOpen, onToggle }) => {
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  const dropdownHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, filterOptions.length * 50],
  });

  return (
    <View className="relative">
      <TouchableOpacity
        onPress={onToggle}
        className="bg-white rounded-full px-6 py-3 flex-row items-center"
      >
        <Text className="text-black text-[13px] font-bold mr-2">
          {selectedFilter}
        </Text>
        <Animated.View
          style={{
            transform: [
              {
                rotate: animatedHeight.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "180deg"],
                }),
              },
            ],
          }}
        >
          <Feather name="chevron-down" size={16} color="black" />
        </Animated.View>
      </TouchableOpacity>

      {isOpen && (
        <Animated.View
          style={{ height: dropdownHeight }}
          className="absolute top-14 right-4 w-[200px] max-w-[90vw] bg-[#2C2C2E] rounded-3xl overflow-hidden z-50"
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {filterOptions.map((option, index) => (
              <TouchableOpacity
                key={option}
                onPress={() => {
                  onFilterChange(option);
                  onToggle();
                }}
                className={`px-4 py-4 ${
                  index !== filterOptions.length - 1
                    ? "border-b border-gray-700"
                    : ""
                }`}
              >
                <Text
                  className={`text-[18px] font-medium ${
                    selectedFilter === option ? "text-white" : "text-white"
                  }`}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
};

const Podcasts: React.FC = () => {
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState<number>(0);
  const [selectedFilter, setSelectedFilter] = useState<string>("All podcasts");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const headerAnimated = useRef(new Animated.Value(0)).current;
  const carouselAnimated = useRef(new Animated.Value(0)).current;
  const contentAnimated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(headerAnimated, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(carouselAnimated, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnimated, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const navigateBack = () => {
    router.push(RouterConstantUtil.tabs.search as any);
  };

  const onCarouselScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setCurrentCarouselIndex(index);
  };

  const renderCarouselItem = ({
    item,
    index,
  }: {
    item: Podcast;
    index: number;
  }) => (
    <CarouselItem
      podcast={item}
      index={index}
      currentIndex={currentCarouselIndex}
    />
  );

  const renderPaginationDots = () => (
    <View className="flex-row justify-center items-center mt-6 mb-8">
      {featuredPodcasts.map((_, index) => (
        <View
          key={index}
          className={`w-2 h-2 rounded-full mx-1 ${
            currentCarouselIndex === index ? "bg-white" : "bg-gray-600"
          }`}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <Animated.View
        style={{ opacity: headerAnimated }}
        className="px-5 py-4 my-5"
      >
        <View className="flex-row items-center justify-center relative">
          <TouchableOpacity
            onPress={navigateBack}
            className="absolute left-0 w-10 h-10  rounded-full items-center justify-center"
          >
            <Image source={icons.back} className="h-14 w-14" />
          </TouchableOpacity>

          <Text className="text-[#FFFFFF] text-[24px] font-bold">Podcasts</Text>
        </View>
      </Animated.View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Animated.View style={{ opacity: carouselAnimated }} className="mt-4">
          <FlatList
            data={featuredPodcasts}
            renderItem={renderCarouselItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onCarouselScroll}
            snapToInterval={width}
            decelerationRate="fast"
            contentContainerStyle={{ alignItems: "center" }}
          />

          {renderPaginationDots()}
        </Animated.View>

        <Animated.View style={{ opacity: contentAnimated }} className="px-5">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-[#FFFFFF] text-[22px] font-bold">
              All podcast
            </Text>

            <FilterDropdown
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
              isOpen={isDropdownOpen}
              onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
            />
          </View>

          {/* Podcast List */}
          <View className="space-y-2">
            {podcastList.map((podcast, index) => (
              <PodcastListItem
                key={podcast.id}
                podcast={podcast}
                index={index}
              />
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Podcasts;
