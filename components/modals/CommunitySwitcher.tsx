import { LinearGradient } from "expo-linear-gradient";
import React from "react";

import {
  Animated,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const cardSize = (width - 80) / 2;

interface Community {
  id: string;
  name: string;
  image: any;
}

import { images } from "@/constants/images";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";

const communities: Community[] = [
  {
    id: "1",
    name: "Swifties",
    image: images.comm1,
  },
  {
    id: "2",
    name: "Designers",
    image: images.comm2,
  },
  {
    id: "3",
    name: "Gamers",
    image: images.comm3,
  },
  {
    id: "4",
    name: "Creators",
    image: images.comm4,
  },
  {
    id: "5",
    name: "Artists",
    image: images.comm5,
  },
  {
    id: "6",
    name: "Musicians",
    image: images.comm6,
  },
];

const CommunityCard: React.FC<{
  community: Community;
  size: number;
  onClose: any;
}> = ({ community, size, onClose }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      className="items-center mb-10 w-[47%] "
      activeOpacity={0.9}
      onPress={() => {
        router.replace(RouterConstantUtil.community.user as any);
        // setTimeout(() => {
        //   onClose();
        // }, 1000);
      }}
      // onPress={() => onClose()}
    >
      <View
        // style={{ width: size, height: size, borderRadius: size / 2 }}
        className="overflow-hidden  w-full aspect-square flex justify-center items-center  shadow-lg"
      >
        <Image
          source={community.image}
          className="rounded-full absolute top-0 left-0 right-0 bottom-0 w-full h-full"
          resizeMode="cover"
          blurRadius={300}
        />
        <Image
          source={community.image}
          className="rounded-full w-[94%] h-[94%]"
          resizeMode="cover"
        />
      </View>
      <Text className="text-white/60 text-base tracking-wider mt-2 font-sfpro-bold">
        {community.name}
      </Text>
    </TouchableOpacity>
  );
};

interface CommunitiesModalProps {
  //   visible: boolean;
  onClose: () => void;
}

const CommunitySwitcher: React.FC<CommunitiesModalProps> = ({
  //   visible,
  onClose,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <>
      {/* <StatusBar
        barStyle="light-content"
        backgroundColor="#000000"
        // translucent
        // hidden={true}
      /> */}

      <Animated.View className="flex-1  ">
        <LinearGradient
          colors={["#000000", "#1c1c1c", "#000000"]}
          locations={[0, 0.7, 1]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={{ flex: 1 }}
          className="relative"
        >
          <View
            pointerEvents="none"
            style={{ top: insets.top + 100 }}
            className=" absolute max-w-lg flex flex-wrap px-4  flex-row justify-between top-0 left-0 right-0 bottom-0 "
          >
            {communities.map((community, index) => (
              <View
                key={index}
                style={{ transform: [{ scale: 1.6 }] }} // 👈 scales 1.3x
                className="overflow-hidden  w-[47%] rounded-full mb-8 aspect-square shadow-lg"
              >
                <Image
                  source={community.image}
                  className="rounded-full w-full h-full "
                  resizeMode="cover"
                  blurRadius={Platform.OS == "android" ? 1000 : 1000}
                />
              </View>
            ))}
          </View>

          <Animated.View
            className="flex-1  z-[100] "
            style={{
              paddingTop: Platform.OS == "android" ? 20 : insets.top + 5,
            }}
          >
            <BlurView
              style={StyleSheet.absoluteFill}
              intensity={80}
              tint="dark"
              experimentalBlurMethod="dimezisBlurView"
            />
            {/* Header */}
            <View className="items-center  px-6  pb-6">
              <Text className="text-white text-[24px] font-sfpro-bold mb-4">
                All communities
              </Text>

              <View className="bg-[#363636] border-[0.7px] border-[#575757] w-full rounded-full px-4 ">
                <TextInput
                  placeholder="Type to search"
                  placeholderTextColor="#9CA3AF"
                  className="text-white h-[3rem] font-sfpro-medium tracking-wider leading-[14px] text-[14px] "
                  //   textAlignVertical="center"
                />
              </View>
            </View>

            {/* Scrollable list */}
            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              //   contentOffset={{ x: 0, y: insets.bottom + 20 }}
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: insets.bottom,
              }}
            >
              <View className="flex-row flex-wrap justify-between">
                {communities.map((community, index) => (
                  <CommunityCard
                    key={index}
                    community={community}
                    size={cardSize}
                    onClose={onClose}
                  />
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    </>
  );
};

export default CommunitySwitcher;
