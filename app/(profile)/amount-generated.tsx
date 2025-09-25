import { Feather } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
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
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";

import AvatarStack from "@/components/analytics/AvatarStack";
import BarComparisonChart from "@/components/analytics/ComparisonChart";
import { images } from "@/constants/images";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";

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

const SectionHeader = ({
  title,
  rightLabel,
  desc,
}: {
  title: string;
  rightLabel?: string;
  desc?: string;
}) => (
  <View className="flex-row items-center justify-between mb-3">
    <View className="flex-1">
      <Text className="text-white text-[18px] font-sfpro-bold">{title}</Text>
      {!!desc && (
        <Text className="text-white/60 text-[13px] font-sfpro-regular pt-1">
          {desc}
        </Text>
      )}
    </View>

    {rightLabel ? (
      <TouchableOpacity className="flex-row items-center bg-[#353535] px-4 py-3 rounded-full">
        <Text className="text-white/80 mr-2 font-sfpro-medium">
          {rightLabel}
        </Text>
        <Feather name="chevron-down" size={16} color="#8E8E8E" />
      </TouchableOpacity>
    ) : (
      <View />
    )}
  </View>
);

const SpendPill = ({ amount }: { amount: number }) => (
  <View className="px-3 py-1 rounded-full bg-[#3E3E3E]">
    <Text className="text-white text-[13px] font-sfpro-bold">${amount}</Text>
  </View>
);

const SubscriberItem = ({ item }: { item: Subscriber; index: number }) => (
  <TouchableOpacity
    onPress={() => router.push(RouterConstantUtil.profile.subscriptioninfo)}
    activeOpacity={0.85}
    className="flex-row items-center justify-between bg-[#242424] rounded-[40px] px-3 py-3 mb-4"
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

const SubscriberBreakdown = () => (
  <View className="mt-4 bg-[#1C1C1C] rounded-3xl px-3 py-5">
    <Text className="text-white/60 text-[17px] font-sfpro-bold ml-3 mb-5">
      Subscribers breakdown
    </Text>

    <View>
      {subscriberDummyData.map((sub, idx) => (
        <SubscriberItem key={sub.id} item={sub} index={idx} />
      ))}
    </View>
  </View>
);

const PositiveBadge = ({ text }: { text: string }) => (
  <View className="px-2 py-1 rounded-full bg-[#16391F]">
    <Text className="text-[#2AD05A] text-[12px] font-sfpro-bold">{text}</Text>
  </View>
);

const BalanceCard = () => {
  const currentBalance = 1248.67;
  const growthPct = 3.2;
  const allTime = 84.62;

  return (
    <View
      className="w-full rounded-[34px] bg-[#1C1C1C] mb-2 overflow-hidden"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.4,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 8 },
        elevation: 10,
      }}
    >
      <View className="px-6 pt-7 pb-8">
        <Text className="text-white/55 text-[15px] font-sfpro-medium mb-2 text-center">
          Current Balance
        </Text>
        <Text className="text-white text-[44px] font-sfpro-bold leading-tight text-center">
          $
          {currentBalance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </Text>

        <View className="flex-row items-center mt-2 mb-6 text-center justify-center">
          <Text className="text-[#2AD05A] text-[15px] font-sfpro-semibold mr-1">
            {growthPct}%
          </Text>
          <Text className="text-[#2AD05A] text-[15px] font-sfpro-medium mr-2">
            up
          </Text>
          <Text className="text-white/55 text-[15px] font-sfpro-medium">
            • This month
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          className="bg-[#0368FF] rounded-full py-5 px-6 items-center justify-center w-full max-w-[200px] mx-auto"
        >
          <Text className="text-white text-[16px] font-sfpro-bold">
            Request payout
          </Text>
        </TouchableOpacity>
      </View>

      <View className="bg-[#262626]  py-5 w-full max-w-[80%] mx-auto rounded-3xl mb-6">
        <Text className="text-white/55 text-[15px] font-sfpro-medium mb-2 text-center">
          All time
        </Text>
        <Text className="text-white text-[28px] font-sfpro-bold text-center">
          ${allTime.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Text>
      </View>
    </View>
  );
};

const AmountGenerated = () => {
  const router = useRouter();

  // Chart dummy data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const subscribersCurrent = [120000, 260000, 90000, 60000, 520000, 650000];
  const subscribersPrev = [80000, 140000, 60000, 30000, 180000, 540000];

  return (
    <View className="flex-1 bg-[#121212]">
      <SafeAreaView edges={["top"]} className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-14 h-14 rounded-full bg-[#363636] border border-[#585858] items-center justify-center"
          >
            <Feather name="chevron-left" size={25} color="#fff" />
          </TouchableOpacity>

          <Text className="text-white text-[25px] font-sfpro-bold">
            Amount Generated
          </Text>

          <View className="w-10" />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: screenPadding,
            paddingBottom: 40,
          }}
          className="mt-4"
        >
          {/* New Balance Card */}
          <BalanceCard />

          {/* Subscribers Section */}
          <View className="mt-2 bg-[#1C1C1C] rounded-3xl p-4">
            <SectionHeader
              title="Subscribers"
              rightLabel="Last 6 months"
              desc="Paid members analytics"
            />

            <View className="rounded-3xl py-2">
              <View className="mb-4">
                <Text className="text-white text-[32px] font-sfpro-bold">
                  456k
                </Text>
                <Text className="text-white/60 text-[12px] font-sfpro-regular">
                  Total subscribers
                </Text>
              </View>

              {/* Floating stat pill over chart */}
              <Animatable.View
                animation="fadeInUp"
                delay={180}
                className="absolute right-4 top-[70px] z-10"
              >
                <View className="flex-row items-center bg-[#262626] border border-[#2B2B2B] px-2.5 py-2 rounded-xl">
                  <AvatarStack
                    size={20}
                    images={[
                      images.img8,
                      images.img14,
                      images.img11,
                      images.img10,
                    ]}
                  />
                  <Text className="text-white/90 text-[12px] mx-2 font-sfpro-medium">
                    +234k
                  </Text>
                  <PositiveBadge text="+3.4%" />
                </View>
              </Animatable.View>

              <BarComparisonChart
                width={width - screenPadding * 2 - 32}
                height={320}
                labels={months}
                current={subscribersCurrent}
                previous={subscribersPrev}
                barColor="#20AB5A"
                prevBarColor="#404040"
                gridColor="#2A2A2A"
              />
            </View>
          </View>

          <SubscriberBreakdown />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default AmountGenerated;
