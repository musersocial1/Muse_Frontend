import { icons } from "@/constants/icons";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { Link, useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";

const communities = [
  { name: "Beatrix", members: "$36" },
  { name: "Valorant", members: "$59" },
  { name: "Guardians", members: "$84" },
];

const AnimatedCommunityItem = ({
  name,
  members,
  index,
}: {
  name: string;
  members: number | string;
  index: number;
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
      <View className="flex-row items-center p-3  bg-[#1C1C1C] rounded-full">
        <View className="w-12 h-12 rounded-full  items-center justify-center mr-4 overflow-hidden">
          <Image
            source={icons.dp}
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
            {members}
          </Text>
          <ChevronRight color={"gray"} opacity={30} size={20} />
        </View>
      </View>
    </Link>
  </Animatable.View>
);

const UserCommunities = () => {
  const router = useRouter();
  return (
    <View className="flex-1 bg-[#121212]">
      <SafeAreaView className="flex-1 gap-7">
        <View className="flex-row items-center justify-between px-6 pt-8">
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

        <View className="flex-row items-center justify-between px-3">
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
          <View className="space-y-4 gap-4">
            {communities.map((item, idx) => (
              <AnimatedCommunityItem
                key={item.name}
                name={item.name}
                members={item.members}
                index={idx}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default UserCommunities;

const styles = StyleSheet.create({});
