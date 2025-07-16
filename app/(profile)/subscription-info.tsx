import { icons } from "@/constants/icons";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get("window");

interface MonthlySubscriptionData {
  month: string;
  amount: string;
  paid: boolean;
}

interface SubscriptionInfoProps {
  userName?: string;
  userImage?: any;
  totalSpent?: string;
  subscriptionCycle?: number;
  monthlyData?: MonthlySubscriptionData[];
}

const MonthCard = ({ month, amount, paid }: MonthlySubscriptionData) => (
  <View className="flex-1 min-w-[60px] max-w-[80px] mx-1">
    <ImageBackground
      source={icons.dp}
      className="rounded-2xl overflow-hidden h-20 justify-center items-center"
      resizeMode="cover"
    >
      <View
        className={`absolute inset-0 ${
          paid ? "bg-[#2A2A2A]/70" : "bg-[#1A1A1A]/80"
        }`}
      />

      <View className="p-4 items-center justify-center">
        <Text className="text-brandWhite font-medium text-[16px] mb-1">
          {month}
        </Text>
        <Text className="text-gray-300 text-[12px] font-sfpro-regular">
          {amount}
        </Text>
      </View>
    </ImageBackground>
  </View>
);

const SubscriptionInfo: React.FC<SubscriptionInfoProps> = ({
  userName = "Swifties",
  userImage = icons.dp,
  totalSpent = "$543",
  subscriptionCycle = 3,
  monthlyData = [
    { month: "Jan", amount: "$39", paid: true },
    { month: "Feb", amount: "$39", paid: true },
    { month: "Mar", amount: "-", paid: false },
    { month: "Apr", amount: "$39", paid: true },
    { month: "May", amount: "$39", paid: true },
    { month: "Jun", amount: "$39", paid: true },
    { month: "Jul", amount: "$39", paid: true },
    { month: "Aug", amount: "$39", paid: true },
    { month: "Sep", amount: "$39", paid: true },
    { month: "Oct", amount: "$39", paid: true },
    { month: "Nov", amount: "$39", paid: true },
    { month: "Dec", amount: "$39", paid: true },
  ],
}) => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const handlePauseSubscription = () => {
    console.log("Pausing subscription...");
  };

  const handleLeaveCommunity = () => {
    console.log("Leaving community...");
  };

  return (
    <View className="flex-1 bg-[#121212]">
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity
            onPress={() =>
              router.replace(RouterConstantUtil.profile.communities as any)
            }
            className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center"
          >
            <Image source={icons.back} className="w-14 h-14" />
          </TouchableOpacity>
          <Text className="text-[#FFFFFF] text-[20px] font-bold">
            Subscription info
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="items-center py-8">
            <View className="w-40 h-40 rounded-full overflow-hidden mb-4">
              <Image
                source={userImage}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <Text className="text-white text-[20px] font-bold">{userName}</Text>
          </View>

          {/* Stats Section */}
          <View className=" border-b-[0.3px] border-[#565656] mb-4" />
          <View className="px-4 mb-4 gap-4">
            <View className="p-4 flex-row items-center justify-between py-4 bg-grayish-100 rounded-full ">
              <View className="flex-row items-center ">
                <View className="w-10 h-10 rounded-full items-center justify-center mr-4 bg-[#FFFFFF12]/10 ">
                  <Image source={icons.dollar} className="w-6 h-6" />
                </View>
                <Text className="text-gray-400 text-lg font-bold">
                  Total spent
                </Text>
              </View>
              <Text className="text-white text-xl font-bold">{totalSpent}</Text>
            </View>

            {/* Subscription Cycle */}
            <View className="p-4 flex-row items-center justify-between py-4 bg-grayish-100 rounded-full ">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-[#FFFFFF12]/10 items-center justify-center mr-4">
                  <Image source={icons.ring} className="w-6 h-6" />
                </View>
                <Text className="text-gray-400 text-lg font-bold">
                  Subscription cycle
                </Text>
              </View>
              <Text className="text-white text-xl font-bold">
                {subscriptionCycle}
              </Text>
            </View>
          </View>
          <View className=" border-b-[0.3px] border-[#565656] " />

          <View className="px-4 my-8 ">
            <Text className="text-brandWhite text-[20px] font-bold mb-6 text-center">
              Subscriptions breakdown
            </Text>

            <View className="bg-grayish-100 rounded-[40px]">
              <View className="items-center mb-3 py-4">
                <Text className="text-gray-500 text-lg">2025</Text>
              </View>

              <View className="border-b-[0.3px] border-[#565656] mb-4" />

              {/* Monthly breakdown  */}
              <View className="flex-row flex-wrap justify-between gap-1 mx-3">
                {monthlyData.map((data, index) => (
                  <MonthCard
                    key={index}
                    month={data.month}
                    amount={data.amount}
                    paid={data.paid}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="px-6 pb-8">
            <View className="flex-row justify-between ">
              <TouchableOpacity
                onPress={handlePauseSubscription}
                className="bg-[#0368FF] py-4 rounded-full items-center flex-1 mr-2"
              >
                <Text className="text-white text-[16px] font-bold">
                  Pause subscription
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLeaveCommunity}
                className="bg-white/10 py-4 rounded-full items-center flex-1 ml-2"
              >
                <Text className="text-white font-bold text-[16px]">
                  Leave community
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default SubscriptionInfo;
