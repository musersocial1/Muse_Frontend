import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const userImages = [
  images.img6,
  images.img7,
  images.img8,
  images.img9,
  images.img10,
  images.img11,
  images.img12,
  images.img13,
  images.img14,
  images.img14,
  images.img14,
  images.img11,
  images.img12,
  images.img13,
];

const MARQUEE_ROW_HEIGHT = 60;

interface MarqueeRowProps {
  children: React.ReactNode;
  reverse?: boolean;
}

const MarqueeRow: React.FC<MarqueeRowProps> = ({
  children,
  reverse = false,
}) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(scrollX, {
        toValue: 1,
        duration: 15000,
        useNativeDriver: true,
      })
    );
    animation.start();

    return () => animation.stop();
  }, []);

  const translateX = scrollX.interpolate({
    inputRange: [0, 1],
    outputRange: reverse ? [0, -width] : [-width, 0],
  });

  return (
    <View
      style={{
        height: MARQUEE_ROW_HEIGHT,
        overflow: "hidden",
        marginBottom: 16,
      }}
      className=""
    >
      <Animated.View
        style={{
          flexDirection: "row",
          alignItems: "center",
          transform: [{ translateX }],
        }}
      >
        <View style={{ flexDirection: "row" }}>
          {children}
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

const IconButton: React.FC<{ iconSource: any }> = ({ iconSource }) => (
  <TouchableOpacity className=" w-32 items-center justify-center">
    <Image source={iconSource} className="w-full h-full" resizeMode="contain" />
  </TouchableOpacity>
);

const UserImage: React.FC<{ source: any }> = ({ source }) => (
  <TouchableOpacity className="mx-1">
    <Image
      source={source}
      style={{ width: MARQUEE_ROW_HEIGHT, height: MARQUEE_ROW_HEIGHT }}
      className="rounded-full"
    />
  </TouchableOpacity>
);

const Home: React.FC = () => {
  const headerAnimated = useRef(new Animated.Value(0)).current;
  const fabAnimated = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.timing(headerAnimated, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.timing(fabAnimated, {
      toValue: 1,
      duration: 600,
      delay: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const fabScale = fabAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <SafeAreaView className="flex-1 bg-primary">
      {/* Header */}
      <Animated.View style={{ opacity: headerAnimated }} className="px-4 py-4">
        <View className="flex-row items-center justify-between">
          <Image
            source={images.logo_white}
            style={{ width: 100, height: 36 }}
          />

          <View className="flex-row items-center gap-3">
            <TouchableOpacity>
              <Image
                source={icons.notification}
                style={{ width: 45, height: 45 }}
                className="tint-white"
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={icons.user}
                style={{ width: 45, height: 45, borderRadius: 18 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Marquee Rows */}
      <View className="mt-8 flex-1">
        {/* First Row - Moving Right */}
        <MarqueeRow>
          <UserImage source={userImages[0]} />
          <UserImage source={userImages[1]} />
          <IconButton iconSource={images.img15} />
          <UserImage source={userImages[2]} />
          <UserImage source={userImages[3]} />
          <UserImage source={userImages[4]} />
          <IconButton iconSource={images.img18} />
          <UserImage source={userImages[5]} />
        </MarqueeRow>

        {/* Second Row - Moving Left */}
        <MarqueeRow reverse>
          <UserImage source={userImages[6]} />
          <IconButton iconSource={images.img16} />
          <UserImage source={userImages[7]} />
          <UserImage source={userImages[8]} />
          <UserImage source={userImages[9]} />
          <IconButton iconSource={images.img19} />
          <UserImage source={userImages[10]} />
        </MarqueeRow>

        {/* Third Row - Moving Right */}
        <MarqueeRow>
          <UserImage source={userImages[11]} />
          <UserImage source={userImages[12]} />
          <UserImage source={userImages[13]} />
          <UserImage source={userImages[0]} />
          <IconButton iconSource={images.img20} />
          <UserImage source={userImages[1]} />
        </MarqueeRow>

        {/* Fourth Row - Moving Left */}
        <MarqueeRow reverse>
          <UserImage source={userImages[2]} />
          <IconButton iconSource={images.img17} />
          <UserImage source={userImages[3]} />
          <UserImage source={userImages[4]} />
          <UserImage source={userImages[5]} />
          <IconButton iconSource={images.img15} />
          <UserImage source={userImages[6]} />
        </MarqueeRow>

        {/* Empty state */}
        <View className="flex-1 items-center justify-center px-6 mt-16">
          <Text className="text-gray-400 text-[20px] text-center mb-2 font-bold">
            You haven't created any
          </Text>
          <Text className="text-gray-400 text-[20px]  text-center mb-8 font-bold">
            communities yet
          </Text>
          <TouchableOpacity
            onPress={() =>
              router.push(RouterConstantUtil.community.create as any)
            }
            className="bg-secondary px-8 py-5 rounded-full"
          >
            <Text className="text-[#FFFFFF] text-[17px] font-bold">
              Create your community
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View
        style={{
          transform: [{ scale: fabScale }],
          position: "absolute",
          bottom: 100,
          right: 10,
          zIndex: 1000,
        }}
      >
        <TouchableOpacity
          className="w-28 h-28  rounded-full items-center justify-center shadow-lg"
          onPress={() => console.log("Create muse pressed")}
        >
          <Image source={images.muse} className="h-full w-full" />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Home;
