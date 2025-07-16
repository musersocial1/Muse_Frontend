import { icons } from "@/constants/icons";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const Profile = () => {
  const router = useRouter();

  const ProfileHeader = () => (
    <View className="items-center pt-6 pb-8">
      <View className="relative">
        <Image
          source={icons.user}
          style={{ width: width * 0.3, height: width * 0.3, borderRadius: 100 }}
        />
      </View>
      <Text className="text-white text-[20px] font-bold mt-4">Dreya James</Text>
      <Text className="text-gray-400 text-[15px] font-medium">Dreyajames</Text>
    </View>
  );

  const ProfileStats = () => (
    <View
      style={{ marginHorizontal: width * 0.05 }}
      className="space-y-4 gap-3"
    >
      {[
        {
          label: "Communities",
          icon: icons.users,
          route: RouterConstantUtil.profile.communities,
          rightText: "3",
        },
        {
          label: "Your email",
          icon: icons.email,
          route: RouterConstantUtil.profile.email,
          rightText: "Dreyajames@gmail.com",
        },
        {
          label: "Username",
          icon: icons.user_icon,
          route: RouterConstantUtil.profile.username,
          rightText: "Dreyajames",
        },
      ].map((item, i) => (
        <TouchableOpacity
          key={i}
          className="flex-row items-center justify-between py-4 px-4 bg-[#1C1C1C] rounded-full"
          onPress={() => router.replace(item.route as any)}
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-white/10 rounded-full items-center justify-center mr-4">
              <Image
                source={item.icon}
                className="w-5 h-5"
                tintColor="#9CA3AF"
              />
            </View>
            <Text className="text-gray-400 text-base">{item.label}</Text>
          </View>
          <View className="flex-row items-center max-w-[50%]">
            <View className="flex-row items-center flex-shrink">
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="text-white text-base font-medium mr-2 flex-shrink"
              >
                {item.rightText}
              </Text>
              <ChevronRight color={"white"} opacity={30} size={20} />
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const SavedPostsSection = () => (
    <View style={{ marginHorizontal: width * 0.05 }} className="mt-10">
      <Text className="text-white text-xl font-semibold mb-4">Saved posts</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row space-x-3">
          {[1, 2, 3, 4, 5].map((item) => (
            <View
              key={item}
              className="w-16 h-16 bg-[#FFFFFF]/10 rounded-full"
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const ProfileScreen = () => (
    <View className="flex-1 bg-[#121212]">
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1">
        <View
          className="flex-row items-center justify-between py-4"
          style={{ paddingHorizontal: width * 0.05 }}
        >
          <TouchableOpacity
            className="items-center justify-center"
            style={{ width: width * 0.12, height: width * 0.12 }}
          >
            <Image
              source={icons.back}
              style={{ width: width * 0.12, height: width * 0.12 }}
            />
          </TouchableOpacity>
          <Text className="text-white text-[20px] font-bold">Profile</Text>
          <TouchableOpacity
            className="items-center justify-center"
            style={{ width: width * 0.12, height: width * 0.12 }}
            onPress={() =>
              router.replace(RouterConstantUtil.profile.settings as any)
            }
          >
            <Image
              source={icons.settings}
              style={{ width: width * 0.12, height: width * 0.12 }}
            />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1">
          <ProfileHeader />
          <ProfileStats />
          <SavedPostsSection />
        </ScrollView>
      </SafeAreaView>
    </View>
  );

  return <ProfileScreen />;
};

export default Profile;
