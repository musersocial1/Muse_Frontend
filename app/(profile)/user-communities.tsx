import { icons } from "@/constants/icons";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { Link, useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CommunityItem = ({
  name,
  members,
}: {
  name: string;
  members: number | string;
}) => (
  <Link href={RouterConstantUtil.profile.subscriptioninfo as any}>
    <View className="flex-row items-center py-4  bg-[#1C1C1C] rounded-full p-3.5 ">
      <View className="w-12 h-12 rounded-full  items-center justify-center mr-4 overflow-hidden">
        <Image source={icons.dp} className="w-full h-full" resizeMode="cover" />
      </View>

      <View className="flex-1">
        <Text className="text-gray-400 font-bold text-[18px]">{name}</Text>
      </View>
      <View className="flex-row items-center max-w-[50%]">
        <Text
          numberOfLines={1}
          className="text-white text-[20px] font-bold mr-2"
        >
          {members}
        </Text>
        <ChevronRight color={"gray"} opacity={30} size={20} />
      </View>
    </View>
  </Link>
);

const UserCommunities = () => {
  const router = useRouter();
  return (
    <View className="flex-1 bg-[#121212]">
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center justify-between px-6 py-4">
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

        <View className="flex-row items-center justify-between px-3 py-4 ">
          <Text className="text-gray-400 px-6 my-6">
            Showing all communities
          </Text>
          <View className="w-10 h-10 rounded-full bg-[#FFFFFF17]/10 items-center justify-center">
            <Text className="text-white/70 font-bold">3</Text>
          </View>
        </View>

        <ScrollView className="px-4">
          <View className="space-y-4 gap-4">
            <CommunityItem name="Beatrix" members="$36" />
            <CommunityItem name="Valorant" members="$59" />
            <CommunityItem name="Guardians" members="$84" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default UserCommunities;

const styles = StyleSheet.create({});
