import { icons } from "@/constants/icons";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { communityAPI } from "@/lib/api/community";
import { showError } from "@/lib/toast";
import { Feather } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";

interface Community {
  _id: string;
  name: string;
  price: number;
  members: string[];
  coverImage?: string;
}

const AnimatedCommunityItem = ({
  name,
  price,
  index,
  coverImage,
}: {
  name: string;
  price: number;
  index: number;
  coverImage?: string;
}) => (
  <Animatable.View
    animation="fadeInUp"
    duration={220}
    delay={index * 50}
    useNativeDriver
  >
    <Link
      style={{ fontFamily: "SFProDisplay-Bold" }}
      href={RouterConstantUtil.profile.subscriptioninfo as any}
    >
      <View className="flex-row items-center p-3 bg-[#1C1C1C] rounded-full w-full">
        <View className="w-12 h-12 rounded-full items-center justify-center mr-4 overflow-hidden">
          <Image
            source={coverImage || icons.dp}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        <View className="flex-1">
          <Text className="text-white/50 font-bold text-[16px]">{name}</Text>
        </View>
        <View className="flex-row items-center max-w-[50%]">
          <Text
            numberOfLines={1}
            className="text-white text-[16px] font-bold mr-2"
          >
            ${price.toLocaleString()}
          </Text>
          <Feather
            name="chevron-right"
            size={20}
            color="gray"
            style={{ opacity: 0.3 }}
          />
        </View>
      </View>
    </Link>
  </Animatable.View>
);

const UserCommunities = () => {
  const router = useRouter();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await communityAPI.getMyCommunity();

      const formattedCommunities = res.community.map((community: any) => ({
        _id: community._id,
        name: community.name,
        price: community.price || 0,
        members: community.members || [],
        coverImage: community.coverImage?.url || community.coverImage,
      }));

      setCommunities(formattedCommunities);
    } catch (error) {
      console.log("Error fetching communities:", error);
      setError("Failed to load communities");
      showError("Error", "Failed to load communities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 bg-[#121212] justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-white mt-4">Loading communities...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-[#121212] justify-center items-center px-6">
        <Text className="text-red-400 text-center mb-4">{error}</Text>
        <TouchableOpacity
          onPress={() => router.replace(RouterConstantUtil.tabs.profile as any)}
          className="bg-secondary px-8 py-4 rounded-full"
        >
          <Text className="text-white font-bold">Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#121212]">
      <SafeAreaView className="flex-1 gap-7">
        <View className="flex-row items-center justify-between px-6">
          <TouchableOpacity
            onPress={() =>
              router.replace(RouterConstantUtil.tabs.profile as any)
            }
            className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center"
          >
            <Image source={icons.back} className="w-14 h-14" />
          </TouchableOpacity>
          <Text className="text-[#FFFFFF] text-[20px] font-bold">
            Communities
          </Text>
          <View className="w-10" />
        </View>

        <View className="flex-row items-center justify-between mt-5 px-3">
          <Text
            style={{ fontFamily: "SFProDisplay-Medium" }}
            className="text-white text-lg px-6"
          >
            Showing all communities
          </Text>
          <View className="w-11 h-11 rounded-full bg-[#FFFFFF17]/10 items-center justify-center">
            <Text
              style={{ fontFamily: "SFProDisplay-Regular" }}
              className="text-white/40 text-lg font-bold"
            >
              {communities.length}
            </Text>
          </View>
        </View>

        <View className="w-full border-b border-b-[#565656]/10 mb-2"></View>

        <ScrollView className="px-4">
          {communities.length === 0 ? (
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-white/60 text-center">
                No communities found
              </Text>
              <Text className="text-white/40 text-center mt-2">
                Create your first community to get started
              </Text>
            </View>
          ) : (
            <View className="space-y-4 gap-4">
              {communities.map((item, idx) => (
                <AnimatedCommunityItem
                  key={item._id}
                  name={item.name}
                  price={item.price}
                  index={idx}
                  coverImage={item.coverImage}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default UserCommunities;
