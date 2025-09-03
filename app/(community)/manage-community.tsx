import AllPosts from "@/components/community/AllPosts";
import CommunityCategory from "@/components/community/CommunityCategory";
import CommunityDetails from "@/components/community/CommunityDetails";
import CommunityDropdown from "@/components/community/CommunityDropdown";
import CommunityGuidelines from "@/components/community/GuildeLines";
import LongForm from "@/components/community/LongForm";
import Pricing from "@/components/community/Pricing";
import Privacy from "@/components/community/Privacy";
import AddModerators from "@/components/modals/AddModerators";
import ModeratorsModal from "@/components/modals/Moderators";
import UploadContentModal from "@/components/modals/UploadContentModal";
import ProgressiveBlur from "@/components/ui/progressiveBlur";
import {
  dummyAllPosts,
  dummyLongFormContent,
  moderators,
} from "@/constants/data";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Feather, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
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
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const CommunityManager: React.FC = () => {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showAddModerators, setShowAddModerators] = useState(false);
  const [showModerators, setShowModerators] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [activePostType, setActivePostType] = useState<string>("all");
  const [posts] = useState(dummyAllPosts);

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
        return <CommunityDetails onClose={() => setActiveComponent(null)} />;
      case "pricing":
        return <Pricing onClose={() => setActiveComponent(null)} />;
      case "privacy":
        return <Privacy onClose={() => setActiveComponent(null)} />;
      case "guideline":
        return <CommunityGuidelines onClose={() => setActiveComponent(null)} />;
      case "category":
        return <CommunityCategory onClose={() => setActiveComponent(null)} />;
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
            onPress={() => setDropdownVisible(true)}
            className="h-14 w-14 overflow-hidden border-white/30 border rounded-full bg-black/20 items-center justify-center z-20"
            activeOpacity={0.7}
          >
            <Feather name="more-vertical" size={20} color="#fff" />
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

      <ScrollView
        className="flex-1 relative z-[90]"
        style={{ paddingTop: insets.top }}
        showsVerticalScrollIndicator={false}
      >
        {/* <ProgressiveBlur useAlt={false} /> */}

        <View className="relative  z-[10]   mt-20 ">
          {/* Community Info Overlay */}
          <View className="gap-4 items-center">
            <View className="bg-[#FFFFFF12]/[7%] p-4 rounded-full flex-row items-center mb-3">
              <Text className="text-white font-bold mr-2 text-[16px]">
                Edit image
              </Text>
            </View>
            <View className="rounded-full h-32 w-32 relative">
              <Image
                source={images.img11}
                className="w-full h-full rounded-full"
                resizeMode="cover"
              />

              {/* Edit icon container */}
              <View
                className="absolute bottom-0 right-0 rounded-full p-2.5 border border-[#FFFFFF0D]/[5%]"
                style={{
                  backgroundColor: "rgba(0,0,0,0.7)",
                  shadowColor: "#0000000A",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 2,
                  elevation: 2,
                }}
              >
                <View
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    borderRadius: 9999,
                    backgroundColor: "rgba(0,0,0,0.04)",
                  }}
                  pointerEvents="none"
                />

                <Feather name="edit-3" size={18} color="white" />
              </View>
            </View>

            <Text className="text-white text-3xl font-bold  text-center">
              Dance Mania - California
            </Text>

            <View className="flex-row items-center ">
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

        {/* <View className="px-2 mb-6">
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
        </View> */}

        <View className="px-6 mb-8">
          <TouchableOpacity
            onPress={() => setShowUpload(true)}
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
            {bottomNavItems.map((item, index) => (
              <TouchableOpacity
                key={item.key}
                onPress={() => setActivePostType(item.key)}
                className="items-center shrink w-full"
                activeOpacity={0.8}
              >
                <View className="w-8 h-8 rounded-2xl items-center justify-center mb-2">
                  <Image
                    source={item.icon}
                    className={`h-full w-full ${
                      item.active ? "opacity-100" : "opacity-40"
                    }`}
                  />
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

        {activePostType === "all" && (
          <AllPosts posts={posts} addPost={() => setShowUpload(true)} />
        )}
        {activePostType === "creators" && (
          <AllPosts posts={posts} addPost={() => setShowUpload(true)} />
        )}
        {activePostType === "longform" && (
          <LongForm
            content={dummyLongFormContent}
            addPost={() => setShowUpload(true)}
          />
        )}
      </ScrollView>

      <Modal
        visible={activeComponent !== null}
        transparent
        animationType="slide"
        onRequestClose={closeComponent}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeComponent}
          />
          <View style={styles.modalContent}>{renderActiveComponent()}</View>
        </View>
      </Modal>

      <CommunityDropdown
        visible={dropdownVisible}
        onClose={() => setDropdownVisible(false)}
        onEdit={() => console.log("Edit pressed")}
        onMembers={() => setShowModerators(true)}
        onPause={() => console.log("Pause pressed")}
        onModerators={() => setShowModerators(true)}
        onNewRequests={() => console.log("New requests pressed")}
        onDelete={() => console.log("Delete pressed")}
      />

      <AddModerators
        visible={showAddModerators}
        onClose={() => setShowAddModerators(false)}
        onAddModerator={(moderatorData) => {
          console.log("New moderator:", moderatorData);
        }}
      />

      <ModeratorsModal
        visible={showModerators}
        onClose={() => setShowModerators(false)}
        moderators={moderators}
        onCancelRequest={(id) => setShowModerators(false)}
        onAddModerator={() => setShowModerators(false)}
      />

      <UploadContentModal
        visible={showUpload}
        onClose={() => setShowUpload(false)}
        onPost={(contentData) => {
          console.log("Posting:", contentData);
          setShowUpload(false);
        }}
      />
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
