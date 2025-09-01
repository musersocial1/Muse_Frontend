import { LongFormContent } from "@/types/community";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
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
      className="mx-6 mb-4  "
      activeOpacity={0.8}
    >
      <View className="relative rounded-2xl overflow-hidden">
        <Image
          source={{ uri: content.thumbnail }}
          style={{
            // width: width - 48,
            height: 180,
          }}
          className="rounded-2xl"
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
          <View className="w-16 h-16 rounded-full bg-[#FFFFFF24]/[14%] items-center justify-center border border-[#FFFFFF4D]/[30%]">
            <View className="w-12 h-12 rounded-full  items-center justify-center">
              <Feather name="lock" size={24} color="white" />
            </View>
          </View>
        </View>

        <View className="absolute bottom-3 right-3 bg-black/80 rounded-2xl p-2">
          <Text className="text-white text-[12px] font-medium">
            {content.duration}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center justify-between py-2  mt-2">
        <Text className="text-white text-[20px] font-medium flex-shrink">
          {content.title}
        </Text>
        <Feather name="more-vertical" size={22} color="white" />
      </View>

      <Text className="text-gray-500 text-[16px] font-medium">
        54m views . 5 months ago
      </Text>
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
      <View className="px-6 pb-20 items-center">
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
