import { icons } from "@/constants/icons";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const MonthCard = ({ month, amount, paid }: any) => (
  <View className="flex-1 mx-1">
    <ImageBackground
      source={icons.dp}
      className="rounded-2xl overflow-hidden justify-center items-center"
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

const SubscriptionInfo = ({
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
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{ paddingTop: insets.top }}
      className="flex-1 bg-[#121212]"
    >
      {/* Header */}
      <Animatable.View animation="fadeIn" duration={350}>
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
      </Animatable.View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeIn" duration={350} delay={120}>
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
        </Animatable.View>

        <Animatable.View animation="fadeIn" duration={350} delay={180}>
          <View className="border-b-[0.3px] border-[#565656]/40 mb-8" />
          <View className="px-4 gap-4">
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
        </Animatable.View>

        {/* Subscriptions breakdown */}
        <Animatable.View animation="fadeIn" duration={350} delay={220}>
          <View className="px-4">
            <Text className="text-white text-[20px] font-bold mb-8 text-center">
              Subscriptions breakdown
            </Text>
            {/* Year: 2025 */}
            <View className="bg-grayish-100 flex flex-col gap-5 py-[5%] rounded-[40px] mb-8">
              <View className="items-center">
                <Text className="text-white/50 font-sfpro-medium text-lg">
                  2025
                </Text>
              </View>
              <View className="border-b-[0.3px] border-[#565656]/40 mb-4" />
              <View className="flex-row flex-wrap px-[5%]">
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
            {/* Year: 2024 */}
            <View className="bg-grayish-100 flex flex-col gap-5 py-[5%] rounded-[40px]">
              <View className="items-center">
                <Text className="text-white/50 font-sfpro-medium text-lg">
                  2024
                </Text>
              </View>
              <View className="border-b-[0.3px] border-[#565656]/40 mb-4" />
              <View className="flex-row flex-wrap px-[5%]">
                {monthlyData.map((data, index) => (
                  <View key={index + "2024"} className="w-1/4 mb-1.5 p-0.5">
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
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubscriptionInfo;
