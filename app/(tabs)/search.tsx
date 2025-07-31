import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
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
    title: "DOT Avenue",
    creator: "KendrickLamar",
    avatar: images.img3,
    verified: true,
  },
  {
    id: 2,
    title: "Drakes hub",
    creator: "Drake",
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
      className="mb-4"
    >
      <TouchableOpacity
        className="flex-row items-center p-4"
        onPress={() =>
          router.replace(RouterConstantUtil.discover.podcats as any)
        }
      >
        <View className="relative mr-4">
          <Image
            source={result.avatar}
            className="w-14 h-14 rounded-full"
            resizeMode="cover"
          />
        </View>

        <View className="flex-1">
          <Text className="text-white text-[18px] font-semibold mb-1">
            {result.title}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-[#AEAEAE] text-[13px] font-regular">
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

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const headerAnimated = useRef(new Animated.Value(0)).current;
  const contentAnimated = useRef(new Animated.Value(0)).current;
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

  const navigateBack = () => {
    router.replace(RouterConstantUtil.tabs.home as any);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    console.log("Searching for:", text);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <Animated.View style={{ opacity: headerAnimated }} className="px-5 py-4">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            onPress={navigateBack}
            className="w-10 h-10 bg-[#363636] rounded-full items-center justify-center"
          >
            <Image source={icons.back} className="h-14 w-14" />
          </TouchableOpacity>

          <View className="flex-1 flex-row items-center bg-[#363636B2]/[75%] border border-[#575757] rounded-full px-4 py-3 ">
            <TextInput
              value={searchQuery}
              onChangeText={handleSearch}
              placeholder="Type to search"
              placeholderTextColor="#9CA3AF"
              className="flex-1 text-[#9CA3AF] text-lg font-medium mb-1"
              autoFocus={true}
            />
          </View>
        </View>
      </Animated.View>

      {/* Search Results */}
      <Animated.View style={{ opacity: contentAnimated }} className="flex-1">
        {searchQuery.length > 0 ? (
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
          <View className="flex-1 justify-center items-center px-8">
            <Animated.View
              style={{ opacity: contentAnimated }}
              className="items-center"
            >
              <View className="w-20 h-20 bg-gray-800 rounded-full items-center justify-center mb-6">
                <Feather name="search" size={32} color="#6B7280" />
              </View>
              <Text className="text-white text-xl font-semibold mb-2 text-center">
                Discover amazing content
              </Text>
              <Text className="text-[#AEAEAE] text-base font-medium text-center leading-6">
                Start typing to search for creators, muses, and trending content
              </Text>
            </Animated.View>
          </View>
        )}
      </Animated.View>

      <View
        style={{
          position: "absolute",
          bottom: 100,
          right: 20,
          zIndex: 1000,
        }}
      >
        <TouchableOpacity
          className="w-[70px] h-[70px] bg-secondary rounded-full items-center justify-center shadow-2xl"
          onPress={() => console.log("Create muse pressed")}
        >
          <Feather name="plus" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Search;
