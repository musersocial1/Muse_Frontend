import { images } from "@/constants/images";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
  Animated,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProgressiveBlur from "../ui/progressiveBlur";

const CommunityCategories = {
  Sport: [
    "Football",
    "Tennis",
    "Basketball",
    "Soccer",
    "Baseball",
    "Cricket",
    "Boxing",
    "Golf",
  ],
  Science: ["Rocket science", "Science & technology", "Satellite"],
  Foods: ["Food", "Drinks", "Healthy eating"],
  Technology: ["Design", "Coding", "AI", "Security"],
  Gadgets: ["Smartphones", "Laptop", "TVs", "Arcade", "Headset", "Camera"],
  Entertainment: ["Celebrities", "Music", "Movies", "Entertainment", "Comedy"],
};

interface CommunityCategoryScreenProps {
  onClose: () => void;
}

const CommunityCategory: React.FC<CommunityCategoryScreenProps> = ({
  onClose,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategorySelect = (category: string) => {
    let updatedCategories;
    if (selectedCategories.includes(category)) {
      updatedCategories = selectedCategories.filter((cat) => cat !== category);
    } else {
      if (selectedCategories.length < 5) {
        updatedCategories = [...selectedCategories, category];
      } else {
        return;
      }
    }
    setSelectedCategories(updatedCategories);
  };

  const handleSave = () => {
    const categoryData = {
      categories: selectedCategories,
      categoryCount: selectedCategories.length,
    };

    console.log("Saving category data:", categoryData);

    onClose();
  };

  const filteredCategories = Object.entries(CommunityCategories).reduce(
    (acc, [categoryTitle, items]) => {
      const filteredItems = items.filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredItems.length > 0) {
        acc[categoryTitle] = filteredItems;
      }
      return acc;
    },
    {} as Record<string, string[]>
  );

  const renderCategoryButton = (category: string) => {
    const isSelected = selectedCategories.includes(category);

    return (
      <TouchableOpacity
        key={category}
        onPress={() => handleCategorySelect(category)}
        className={`px-7 py-3 rounded-full overflow-hidden mr-2 mb-3 ${
          isSelected ? "bg-secondary" : "bg-[#FFFFFF14]/[8%]"
        }`}
        activeOpacity={0.7}
      >
        <BlurView style={[StyleSheet.absoluteFill]} />
        <Text
          className={`text-base  font-neutral-medium tracking-wider ${
            isSelected ? "text-white" : "text-white/70"
          }`}
        >
          {category}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="relative flex-1 bg-primary rounded-3xl h-[900px] overflow-hidden px-6">
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            zIndex: 1,
            height: 1500,
          },
        ]}
      >
        <ProgressiveBlur useAlt={true} />
        <View className="w-full aspect-[1/4] rounded-3xl">
          <Image
            source={images.bg_2}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      </Animated.View>
      <View className="flex-row relative  items-center px-6 py-4  z-[100]">
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.7}
          className="absolute  ml-5 h-14 left-0 w-14  top-4 overflow-hidden border-white/30 border rounded-full bg-black/20 items-center justify-center z-20"
        >
          <BlurView style={[StyleSheet.absoluteFill]} />
          <Feather
            name="chevron-left"
            size={20}
            color="#fff"
            style={{ opacity: 0.7 }}
          />
        </TouchableOpacity>
        <Text className="text-white   text-[16px] font-sfpro-medium flex-1 text-center mr-5 mt-4">
          Select community category
        </Text>
      </View>

      <View className="flex-1 px-3 mt-4 relative z-[100]">
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {Object.entries(CommunityCategories).map(([categoryTitle, items]) => (
            <View key={categoryTitle} className="mb-4">
              <Text className="text-white text-2xl font-sfpro-bold mb-4">
                {categoryTitle}
              </Text>

              <View className="flex-row flex-wrap">
                {items.map(renderCategoryButton)}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      <View className="pb-8 px-4 z-[100]">
        <TouchableOpacity
          onPress={handleSave}
          className="rounded-full bg-[#0368FF] py-4 mt-6"
        >
          <Text className="text-white text-xl font-sfpro-bold text-center">
            Save Changes
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CommunityCategory;
