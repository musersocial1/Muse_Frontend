import { icons } from "@/constants/icons";
import { CommunityData } from "@/types/community";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProgressBar from "./ProgressBar";

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
        className={`px-4 py-3 rounded-full mr-3 mb-3 ${
          isSelected ? "bg-secondary" : "bg-[#FFFFFF14]/[8%]"
        }`}
        activeOpacity={0.7}
      >
        <Text
          className={`text-base neutral-medium ${
            isSelected ? "text-white" : "text-gray-300"
          }`}
        >
          {category}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={{
          uri:
            data.coverImage ||
            "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400",
        }}
        className="absolute inset-0 w-full h-full"
        resizeMode="cover"
      />

      <LinearGradient
        colors={[
          "rgba(255,106,0,0.9)",
          "rgba(0,0,0,1)",
          "rgba(0,0,0,1)",
          "#000000",
        ]}
        locations={[0, 0.35, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientOverlay}
      />

      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-6 py-4">
          <TouchableOpacity
            className="absolute top-3 left-2 h-14 w-14 z-20"
            onPress={onBack}
          >
            <Image source={icons.back_3} className="h-14 w-14 opacity-90" />
          </TouchableOpacity>
          <Text className="text-white text-[20px] font-bold flex-1 text-center mr-5 mt-4">
            Select community category
          </Text>
        </View>

        <View className="flex-1 px-6 mt-4">
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            {Object.entries(CommunityCategories).map(
              ([categoryTitle, items]) => (
                <View key={categoryTitle} className="mb-8">
                  <Text className="text-[#FFFFFFB2]/[70%] text-2xl font-semibold mb-4">
                    {categoryTitle}
                  </Text>

                  <View className="flex-row flex-wrap">
                    {items.map(renderCategoryButton)}
                  </View>
                </View>
              )
            )}
          </ScrollView>

          <View className="absolute bottom-0 left-0 right-0 px-6 pb-10">
            <ProgressBar currentStep={7} totalSteps={7} />

            <TouchableOpacity
              onPress={onSubmit}
              className="bg-secondary rounded-full py-5 items-center"
              disabled={selectedCategories.length === 0}
            >
              <Text className="text-white text-lg font-semibold">
                Create community
                {selectedCategories.length > 0 && (
                  <Text className="text-blue-200">
                    {" "}
                    ({selectedCategories.length})
                  </Text>
                )}
              </Text>
            </TouchableOpacity>
          </View>
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
