import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DragToClose from "../navigations/DragToClose";
import { FadingBlurBackground } from "../ui/FadingBlurBackground";

interface CommunityLink {
  id: string;
  platform: string;
  url: string;
  displayUrl: string;
}

interface CommunityLinksModalProps {
  visible: boolean;
  onClose: () => void;
  links?: CommunityLink[];
}

const defaultLinks: CommunityLink[] = [
  {
    id: "1",
    platform: "X",
    url: "https://x.com/dancecommunity",
    displayUrl: "X.com",
  },
  {
    id: "2",
    platform: "Facebook",
    url: "https://facebook.com/dancecommunity",
    displayUrl: "facebook.com",
  },
  {
    id: "3",
    platform: "Cameo surgery",
    url: "https://cameosurgery.com",
    displayUrl: "Cameo surgery.com",
  },
  {
    id: "4",
    platform: "Instagram",
    url: "https://instagram.com/dancecommunity",
    displayUrl: "Instagram.com",
  },
];

interface LinkItemProps {
  link: CommunityLink;
  onPress: (url: string) => void;
}

const LinkItem: React.FC<LinkItemProps> = ({ link, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(link.url)}
      className="bg-[#00000040]/[20%]  rounded-[20px] p-4  flex-row items-center justify-between"
      activeOpacity={0.8}
    >
      <View className="flex-1">
        <Text className="text-white text-base font-sfpro-bold mb-1">
          {link.platform}
        </Text>
        <Text className="text-white/50 font-medium text-[15px]">
          {link.displayUrl}
        </Text>
      </View>

      <View className="bg-[#FFFFFF0F]/[6%] rounded-full px-4 py-2.5 flex-row items-center">
        <Feather name="link" size={18} color="white" className="" />
        <Text className="text-white text-base font-sfpro-medium ml-2">
          Open links
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const CommunityLinksModal: React.FC<CommunityLinksModalProps> = ({
  visible,
  onClose,
  links = defaultLinks,
}) => {
  const handleLinkPress = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log("Cannot open URL:", url);
      }
    } catch (error) {
      console.error("Error opening URL:", error);
    }
  };

  const insets = useSafeAreaInsets();

  const HIDE_OFFSET = 800; // how far we start below

  // Shared translateY for the sheet
  const sheetY = useRef(new Animated.Value(HIDE_OFFSET)).current;

  // Animate sheet up when opening
  useEffect(() => {
    if (visible) {
      sheetY.setValue(HIDE_OFFSET);
      Animated.timing(sheetY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      sheetY.setValue(HIDE_OFFSET);
    }
  }, [visible]);

  // Blur opacity follows sheet position (down → fade out)
  const blurOpacity = sheetY.interpolate({
    inputRange: [0, HIDE_OFFSET],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  // Optional programmatic close (slide down then onClose)
  const closeWithSlide = () => {
    Animated.timing(sheetY, {
      toValue: HIDE_OFFSET,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => onClose());
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1 ">
        <TouchableOpacity
          activeOpacity={1}
          style={StyleSheet.absoluteFill}
          onPress={closeWithSlide}
        >
          <FadingBlurBackground opacity={blurOpacity} />
        </TouchableOpacity>
        <View
          pointerEvents="box-none"
          style={{ marginBottom: insets.bottom }}
          className="flex-1 pb-3 px-3  items-center justify-end"
        >
          <Animated.View
            style={{
              transform: [{ translateY: sheetY }],
              width: "100%",
            }}
            className="w-full   max-w-lg"
          >
            <View className="bg-[#1E1E1E] rounded-[30px] overflow-hidden">
              <DragToClose translateY={sheetY} onClose={onClose} />

              <Text className="text-white  text-xl font-bold text-center  ">
                Community links
              </Text>

              <ScrollView
                className=" p-6 "
                showsVerticalScrollIndicator={false}
              >
                <View className=" gap-4">
                  {links.map((link) => (
                    <LinkItem
                      key={link.id}
                      link={link}
                      onPress={handleLinkPress}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

export default CommunityLinksModal;
