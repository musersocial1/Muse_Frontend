import { icons } from "@/constants/icons";
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
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";

import AvatarStack from "@/components/analytics/AvatarStack";
import BarComparisonChart from "@/components/analytics/ComparisonChart";
import HorizontalBarList from "@/components/analytics/HorizontalBarList";
import LineSparkChart from "@/components/analytics/LineSparkChart";
import StackedBar from "@/components/analytics/StackedBar";
import { images } from "@/constants/images";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";

const { width } = Dimensions.get("window");
const screenPadding = 16;

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
      {desc && (
        <Text className="text-white/60 text-[13px] font-sfpro-regular pt-1">
          {desc}
        </Text>
      )}
    </View>

    {rightLabel ? (
      <TouchableOpacity className="flex-row items-center bg-[#353535] p-3 rounded-full">
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

const StatCard = ({
  title,
  value,
  rightFilter,
  containerClass = "",
}: {
  title: string;
  value: string;
  rightFilter?: string;
  containerClass?: string;
}) => (
  <View className={`bg-[#1C1C1C] rounded-3xl p-4 h-[180px] ${containerClass}`}>
    {/* Make the inner container take full height and space-between */}
    <View className="flex-1 justify-between">
      {/* Top Row */}
      <View className="flex-row items-center justify-between">
        <Text className="text-white/60 text-[14px] font-sfpro-regular">
          {title}
        </Text>
        {rightFilter ? (
          <TouchableOpacity className="flex-row items-center bg-[#FFFFFF1C]/[11%] px-2.5 py-2 rounded-full">
            <Text className="text-white/80 text-[13px] mr-1 font-sfpro-medium">
              {rightFilter}
            </Text>
            <Feather name="chevron-down" size={14} color="#8E8E8E" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Value at bottom */}
      <Text className="text-white text-[32px] font-sfpro-bold">{value}</Text>
    </View>
  </View>
);

const InfoPill = ({
  icon,
  label,
  right,
  handlePress,
}: {
  icon: ImageSourcePropType;
  label: React.ReactNode;
  right?: React.ReactNode;
  handlePress?: () => void;
}) => (
  <TouchableOpacity
    onPress={handlePress}
    activeOpacity={0.85}
    className="bg-[#1C1C1C] rounded-full p-4 flex-row items-center justify-between overflow-hidden"
  >
    <View className="flex-row items-center">
      <View className="w-10 h-10 rounded-full bg-[#FFFFFF12]/[7%] items-center justify-center mr-3">
        <Image source={icon} className="w-5 h-5" tintColor="#9CA3AF" />
      </View>
      <View className="flex-row items-center">
        {typeof label === "string" ? (
          <Text className="text-white/60 text-[17px] font-sfpro-bold">
            {label}
          </Text>
        ) : (
          label
        )}
      </View>
    </View>
    <View className="flex-row items-center">
      {right}
      <Feather
        name="chevron-right"
        size={20}
        color="#777"
        style={{ marginLeft: 6, opacity: 0.5 }}
      />
    </View>
  </TouchableOpacity>
);

const ValuePill = ({ text }: { text: string }) => (
  <View className="px-2.5 py-1.5 rounded-full ">
    <Text className="text-white/90 text-[16px] font-sfpro-bold">{text}</Text>
  </View>
);

const PositiveBadge = ({ text }: { text: string }) => (
  <View className="px-2 py-1 rounded-full bg-[#16391F]">
    <Text
      className="text-[#2AD05A] text-[12px]"
      style={{ fontFamily: "SFProDisplay-Bold" }}
    >
      {text}
    </Text>
  </View>
);

const Analytics = () => {
  const router = useRouter();

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const subscribersCurrent = [120000, 260000, 90000, 60000, 520000, 650000];
  const subscribersPrev = [80000, 140000, 60000, 30000, 180000, 540000];

  const returningMembers = [
    320, 480, 450, 780, 720, 980, 860, 1020, 1110, 1320, 1500, 1680,
  ];
  const returningLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const deviceData = [
    { label: "iPhone", value: 12647, color: "#2F80ED" },
    { label: "Android", value: 7468, color: "#F2994A" },
    { label: "Tablet", value: 5023, color: "#27AE60" },
    { label: "Macbooks", value: 2154, color: "#9B51E0" },
    { label: "PC", value: 915, color: "#EB5757" },
  ];

  const timeSpent = [
    { label: "Posts", value: 12647, color: "#F2C94C" },
    { label: "Groups", value: 7468, color: "#2D9CDB" },
    { label: "Excl. Cont.", value: 5023, color: "#27AE60" },
    { label: "Stories", value: 2154, color: "#EB5757" },
    { label: "Creator post", value: 345, color: "#6FCF97" },
  ];

  const ageBreakdown = [
    { label: "Age 18-26", pct: 20, color: "#F2C94C" },
    { label: "Age 27-40", pct: 45, color: "#F2994A" },
    { label: "Age 41-60", pct: 15, color: "#2D9CDB" },
    { label: "Age 61-80", pct: 20, color: "#BB6BD9" },
  ];

  const maxDeviceValue = Math.max(...deviceData.map((d) => d.value));
  const maxTimeValue = Math.max(...timeSpent.map((d) => d.value));

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

          <Text className="text-white text-[25px] font-bold">Analytics</Text>

          <View className="w-10" />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: screenPadding,
            paddingBottom: 32,
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

          <View className="h-[1px] bg-white/5 my-8" />

          {/* Community info pills */}
          <Text className="text-white/60 text-[14px] mb-3 font-regular text-center">
            Community info
          </Text>

          <View className="gap-3">
            <InfoPill
              icon={icons.badge}
              label={
                <View className="flex-row items-center">
                  <Text className="text-white/60 mr-2 font-sfpro-bold text-[16px]">
                    Community name
                  </Text>
                  <ValuePill text="Dance mania - california" />
                </View>
              }
            />
            <InfoPill
              icon={icons.users}
              label={
                <View className="flex-row justify-between w-full max-w-[90%] ">
                  <Text className="text-white/60  font-sfpro-bold text-[16px]">
                    Members
                  </Text>
                  <AvatarStack
                    size={28}
                    images={[icons.dp, images.img11, images.img12, images.img6]}
                    extra={"+234k"}
                  />
                </View>
              }
            />
            <InfoPill
              icon={icons.cash}
              label={
                <View className="flex-row items-center">
                  <Text className="text-white/60 mr-2 font-sfpro-bold text-[16px]">
                    Amount generated
                  </Text>
                </View>
              }
              right={<ValuePill text="$4,567,756.89" />}
              handlePress={() =>
                router.push(RouterConstantUtil.profile.amountGenerated)
              }
            />
            <InfoPill
              icon={icons.groups}
              label={
                <Text
                  className="text-white/60"
                  style={{ fontFamily: "SFProDisplay-Regular" }}
                >
                  Groups
                </Text>
              }
              right={<ValuePill text="4" />}
            />
          </View>

          <View className="h-[1px] bg-white/5 my-12" />

          {/* Analytics section divider */}
          <View className="">
            <Text className="text-white/70 text-[16px] mb-7 font-sfpro-medium text-center ">
              Community analytics
            </Text>

            {/* Top stat cards (2-up) */}
            <View className="flex-row gap-3">
              <View className="flex-1">
                <StatCard
                  title="Total posts"
                  value="456k"
                  rightFilter="All time"
                />
              </View>
              <View className="flex-1">
                <StatCard
                  title="Total Likes"
                  value="23m"
                  rightFilter="All time"
                />
              </View>
            </View>

            {/* Shares card */}
            <View className="mt-3">
              <StatCard
                title="Total community shares"
                value="16k"
                rightFilter="All time"
              />
            </View>
          </View>

          {/* Subscribers section */}
          <View className="mt-6 bg-[#1C1C1C] rounded-3xl p-4">
            <SectionHeader
              title="Subscribers"
              rightLabel="Last 6 months"
              desc="Paid members analytics"
            />

            <View className="bg-[#1C1C1C] rounded-3xl py-4">
              <View className="mb-2">
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
                className="absolute right-5 top-[82px] z-10"
              >
                <View className="flex-row items-center  bg-[#262626] border border-[#2B2B2B] px-2.5 py-2 rounded-xl">
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

          {/* Age breakdown */}
          <View className="mt-6 bg-[#1C1C1C] rounded-3xl p-4 border border-[#000000]/[10%]">
            <SectionHeader
              title="Age breakdown"
              desc="Subscriber breakdown by age"
            />
            <View className="h-[1px] bg-white/5 my-3" />

            <View className="bg-[#1C1C1C] rounded-3xl py-4">
              <Text className="text-white/60 text-[14px] mb-1 font-sfpro-regular">
                Your subscribers have a median age of
              </Text>
              <Text className="text-white text-[24px] mb-4 font-sfpro-bold">
                24
              </Text>

              <StackedBar
                segments={ageBreakdown.map((a) => ({
                  color: a.color,
                  value: a.pct,
                }))}
                height={60}
                radius={20}
              />

              <View className="mt-4 gap-2">
                {ageBreakdown.map((a, idx) => (
                  <View
                    key={idx}
                    className="bg-[#262626] rounded-xl px-3 py-3 flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center">
                      <View
                        className="w-5 h-5 rounded-full mr-2 font-sfpro-medium"
                        style={{ backgroundColor: a.color }}
                      />
                      <Text className="text-white/50">{a.label}</Text>
                    </View>
                    <ValuePill text={`${a.pct}%`} />
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Returning members */}
          <View className="mt-6 bg-[#1C1C1C] rounded-3xl p-4 border border-[#000000]/[10%]">
            <SectionHeader
              title="Returning members"
              rightLabel="Last 6 months"
              desc="Members that resubscribed"
            />
            <View className="bg-[#1C1C1C] rounded-3xl p-4">
              {/* Floating stat pill */}
              <View className="absolute right-5 top-[22px] z-10">
                <View className="flex-row items-center bg-[#262626] border border-[#2B2B2B] px-2.5 py-2 rounded-xl">
                  <AvatarStack
                    size={20}
                    images={[
                      images.img10,
                      images.img11,
                      images.img12,
                      images.img13,
                    ]}
                    date="Apr 2nd 2025"
                  />
                  <Text className="text-white/90 text-[12px] mx-2 font-sfpro-medium">
                    +234k
                  </Text>
                  <PositiveBadge text="+3.4%" />
                </View>
              </View>

              <LineSparkChart
                width={width - screenPadding * 2 - 32}
                height={220}
                data={returningMembers}
                labels={returningLabels}
                lineColor="#2D9CDB"
                gradientFrom="#2D9CDB20"
                gradientTo="#2D9CDB00"
                gridColor="#2A2A2A"
              />
            </View>
          </View>

          {/* Devices subscribers use */}
          <View className="mt-6 bg-[#1C1C1C] rounded-3xl p-4">
            <SectionHeader title="Devices subscribers use" />
            <View className="h-[1px] bg-white/5 my-5" />

            <View className="bg-[#1C1C1C] rounded-3xl py-4">
              <HorizontalBarList
                items={deviceData}
                maxValue={maxDeviceValue}
                showAxis
              />
            </View>
          </View>

          {/* What subscribers spend time on */}
          <View className="mt-6 bg-[#1C1C1C] rounded-3xl p-4">
            <SectionHeader title="What subscribers spend time on" />
            <View className="h-[1px] bg-white/5 my-5" />

            <View className="bg-[#1C1C1C] rounded-3xl py-4">
              <HorizontalBarList
                items={timeSpent}
                maxValue={maxTimeValue}
                showAxis
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default Analytics;
