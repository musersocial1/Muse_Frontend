import { Feather, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useRef } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CommunityData {
  name: string;
  coverImage?: string;
}

const Preview: React.FC<{
  data: CommunityData;
  onUpdate: (data: Partial<CommunityData>) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ data, onUpdate, onNext, onBack }) => {
  const insets = useSafeAreaInsets();

  const badRef = useRef<ScrollView>(null);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      ref={badRef}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
      className="flex-1 relative"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-1 justify-center items-center px-6 ">
        <View className="aspect-[1/0.6] justify-center items-center w-full relative">
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            className="ml-5 h-14 left-0 w-14 absolute top-0 overflow-hidden border-white/30 border rounded-full bg-black/20 items-center justify-center z-20"
          >
            <BlurView style={[StyleSheet.absoluteFill]} />
            <Feather
              name="chevron-left"
              size={20}
              color="#fff"
              style={{ opacity: 0.7 }}
              experimentalBlurMethod="dimezisBlurView"
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="justify-center items-center"
            onPress={onBack}
          >
            <View className="bg-[rgba(255,255,255,0.9)] px-6 py-3 rounded-[25px]">
              <Text className="text-black text-[16px] font-semibold">
                Edit image
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View className="flex-1 justify-center items-center px-6">
          <View className="items-center">
            <View className="bg-white bg-opacity-90 pr-2 pl-3.5 py-2.5 rounded-full flex-row items-center">
              <View className="p-1 h-40 w-40 bg-transparent rounded-full relative">
                <TouchableOpacity
                  className="absolute bottom-2 right-2 bg-[#FFFFFF0D]/[5%] rounded-full p-2"
                  onPress={onBack}
                >
                  <Ionicons name="pencil" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View className="mt-[20rem] px-6 ">
        <Text className="text-white/80 tracking-wider text-2xl font-sfpro-bold text-center">
          {data.name || "Community Name"}
        </Text>
      </View>
    </ScrollView>
  );
};

export default Preview;
