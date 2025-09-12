import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
        <BlurView
          style={[StyleSheet.absoluteFill]}
          experimentalBlurMethod="dimezisBlurView"
        />
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
      {/* <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject]}
        className={`h-[300%]`}
      >
        <ProgressiveBlur useAlt={false} />
        <View className="w-full   aspect-[1/2]">
          <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
            <LinearGradient
              colors={["#c3c9f4", "#d3a6b9", "#0d0b0d"]} // top → mid → bottom
              locations={[0, 0.48, 1]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />

            <Svg style={StyleSheet.absoluteFillObject}>
              <Defs>
                <RadialGradient id="vignette" cx="50%" cy="-15%" r="100%">
                  <Stop offset={0.55} stopColor="#000" stopOpacity={0} />
                  <Stop offset={1} stopColor="#000" stopOpacity={0.85} />
                </RadialGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#vignette)" />
            </Svg>
          </View>
        </View>
      </Animated.View> */}
      <View className="flex-row relative  items-center px-6 py-4  z-[90] ">
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.7}
          className="absolute  ml-5 h-14 left-0 w-14  top-4 overflow-hidden border-white/30 border rounded-full bg-black/20 items-center justify-center z-20"
        >
          <BlurView
            style={[StyleSheet.absoluteFill]}
            experimentalBlurMethod="dimezisBlurView"
          />
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

      <View className="flex-1 px-3  relative z-[90] mt-7">
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
          className="rounded-full bg-[#0368FF] py-5 mt-6"
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
