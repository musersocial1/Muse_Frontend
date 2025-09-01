import AllPosts from "@/components/community/AllPosts";
import LongForm from "@/components/community/LongForm";
import CommunityLinksModal from "@/components/modals/CommunityLinksModal";
import SubscriptionFlow from "@/components/modals/Subscribe";
import ProgressiveBlur from "@/components/ui/progressiveBlur";
import { dummyAllPosts, dummyLongFormContent } from "@/constants/data";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const UserViewCommunity: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showLinksModal, setShowLinksModal] = useState(false);
  const [activePostType, setActivePostType] = useState<string>("all");
  const slideAnim = useRef(new Animated.Value(height)).current;

  const [posts] = useState(dummyAllPosts);

  const handleSubscription = () => {
    console.log("whatever here");
  };

  const bottomNavItems = [
    {
      icon: icons.posts,
      title: "All posts",
      active: activePostType === "all",
      key: "all",
    },
    {
      icon: icons.user,
      title: "Creators posts",
      active: activePostType === "creators",
      key: "creators",
    },
    {
      icon: icons.lock_2,
      title: "Longform",
      active: activePostType === "longform",
      key: "longform",
    },
  ];

  return (
    <View className="flex-1 bg-primary">
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            zIndex: 1,
            height: 1500,
          },
        ]}
      >
        <ProgressiveBlur useAlt={false} />
        <View className="w-full aspect-[1/1.5]">
          {/* <Image
            source={images.img23}
            className="w-full h-full"
            resizeMode="cover"
          /> */}
        </View>
      </Animated.View>

      <ScrollView
        className="flex-1 relative z-[100]"
        style={{ paddingTop: insets.top }}
        showsVerticalScrollIndicator={false}
      >
        <View className="relative h-96 mb-10">
          <View className="absolute top-4 left-0 right-0 flex-row justify-between items-center px-6 z-10">
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              className="h-14 w-14 overflow-hidden border-white/30 border rounded-full bg-black/20 items-center justify-center z-20"
            >
              <BlurView style={[StyleSheet.absoluteFill]} />
              <Feather
                name="chevron-left"
                size={20}
                color="#fff"
                style={{ opacity: 0.7 }}
              />
            </TouchableOpacity>

            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => console.log("Share pressed")}
                activeOpacity={0.7}
                className="h-14 w-14 overflow-hidden border-white/30 border rounded-full bg-black/20 items-center justify-center z-20"
              >
                <BlurView
                  intensity={10}
                  style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
                />
                <Feather name="share" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Community Info Overlay */}
          <View className="absolute top-20 bottom-0 left-0 right-0 p-6 items-center ">
            <View className="rounded-full h-32 w-32 ">
              <Image
                source={images.img11}
                className="w-full h-full rounded-full"
                resizeMode="cover"
              />
            </View>
            <Text className="text-white text-[32px] font-bold mb-3 text-center">
              Dance Mania - California
            </Text>

            <View className="flex-row items-center mb-4">
              <View className="w-8 h-8 rounded-full overflow-hidden mr-3">
                <Image
                  source={icons.user}
                  className="w-full h-full"
                  style={{ resizeMode: "cover" }}
                />
              </View>
              <Text className="text-white font-bold text-[16px]">beyonce</Text>
              <View className="w-4 h-4 bg-secondary rounded-full ml-1 items-center justify-center">
                <Feather name="check" size={10} color="white" />
              </View>
            </View>

            <Text className="text-gray-300 text-[16px] leading-6 mb-6 text-center">
              We are thriving dance teaching platform{"\n"}that aims to help you
              grow
            </Text>
            <TouchableOpacity
              className="flex-row items-center justify-center mb-6"
              onPress={() => setShowLinksModal(true)}
            >
              <Feather
                name="link"
                size={14}
                color="white"
                style={{ marginRight: 6 }}
              />
              <Text className="text-[#FFFFFF] text-[16px] leading-6 font-semibold">
                See all community links
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowSubscriptionModal(true)}
              className="bg-[#0368FF] rounded-[20px] py-5 px-8 w-full max-w-sm mx-auto text-center"
              activeOpacity={0.8}
            >
              <Text className="text-white text-[16px] font-bold text-center">
                Subscribe $45/
                <Text className="text-[#FFFFFF80]/[50%]">Monthly</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Navigation */}
        <View className="px-6 mb-6 mt-[25%]">
          <View className="flex-row justify-around">
            {bottomNavItems.map((item) => (
              <TouchableOpacity
                key={item.key}
                onPress={() => setActivePostType(item.key)}
                className="items-center"
                activeOpacity={0.8}
              >
                <View className="w-12 h-12 rounded-2xl items-center justify-center mb-2">
                  <Image source={item.icon} className="h-12 w-12" />
                </View>
                <Text
                  className={`text-[13px] ${
                    item.active ? "text-white" : "text-gray-400"
                  }`}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {activePostType === "all" && <AllPosts posts={posts} />}
        {activePostType === "creators" && <AllPosts posts={posts} />}
        {activePostType === "longform" && (
          <LongForm content={dummyLongFormContent} />
        )}
      </ScrollView>

      <SubscriptionFlow
        visible={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onPay={handleSubscription}
      />

      <CommunityLinksModal
        visible={showLinksModal}
        onClose={() => setShowLinksModal(false)}
      />
    </View>
  );
};

export default UserViewCommunity;
