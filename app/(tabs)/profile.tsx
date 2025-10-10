import { icons } from "@/constants/icons";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { useAuthState } from "@/hooks/useAuthState";
import { useProfileActions } from "@/hooks/useProfile";
import { communityAPI } from "@/lib/api/community";
import { Feather } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";

import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface ProfileHeaderProps {
  firstName?: string;
  lastName?: string;
  username?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  firstName,
  lastName,
  username,
}) => {
  const fullName =
    firstName && lastName
      ? `${firstName} ${lastName}`
      : firstName || lastName || "User";

  return (
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
        {fullName}
      </Animatable.Text>
      <Animatable.Text
        animation="fadeIn"
        delay={180}
        duration={250}
        className="text-gray-400 text-[15px] font-medium"
      >
        {username || "Username"}
      </Animatable.Text>
    </Animatable.View>
  );
};

interface ProfileStatsProps {
  router: any;
  email?: string;
  username?: string;
  communityCount: number;
}

const CommunityStats: React.FC = () => {
  const statItems = [
    {
      label: "Your community analytics",
      icon: icons.users,
      route: RouterConstantUtil.profile.analytics,
    },
    {
      label: "Community cashflow",
      icon: icons.email,
      route: RouterConstantUtil.profile.cashflow,
    },
  ];

  return (
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
                <Feather
                  name="chevron-right"
                  size={20}
                  color="white"
                  style={{ opacity: 0.7 }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </Animatable.View>
      ))}
    </Animatable.View>
  );
};

const ProfileStats: React.FC<ProfileStatsProps> = ({
  router,
  email,
  username,
  communityCount,
}) => {
  const statItems = [
    {
      label: "Communities",
      icon: icons.users,
      route: RouterConstantUtil.profile.communities,
      rightText: communityCount || 0,
    },
    {
      label: "Your email",
      icon: icons.email,
      route: RouterConstantUtil.profile.email,
      rightText: email || "No email provided",
    },
    {
      label: "Username",
      icon: icons.user_icon,
      route: RouterConstantUtil.profile.username,
      rightText: username || "No username",
    },
  ];

  return (
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
              </View>
            </View>
          </TouchableOpacity>
        </Animatable.View>
      ))}
    </Animatable.View>
  );
};

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
  const { user, isLoading, error, clearError } = useAuthState();
  const [community, setCommunity] = useState<any[]>([]);

  const { username, lastName, firstName, email } = user || {};
  const { refetchProfile } = useProfileActions();

  const fetchCommunities = async () => {
    try {
      const res = await communityAPI.getMyCommunity();
      console.log(res, "tyyy re");
      setCommunity(res.community);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       await refetchProfile();
  //     } catch (error) {
  //       console.error("Error fetching profile:", error);
  //       showError("Error", "Error fetching profile");
  //     }
  //   };

  //   fetchProfile();
  //   fetchCommunities();
  // }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <View
        className="flex-row items-center justify-between pb-4"
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

      <ScrollView className="flex-1">
        <ProfileHeader
          firstName={firstName}
          lastName={lastName}
          username={username}
        />
        <CommunityStats />
        <View className="border border-white/5 my-10 w-full max-w-[90%] mx-auto" />
        <ProfileStats
          router={router}
          email={email}
          username={username}
          communityCount={community?.length}
        />
        <SavedPostsSection />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
