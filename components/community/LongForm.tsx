import { icons } from "@/constants/icons";
import { LongFormContent } from "@/types/community";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PaymentModal from "../modals/PaymentModal";

// const { width, height } = Dimensions.get("window");

interface LongFormCardProps {
  content: LongFormContent;
  onPress: () => void;
}

const LongFormCard: React.FC<LongFormCardProps> = ({ content, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className=" max-w-lg mb-4 mx-1  "
      activeOpacity={0.8}
    >
      <View className="relative   rounded-[15px] overflow-hidden">
        <Image
          source={{ uri: content.thumbnail }}
          className="rounded-[15px] aspect-[1/0.55] w-full "
          resizeMode="cover"
        />

        {content.isLocked && (
          <BlurView
            intensity={30}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 16,
            }}
          />
        )}

        <View className="absolute inset-0 items-center justify-center">
          <View className="w-24 h-24 rounded-full items-center justify-center  overflow-hidden border-white border-2">
            <BlurView
              style={StyleSheet.absoluteFill}
              tint="light"
              intensity={80}
              className=" rounded-full"
            />
            <View className="w-10  h-10 rounded-full  items-center justify-center">
              <Image
                source={icons.lockedContent}
                alt="icons"
                className="w-full "
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        <View className="absolute bottom-3 right-3 bg-black/80 rounded-2xl p-2">
          <Text className="text-white font-sfpro-medium text-[13px]">
            {content.duration}
          </Text>
        </View>
      </View>

      <View className="flex-row  items-center justify-between py-2  mt-2">
        <View className=" w-[80%]">
          <Text className="text-white text-[20px] font-sfpro-medium ">
            {content.title}
          </Text>

          <Text className="text-white/40 text-base font-sfpro-medium">
            54m views . 5 months ago
          </Text>
        </View>
        <Feather name="more-vertical" size={25} color="white" />
      </View>
    </TouchableOpacity>
  );
};

interface LongFormProps {
  content?: LongFormContent[];
}

const LongForm: React.FC<LongFormProps> = ({ content }) => {
  const [selectedContent, setSelectedContent] =
    useState<LongFormContent | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleContentPress = (item: LongFormContent) => {
    if (item.isLocked) {
      setSelectedContent(item);
      setShowPaymentModal(true);
    } else {
      console.log("Play content:", item.title);
    }
  };

  const handlePayment = (item: LongFormContent) => {
    console.log("Processing payment for:", item.title, "Amount:", item.price);
    setShowPaymentModal(false);
    setSelectedContent(null);
  };

  const closeModal = () => {
    setShowPaymentModal(false);
    setSelectedContent(null);
  };

  if (!content || content.length === 0) {
    // Empty state
    return (
      <View className="  pb-20 items-center">
        <View className="rounded-xl p-4 mb-4">
          <View className="h-16 w-16 bg-gray-700 rounded-xl items-center justify-center">
            <Feather name="lock" size={32} color="#9CA3AF" />
          </View>
        </View>

        <Text className="text-white text-[18px] font-semibold mb-2">
          No longform content yet
        </Text>
        <Text className="text-gray-400 text-[14px] text-center mb-6">
          Premium content will appear here{"\n"}when available
        </Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={content}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LongFormCard
            content={item}
            onPress={() => handleContentPress(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: 20,
        }}
      />

      <PaymentModal
        visible={showPaymentModal}
        content={selectedContent}
        onClose={closeModal}
        onPay={handlePayment}
      />
    </>
  );
};

export default LongForm;
