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
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

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

  // const insets = useSafeAreaInsets()
  return (
    <View className="flex-1 bg-primary">
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject]}
        className={`h-[300%]`}
      >
        <ProgressiveBlur useAlt={false} />
        <View className="w-full   aspect-[1/2]">
          <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
            {/* Base vertical gradient */}
            <LinearGradient
              colors={["#c3c9f4", "#d3a6b9", "#0d0b0d"]} // top → mid → bottom
              locations={[0, 0.48, 1]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />

            {/* Vignette overlay (dark corners / bottom) */}
            <Svg style={StyleSheet.absoluteFillObject}>
              <Defs>
                <RadialGradient id="vignette" cx="50%" cy="-15%" r="100%">
                  <Stop offset={0.55} stopColor="#000" stopOpacity={0} />
                  <Stop offset={1} stopColor="#000" stopOpacity={0.85} />
                </RadialGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#vignette)" />
            </Svg>
          </View>
        </View>
      </Animated.View>
      <View
        style={{ top: insets.top + 10 }}
        className="absolute  left-0 right-0 flex-row justify-between items-center px-6 z-[100]"
      >
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

      <ScrollView
        className="flex-1 relative z-[90]"
        style={{ paddingTop: insets.top }}
        showsVerticalScrollIndicator={false}
      >
        <ProgressiveBlur useAlt={false} />
        <View className="relative  z-[10]   mt-20">
          {/* Community Info Overlay */}
          <View className="  gap-4  items-center ">
            <View className="rounded-full h-32 w-32 ">
              <Image
                source={images.img11}
                className="w-full h-full rounded-full"
                resizeMode="cover"
              />
            </View>
            <Text className="text-white text-3xl font-bold  text-center">
              Dance Mania - California
            </Text>

            <View className="flex-row   items-center ">
              <View className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <Image
                  source={icons.user}
                  className="w-full h-full"
                  style={{ resizeMode: "cover" }}
                />
              </View>
              <Text className="text-white font-sfpro-bold text-[17px]">
                Beyonce
              </Text>
              <View className="w-4 h-4 bg-secondary rounded-full ml-1 items-center justify-center">
                <Feather name="check" size={10} color="white" />
              </View>
            </View>

            <Text className="text-white/70 text-[16px]  font-sfpro-medium leading-6  text-center">
              We are thriving dance teaching platform{"\n"}that aims to help you
              grow
            </Text>
            <TouchableOpacity
              className="flex-row items-center justify-center "
              onPress={() => setShowLinksModal(true)}
            >
              <Feather
                name="link"
                size={20}
                color="white"
                style={{ marginRight: 10 }}
              />
              <Text className="text-[#FFFFFF] text-[16px] leading-6 font-sfpro-medium">
                See all community links
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowSubscriptionModal(true)}
              className="bg-[#0368FF] rounded-[20px] py-[22px] px-8 w-[96%] max-w-lg mx-auto text-center"
              activeOpacity={0.8}
            >
              <Text className="text-white  text-[16px] font-sfpro-bold text-center">
                Subscribe $45 /{" "}
                <Text className="text-[#FFFFFF80]/[50%] font-sfpro-medium">
                  Monthly
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Navigation */}
          <View className="    mb-2 z-[10]  mt-9">
            <View className="flex-row px-2 gap-10   w-full flex-nowrap justify-between">
              {bottomNavItems.map((item, index) => (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => setActivePostType(item.key)}
                  className="items-center  shrink  w-full"
                  activeOpacity={0.8}
                >
                  <View className="w-8 h-8  rounded-2xl items-center justify-center mb-2">
                    <Image source={item.icon} className="h-full w-full" />
                  </View>
                  <Text
                    className={`text-[13px] font-sfpro-medium ${
                      item.active ? "text-white" : "text-white/50"
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
        </View>
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
