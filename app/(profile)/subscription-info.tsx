import { icons } from "@/constants/icons";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

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
  <View className="flex-1  mx-1">
    <ImageBackground
      source={icons.dp}
      className="rounded-2xl overflow-hidden  justify-center items-center"
      resizeMode="cover"
    >
      <BlurView
        intensity={Platform.OS === "ios" ? 20 : 70}
        tint="dark"
        className="absolute inset-0"
      />
      <View
        className={`absolute inset-0 ${
          paid ? "bg-[#000000]/60" : "bg-[#2E2E2E]"
        }`}
      />
      <View className="p-4 items-center justify-center">
        <Text className="text-brandWhite font-bold text-[16px]">{month}</Text>
        <Text className="text-white/50 text-[12px] font-sfpro-regular">
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
    { month: "Sep", amount: "$39", paid: false },
    { month: "Oct", amount: "$39", paid: true },
    { month: "Nov", amount: "$39", paid: true },
    { month: "Dec", amount: "$39", paid: false },
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

  const insets = useSafeAreaInsets(); // Handles iPhone home indicator space

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-[#121212]">
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pb-4">
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
          <View className="border-b-[0.3px] border-[#565656]/40 mb-8" />

          <View className="px-4  gap-4">
            <View className="p-3 pr-5 flex-row items-center justify-between  bg-grayish-100 rounded-full ">
              <View className="flex-row items-center ">
                <View className="w-10 h-10 rounded-full items-center justify-center mr-4 bg-[#FFFFFF]/10 ">
                  <Image source={icons.dollar} className="w-6 h-6" />
                </View>
                <Text className="text-white/50 text-lg font-bold">
                  Total spent
                </Text>
              </View>
              <Text className="text-white text-xl font-bold">{totalSpent}</Text>
            </View>

            {/* Subscription Cycle */}
            <View className="p-3 pr-5 flex-row items-center justify-between bg-grayish-100 rounded-full ">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-[#FFFFFF]/10 items-center justify-center mr-4">
                  <Image source={icons.ring} className="w-6 h-6" />
                </View>
                <Text className="text-white/50 text-lg font-bold">
                  Subscription cycle
                </Text>
              </View>
              <Text className="text-white text-xl font-bold">
                {subscriptionCycle}
              </Text>
            </View>
          </View>
          <View className="border-b-[0.3px] border-[#565656]/40 my-8" />

          <View
            style={{ marginBottom: insets.bottom + insets.bottom / 1.2 }}
            className="px-4   "
          >
            <Text className="text-white text-[20px] font-bold mb-8 text-center">
              Subscriptions breakdown
            </Text>

            <View className="bg-grayish-100  flex flex-col gap-5  py-[5%] rounded-[40px]">
              <View className="items-center ">
                <Text className="text-white/50 font-sfpro-medium text-lg">
                  2025
                </Text>
              </View>

              <View className="border-b-[0.3px] border-[#565656]/40 mb-4" />

              {/* Monthly breakdown  */}
              <View className="flex-row flex-wrap  px-[5%]">
                {monthlyData.map((data, index) => (
                  <View key={index} className="w-1/4 mb-1.5 p-0.5">
                    <MonthCard
                      month={data.month}
                      amount={data.amount}
                      paid={data.paid}
                    />
                  </View>
                ))}
              </View>
            </View>

            <View className="bg-grayish-100 mt-7  flex flex-col gap-5  py-[5%] rounded-[40px]">
              <View className="items-center ">
                <Text className="text-white/50 font-sfpro-medium text-lg">
                  2024
                </Text>
              </View>

              <View className="border-b-[0.3px] border-[#565656]/40 mb-4" />

              {/* Monthly breakdown  */}
              <View className="flex-row flex-wrap  px-[5%]">
                {monthlyData.map((data, index) => (
                  <View key={index} className="w-1/4 mb-1.5 p-0.5">
                    <MonthCard
                      month={data.month}
                      amount={data.amount}
                      paid={data.paid}
                    />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            paddingHorizontal: 24, // px-6
            paddingBottom: insets.bottom, // pb-8 + safe area
            // backgroundColor: "transparent", // Or use "#121212ee" for a footer bg
          }}
          className="bg-[#121212] pt-5"
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              onPress={handlePauseSubscription}
              style={{
                backgroundColor: "#0368FF",
                paddingVertical: 16, // py-4
                borderRadius: 9999,
                alignItems: "center",
                flex: 1,
                marginRight: 8, // mr-2
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                Pause subscription
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLeaveCommunity}
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                paddingVertical: 16,
                borderRadius: 9999,
                alignItems: "center",
                flex: 1,
                marginLeft: 8, // ml-2
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                Leave community
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default SubscriptionInfo;
