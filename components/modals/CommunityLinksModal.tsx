import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DragToClose from "../navigations/DragToClose";

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
      className="bg-[#00000040]/[20%] rounded-[30px] p-5 mb-4 flex-row items-center justify-between"
      activeOpacity={0.8}
    >
      <View className="flex-1">
        <Text className="text-white text-[18px] font-semibold mb-1">
          {link.platform}
        </Text>
        <Text className="text-gray-400 font-medium text-[15px]">
          {link.displayUrl}
        </Text>
      </View>

      <View className="bg-[#FFFFFF0F]/[6%] rounded-full px-4 py-2 flex-row items-center">
        <Feather name="link" size={16} color="white" className="mr-2" />
        <Text className="text-white text-[14px] font-medium ml-2">
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <View className="flex-1 justify-end">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <View className="w-[90vw] max-w-[400px]">
              <View className="bg-[#1E1E1E] rounded-3xl overflow-hidden mb-[10vw] max-h-[80vh]">
                <DragToClose onClose={onClose} />

                <Text className="text-white text-[20px] font-bold text-center mb-8">
                  Community links
                </Text>

                <ScrollView
                  className="px-6"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 32 }}
                >
                  {links.map((link) => (
                    <LinkItem
                      key={link.id}
                      link={link}
                      onPress={handleLinkPress}
                    />
                  ))}
                </ScrollView>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
};

export default CommunityLinksModal;
