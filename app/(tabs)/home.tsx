import React from "react";
import { Animated, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home: React.FC = () => {
  return (
    <>
      <SafeAreaView className="flex-1 bg-[#121212]">
        <Animated.View className="flex-1">
          <View className="flex-row flex-1 justify-center items-center gap-3">
            <Text className="text-white text-4xl ">Tukbuddy home</Text>
          </View>
        </Animated.View>
      </SafeAreaView>
    </>
  );
};

export default Home;
