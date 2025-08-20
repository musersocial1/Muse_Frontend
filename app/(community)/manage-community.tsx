import CommunityCategory from "@/components/community/CommunityCategory";
import CommunityDetails from "@/components/community/CommunityDetails";
import CommunityGuidelines from "@/components/community/GuildeLines";
import Pricing from "@/components/community/Pricing";
import Privacy from "@/components/community/Privacy";
import ProgressiveBlur from "@/components/ui/progressiveBlur";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Feather, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React, { useRef, useState } from "react";

import {
  Animated,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const CommunityManager: React.FC = () => {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const slideAnim = useRef(new Animated.Value(height)).current;

  const openComponent = (componentId: string) => {
    setActiveComponent(componentId);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const closeComponent = () => {
    Animated.spring(slideAnim, {
      toValue: height,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start(() => {
      setActiveComponent(null);
    });
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "bio":
        return <CommunityDetails onClose={closeComponent} />;
      case "pricing":
        return <Pricing onClose={closeComponent} />;
      case "privacy":
        return <Privacy onClose={closeComponent} />;
      case "guideline":
        return <CommunityGuidelines onClose={closeComponent} />;
      case "category":
        return <CommunityCategory onClose={closeComponent} />;
      default:
        return null;
    }
  };

  const actionCards = [
    {
      id: "bio",
      title: "Enter bio",
      subtitle: "Enter more info about your community",
      icon: "create-outline",
      buttonText: "Create Bio",
      action: () => openComponent("bio"),
    },
    {
      id: "pricing",
      title: "Pricing",
      subtitle: "Enter amount to join your community",
      icon: "card-outline",
      buttonText: "Continue",
      action: () => openComponent("pricing"),
    },
    {
      id: "privacy",
      title: "Privacy selection",
      subtitle: "Select privacy settings you want for your community",
      icon: "lock-closed-outline",
      buttonText: "Add Privacy",
      action: () => openComponent("privacy"),
    },
    {
      id: "guideline",
      title: "Enter guideline",
      subtitle: "Enter guideline you want users to follow",
      icon: "book-outline",
      buttonText: "Add Guide",
      action: () => openComponent("guideline"),
    },
    {
      id: "category",
      title: "Select category",
      subtitle: "Select community category type",
      icon: "folder-outline",
      buttonText: "Add Category",
      action: () => openComponent("category"),
    },
  ];

  const renderActionCard = (card: (typeof actionCards)[0], index: number) => (
    <View
      key={card.id}
      className={`mr-4 bg-[#FFFFFF0D]/[5%] rounded-[30px] ${
        index === 0 ? "ml-6" : ""
      } ${index === actionCards.length - 1 ? "mr-6" : ""}`}
    >
      <View className="w-72 p-3">
        <View className="items-start mb-4">
          <View className="w-14 h-14 bg-[#FFFFFF0F]/[6%] border border-[#FFFFFF21]/[13%] rounded-full items-center justify-center mb-4">
            <Ionicons name={card.icon as any} size={24} color="white" />
          </View>

          <Text className="text-white text-[18px] font-bold text-left mb-2">
            {card.title}
          </Text>

          <View className="w-[70%]">
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              className="text-white/60 text-[14px] text-left leading-5"
            >
              {card.subtitle}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={card.action}
          activeOpacity={0.8}
          className="bg-white rounded-full py-3.5 w-full items-center justify-center"
        >
          <Text className="text-[#151115] text-[16px] font-semibold text-center">
            {card.buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const tabItems = [
    { id: "info", title: "Community info", active: true },
    { id: "members", title: "Members", active: false },
    { id: "requests", title: "New requests", active: false },
  ];

  const bottomNavItems = [
    { icon: icons.posts, title: "All posts", active: true },
    { icon: icons.user, title: "Creators posts", active: false },
    { icon: icons.lock_2, title: "Longform", active: false },
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
        <View className="w-full aspect-[1/1.4]">
          <Image
            source={images.bg_2}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      </Animated.View>

      <ScrollView
        className="flex-1 relative z-[100]"
        style={{ paddingTop: insets.top }}
        showsVerticalScrollIndicator={false}
      >
        <View className="relative h-96">
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
                onPress={() => console.log("More options")}
                activeOpacity={0.7}
                className="h-14 w-14 overflow-hidden border-white/30 border rounded-full bg-black/20 items-center justify-center z-20"
              >
                <BlurView
                  intensity={10}
                  style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
                />
                <Feather name="more-horizontal" size={20} color="#fff" />
              </TouchableOpacity>

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
          <View className="absolute bottom-0 left-0 right-0 p-6 items-center">
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
          </View>
        </View>

        <View className="py-6">
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={304}
            snapToAlignment="start"
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {actionCards.map((card, index) => renderActionCard(card, index))}
          </ScrollView>
        </View>

        <View className="px-2 mb-6">
          <View className="flex-row bg-[#FFFFFF0F]/[6%] rounded-2xl p-3">
            {tabItems.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => console.log(`${tab.title} pressed`)}
                className={`flex-1 px-2.5  py-4 rounded-2xl ${
                  tab.active ? "bg-secondary" : ""
                }`}
                activeOpacity={0.8}
              >
                <Text
                  className={`text-center text-[15px] font-medium ${
                    tab.active ? "text-white" : "text-gray-400"
                  }`}
                >
                  {tab.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="px-6 mb-8">
          <TouchableOpacity
            onPress={() => console.log("Add post pressed")}
            className="h-20 items-center justify-center"
            activeOpacity={0.8}
          >
            <View className="w-16 h-16 border-2 border-dashed border-gray-600 rounded-full items-center justify-center">
              <Feather name="plus" size={30} color="#6B7280" />
            </View>
          </TouchableOpacity>
        </View>

        <View className="px-6 mb-6">
          <View className="flex-row justify-around">
            {bottomNavItems.map((item) => (
              <TouchableOpacity
                key={item.icon}
                onPress={() => console.log(`${item.title} pressed`)}
                className="items-center"
                activeOpacity={0.8}
              >
                <View
                  className={`w-12 h-12 rounded-2xl items-center justify-center mb-2 `}
                >
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

        <View className="px-6 pb-20 items-center">
          <View className=" rounded-xl p-4 mb-4">
            <Image source={icons.apps} className="h-16 w-16" />
          </View>

          <Text className="text-white text-[18px] font-semibold mb-2">
            No posts has been uploaded yet
          </Text>
          <Text className="text-gray-400 text-[14px] text-center mb-6">
            Tap on the button below to{"\n"}add the first post
          </Text>

          <TouchableOpacity
            onPress={() => console.log("Make posts pressed")}
            className="bg-[#0368FF] rounded-full py-4 px-8"
            activeOpacity={0.8}
          >
            <Text className="text-white text-[16px] font-semibold">
              Make posts
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={activeComponent !== null}
        transparent
        animationType="none"
        onRequestClose={closeComponent}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeComponent}
          />
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {renderActiveComponent()}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: "#121212",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // maxHeight: height * 0.95,
    // minHeight: height * 0.5,
    height: 800,
  },
});

export default CommunityManager;
