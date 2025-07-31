import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { Category, Story } from "@/types/discover";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Defs, RadialGradient, Rect, Stop, Svg } from "react-native-svg";

const { width } = Dimensions.get("window");

interface CategoryCardProps {
  category: Category;
  index: number;
}

interface StoryCardProps {
  story: Story;
  index: number;
}

const ConcentricGradient = () => (
  <Svg width="100%" height="100%" viewBox="0 0 251 251">
    <Defs>
      <RadialGradient id="grad" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor="#8A2387" stopOpacity="0.8" />
        <Stop offset="50%" stopColor="#E94057" stopOpacity="0.5" />
        <Stop offset="100%" stopColor="#F27121" stopOpacity="0.8" />
      </RadialGradient>
    </Defs>
    <Rect x="0" y="0" width="251" height="251" rx="32" fill="url(#grad)" />
  </Svg>
);

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
    img: images.food,
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
];

const CategoryCard = ({ category, index }: CategoryCardProps) => {
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
        width: 251,
        height: 251,
        marginRight: 12,
      }}
    >
      <TouchableOpacity
        style={{
          borderRadius: 32,
          overflow: "hidden",
          width: "100%",
          height: "100%",
        }}
      >
        <View style={{ position: "absolute", width: "100%", height: "100%" }}>
          <ConcentricGradient />
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: 22,
              textAlign: "center",
              zIndex: 2,
            }}
          >
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
        transform: [{ translateX }],
        opacity,
        marginBottom: 22,
        paddingHorizontal: 8,
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          backgroundColor: "transparent",
          borderRadius: 22,
          alignItems: "flex-start",
        }}
        activeOpacity={0.85}
      >
        <Text>s </Text>
        <Image
          source={story.image}
          style={{
            width: 92,
            height: 92,
            borderRadius: 20,
            marginRight: 14,
            backgroundColor: "#222",
          }}
          resizeMode="cover"
        />
        <View style={{ flex: 1, minHeight: 92, justifyContent: "center" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#AEAEAE",
                fontSize: 13,
                fontWeight: "500",
                textTransform: "capitalize",
                marginBottom: 2,
              }}
              numberOfLines={1}
            >
              {story.category} · {story.categoryLabel}
            </Text>
            <TouchableOpacity hitSlop={10}>
              <Feather name="more-horizontal" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: 19,
              marginBottom: 6,
              marginTop: 1,
            }}
            numberOfLines={2}
          >
            {story.title}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <Image
              source={story.image}
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                marginRight: 7,
                backgroundColor: "#333",
              }}
            />
            <Text
              style={{
                color: "#fff",
                fontWeight: "600",
                fontSize: 14,
              }}
              numberOfLines={1}
            >
              {story.creator}
            </Text>
            <Text
              style={{
                color: "#AEAEAE",
                fontSize: 14,
                fontWeight: "500",
                marginLeft: 5,
              }}
              numberOfLines={1}
            >
              · {story.creatorType}
            </Text>
          </View>
          <Text
            style={{
              color: "#AEAEAE",
              fontSize: 13,
              fontWeight: "500",
            }}
          >
            {story.muses} Muses
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const Home: React.FC = () => {
  const headerAnimated = useRef(new Animated.Value(0)).current;
  const fabAnimated = useRef(new Animated.Value(0)).current;
  const router = useRouter();

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

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <Animated.View style={{ opacity: headerAnimated }} className="px-3 py-2">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={navigateToSearch}
            className="flex-1 flex-row items-center bg-[#363636B2]/[75%] border border-[#575757] rounded-full px-4 py-3.5"
          >
            <Feather name="search" size={20} color="white" className="mr-3" />
            <Text className="flex-1 text-[#8E8E93] text-xl font-medium">
              Search
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="items-center justify-center"
            style={{ width: width * 0.12, height: width * 0.12 }}
            onPress={() => console.log("settings clicked")}
          >
            <Image
              source={icons.settings_2}
              style={{ width: width * 0.12, height: width * 0.12 }}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="mt-8">
          <Text className="text-white text-[18px] font-bold px-3 mb-5">
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
              />
            ))}
          </ScrollView>
        </View>

        <View className="mt-8">
          <View className="flex-row justify-between items-center px-3 mb-5">
            <Text className="text-[#FFFFFF] text-[18px] font-bold">
              Today's best for you
            </Text>
            <TouchableOpacity>
              <Feather name="chevron-right" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View className="px-2">
            {stories.map((story, index) => (
              <StoryCard key={story.id} story={story} index={index} />
            ))}
          </View>
        </View>
      </ScrollView>

      <Animated.View
        style={{
          transform: [{ scale: fabScale }],
          position: "absolute",
          bottom: 100,
          right: 20,
          zIndex: 1000,
        }}
      >
        <TouchableOpacity
          className="w-28 h-28  rounded-full items-center justify-center shadow-lg"
          onPress={() => console.log("Create muse pressed")}
        >
          <Image source={images.muse} className="h-full w-full" />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Home;
