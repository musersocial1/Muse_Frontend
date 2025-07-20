import { icons } from "@/constants/icons";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const ProfileHeader = () => (
  <Animatable.View
    animation="fadeInUp"
    duration={350}
    delay={60}
    className="items-center pt-6 pb-8"
    useNativeDriver
  >
    <View className="relative">
      <Image
        source={icons.user}
        style={{ width: width * 0.3, height: width * 0.3, borderRadius: 100 }}
      />
    </View>
    <Animatable.Text
      animation="fadeIn"
      delay={110}
      duration={250}
      className="text-white text-[20px] font-bold mt-4"
    >
      Dreya James
    </Animatable.Text>
    <Animatable.Text
      animation="fadeIn"
      delay={180}
      duration={250}
      className="text-gray-400 text-[15px] font-medium"
    >
      Dreyajames
    </Animatable.Text>
  </Animatable.View>
);

const statItems = [
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
];

const ProfileStats = ({ router }: any) => (
  <Animatable.View
    animation="fadeInUp"
    duration={350}
    delay={90}
    style={{ marginHorizontal: width * 0.05 }}
    className="space-y-4 gap-3"
    useNativeDriver
  >
    {statItems.map((item, i) => (
      <Animatable.View
        key={i}
        animation="fadeInUp"
        duration={250}
        delay={150 + i * 40}
        useNativeDriver
      >
        <TouchableOpacity
          className="flex-row items-center justify-between p-4 bg-[#1C1C1C] rounded-full"
          onPress={() => router.replace(item.route as any)}
          activeOpacity={0.8}
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
              <Feather
                name="chevron-right"
                size={20}
                color="white"
                style={{ opacity: 0.7 }}
              />
              {/* <ChevronRight color={"white"} opacity={30} size={20} /> */}
            </View>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    ))}
  </Animatable.View>
);

const SavedPostsSection = () => (
  <Animatable.View
    animation="fadeIn"
    delay={220}
    duration={400}
    style={{ marginHorizontal: width * 0.05 }}
    className="mt-10"
    useNativeDriver
  >
    <Text className="text-white text-xl font-semibold mb-4">Saved posts</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row space-x-3">
        {[1, 2, 3, 4, 5].map((item, i) => (
          <Animatable.View
            key={item}
            animation="fadeInRight"
            delay={240 + i * 40}
            duration={250}
            useNativeDriver
          >
            <View className="w-16 h-16 bg-[#FFFFFF]/10 rounded-full" />
          </Animatable.View>
        ))}
      </View>
    </ScrollView>
  </Animatable.View>
);

const Profile = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#121212]">
      <StatusBar
        barStyle="light-content"
        backgroundColor="#121212"
        showHideTransition="fade"
      />
      <SafeAreaView className="flex-1 ">
        {/* Header */}
        <View
          className="flex-row items-center justify-between py-4"
          style={{ paddingHorizontal: width * 0.05 }}
        >
          <TouchableOpacity
            className="items-center justify-center"
            style={{ width: width * 0.12, height: width * 0.12 }}
            disabled
          />
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

        {/* Animated Scroll Content */}
        <ScrollView className="flex-1">
          <ProfileHeader />
          <ProfileStats router={router} />
          <SavedPostsSection />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Profile;
