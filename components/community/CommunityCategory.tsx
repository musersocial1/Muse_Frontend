import { CommunityData } from "@/types/community";
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

const CommunityCategoryScreen: React.FC<{
  data: CommunityData;
  onUpdate: (data: Partial<CommunityData>) => void;
  onNext: () => void;
  onBack: () => void;
  onSubmit: any;
}> = ({ data, onUpdate, onBack, onSubmit }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    data.categories || []
  );

  const handleCategorySelect = (category: string) => {
    let updatedCategories;
    if (selectedCategories.includes(category)) {
      updatedCategories = selectedCategories.filter((cat) => cat !== category);
    } else {
      updatedCategories = [...selectedCategories, category];
    }

    setSelectedCategories(updatedCategories);
    onUpdate({ categories: updatedCategories });
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
    <View className="flex-1 ">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row relative  items-center px-6 py-4">
          <TouchableOpacity
            onPress={onBack}
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

        <View className="flex-1 px-3 mt-4">
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {Object.entries(CommunityCategories).map(
              ([categoryTitle, items]) => (
                <View key={categoryTitle} className="mb-4">
                  <Text className="text-white text-2xl font-sfpro-bold mb-4">
                    {categoryTitle}
                  </Text>

                  <View className="flex-row flex-wrap">
                    {items.map(renderCategoryButton)}
                  </View>
                </View>
              )
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default CommunityCategoryScreen;
