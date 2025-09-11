import React from "react";
import {
  Image,
  ImageSourcePropType,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  onDone: () => void;
  undoNudge: () => void;
  avatarUrl: ImageSourcePropType;
  username: string;
};

const NudgeSuccessModal: React.FC<Props> = ({
  visible,
  onDone,
  undoNudge,
  avatarUrl,
  username,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 bg-primary justify-between">
        <View className="flex-1 items-center justify-center px-4">
          <View className="flex-row items-center mb-3">
            <Text className="text-white text-[27px] font-bold">
              You nudged{" "}
            </Text>
            <View
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
                borderRadius: 999,
              }}
            >
              <Image
                source={avatarUrl}
                className="w-11 h-11 rounded-full mx-2 border-2 border-white bg-[#222]"
                resizeMode="cover"
              />
            </View>

            <Text className="text-white text-[27px] font-bold">{username}</Text>
          </View>
          <Text className="text-white/70 text-center text-[16px] font-normal mt-2">
            Now you can see all their updates once its{"\n"}made including
            stories and post
          </Text>
        </View>

        {/* Bottom Buttons */}
        <View
          className="flex-row px-4 pb-6 pt-2 gap-3"
          style={{
            paddingBottom: insets.bottom + (Platform.OS === "ios" ? 10 : 8),
          }}
        >
          <TouchableOpacity
            onPress={onDone}
            activeOpacity={0.9}
            className="flex-1 h-16 rounded-full bg-white items-center justify-center"
          >
            <Text className="text-black text-lg font-bold">Done</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={undoNudge}
            activeOpacity={0.9}
            className="flex-1 h-16 rounded-full bg-[#FFFFFF0F]/[6%] items-center justify-center"
          >
            <Text className="text-white text-lg font-bold">Undo nudge</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default NudgeSuccessModal;
