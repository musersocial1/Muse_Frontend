import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const screenPadding = 16;

interface Subscriber {
  id: string;
  name: string;
  avatar: ImageSourcePropType;
  totalSpend: number;
  currency?: string;
}

const subscriberDummyData: Subscriber[] = [
  { id: "1", name: "Vivian taylr", avatar: images.img10, totalSpend: 343 },
  { id: "2", name: "Vivian taylr", avatar: images.img11, totalSpend: 1143 },
  { id: "3", name: "Vivian taylr", avatar: images.img8, totalSpend: 587 },
  { id: "4", name: "Vivian taylr", avatar: images.img12, totalSpend: 343 },
  { id: "5", name: "Vivian taylr", avatar: images.img13, totalSpend: 912 },
  { id: "6", name: "Vivian taylr", avatar: images.img14, totalSpend: 343 },
  { id: "7", name: "Vivian taylr", avatar: images.img6, totalSpend: 343 },
  { id: "8", name: "Vivian taylr", avatar: images.img5, totalSpend: 126 },
  { id: "9", name: "Vivian taylr", avatar: images.img9, totalSpend: 343 },
  { id: "10", name: "Vivian taylr", avatar: images.img7, totalSpend: 669 },
];

const SpendPill = ({ amount }: { amount: number }) => (
  <View className="px-3 py-1 rounded-full bg-[#3E3E3E]">
    <Text className="text-white text-[13px] font-sfpro-bold">${amount}</Text>
  </View>
);

const SubscriberItem = ({
  item,
  index,
}: {
  item: Subscriber;
  index: number;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      className="flex-row items-center justify-between bg-[#242424] rounded-[40px] px-2 py-3 mb-4"
    >
      <View className="flex-row items-center flex-1">
        <View className="w-14 h-14 rounded-full overflow-hidden mr-3 bg-[#262626]">
          <Image
            source={item.avatar}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <Text
          numberOfLines={1}
          className="text-white text-[16px] font-sfpro-bold"
          style={{ maxWidth: width * 0.35 }}
        >
          {item.name}
        </Text>
      </View>

      <View className="flex-row items-center">
        <Text className="text-white/60 text-[13px] mr-2 font-sfpro-medium">
          Total spend of
        </Text>
        <SpendPill amount={item.totalSpend} />
        <Feather
          name="chevron-right"
          size={20}
          color="#777"
          style={{ marginLeft: 8, opacity: 0.55 }}
        />
      </View>
    </TouchableOpacity>
  );
};

const SubscriberBreakdown = () => {
  return (
    <View className="mt-10 bg-[#1C1C1C] rounded-3xl px-3 py-5">
      <Text className="text-white/50 text-[17px] font-sfpro-bold ml-3 mb-5">
        Subscribers breakdown
      </Text>

      <View>
        {subscriberDummyData.map((sub, idx) => (
          <SubscriberItem key={sub.id} item={sub} index={idx} />
        ))}
      </View>
    </View>
  );
};

const Cashflow = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#121212]">
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-3">
          <TouchableOpacity
            onPress={() => router.push(RouterConstantUtil.tabs.profile)}
            className="w-14 h-14 rounded-full bg-[#363636] border border-[#585858] items-center justify-center"
          >
            <Feather name="chevron-left" size={25} color="#fff" />
          </TouchableOpacity>

          <Text className="text-white text-[25px] font-bold">Cashflow</Text>

          <View className="w-10" />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: screenPadding,
            paddingBottom: 48,
          }}
          className="mt-4"
        >
          {/* Community header */}
          <View className="items-center ">
            <View className="w-[120px] h-[120px] rounded-full overflow-hidden my-7">
              <Image
                source={icons.dp}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <Text className="text-white text-[23px] font-sfpro-bold">
              Dance mania california
            </Text>
            <Text className="text-white/50 text-[14px] mt-1 font-medium">
              Created 1st March, 2025
            </Text>
          </View>

          {/* subscription breakdown here */}
          <SubscriberBreakdown />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Cashflow;
