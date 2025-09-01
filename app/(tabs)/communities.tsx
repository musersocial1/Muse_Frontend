import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
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
const cardSize = (width - 80) / 2;

interface Community {
  id: string;
  name: string;
  image: string;
}

const communities: Community[] = [
  {
    id: "1",
    name: "Swifties",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
  },
  {
    id: "2",
    name: "Swifties",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop",
  },
  {
    id: "3",
    name: "Swifties",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120c3b166f?w=200&h=200&fit=crop",
  },
  {
    id: "4",
    name: "Swifties",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop",
  },
  {
    id: "5",
    name: "Swifties",
    image:
      "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=200&h=200&fit=crop",
  },
  {
    id: "6",
    name: "Swifties",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop",
  },
];

const CommunityCard: React.FC<{ community: Community; size: number }> = ({
  community,
  size,
}) => {
  return (
    <TouchableOpacity
      className="items-center mb-6"
      onPress={() => router.push(RouterConstantUtil.community.user as any)}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
        className="overflow-hidden shadow-lg"
      >
        <Image
          source={{ uri: community.image }}
          style={{
            width: size,
            height: size,
          }}
          className="rounded-full"
          resizeMode="cover"
        />
      </View>
      <Text className="text-white text-sm mt-2 font-medium">
        {community.name}
      </Text>
    </TouchableOpacity>
  );
};

const Communities: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#000000]">
      <Animated.View className="flex-1">
        <LinearGradient
          colors={["#000000", "#1c1c1c", "#000000"]}
          locations={[0, 0.7, 1]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={{ flex: 1 }}
        >
          <Animated.View className="flex-1">
            <View className="items-center px-6 pt-10 pb-6">
              <Text className="text-white text-[24px] font-bold mb-4">
                All communities
              </Text>

              <View className="bg-[#363636] border-[0.7px] border-[#575757] w-full rounded-full px-4 py-4">
                <TextInput
                  placeholder="Type to search"
                  placeholderTextColor="#9CA3AF"
                  className="text-white text-base"
                />
              </View>
            </View>

            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: 20,
              }}
            >
              <View className="flex-row flex-wrap justify-between">
                {communities.map((community) => (
                  <CommunityCard
                    key={community.id}
                    community={community}
                    size={cardSize}
                  />
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Communities;
