import { icons } from "@/constants/icons";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageSourcePropType,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DragToClose from "../navigations/DragToClose";
import { FadingBlurBackground } from "../ui/FadingBlurBackground";

type DeletePostModalProps = {
  visible: boolean;
  post: {
    image: ImageSourcePropType;
    description: string;
  } | null;
  onClose: () => void;
};

type DeleteState = "confirm" | "success";

const SuccessIcon: React.FC = () => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
      }}
      className="items-center justify-center mb-8"
    >
      <View className="relative h-[180px] w-[180px]">
        <Image
          source={icons.done}
          className="h-full w-full"
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );
};

const DeletePostFlowModal: React.FC<DeletePostModalProps> = ({
  visible,
  post,
  onClose,
}) => {
  const [deleteState, setDeleteState] = useState<DeleteState>("confirm");
  const insets = useSafeAreaInsets();
  const HIDE_OFFSET = 300;
  const sheetY = useRef(new Animated.Value(HIDE_OFFSET)).current;

  useEffect(() => {
    if (visible) {
      setDeleteState("confirm");
      sheetY.setValue(HIDE_OFFSET);
      Animated.timing(sheetY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setDeleteState("confirm"), 300);
      sheetY.setValue(HIDE_OFFSET);
    }
  }, [visible]);

  const blurOpacity = sheetY.interpolate({
    inputRange: [0, HIDE_OFFSET],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const closeWithSlide = () => {
    Animated.timing(sheetY, {
      toValue: HIDE_OFFSET,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const handleDelete = () => {
    setDeleteState("success");
    // setTimeout(() => {
    //   onClose();
    // }, 1300);
  };

  if (!post) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1">
        {/* Fading blur background */}
        <TouchableOpacity
          activeOpacity={1}
          style={StyleSheet.absoluteFill}
          onPress={closeWithSlide}
        >
          <FadingBlurBackground opacity={blurOpacity} />
        </TouchableOpacity>

        <View
          pointerEvents="box-none"
          style={{ marginBottom: insets.bottom }}
          className="flex-1 pb-3 px-3 items-center justify-end"
        >
          <Animated.View
            style={{
              transform: [{ translateY: sheetY }],
              width: "100%",
            }}
            className="w-full max-w-lg"
          >
            <View className="bg-[#231f1e]/90 w-full border border-white/10 rounded-[38px] overflow-hidden">
              {deleteState !== "success" && (
                <DragToClose translateY={sheetY} onClose={onClose} />
              )}
              {deleteState === "confirm" && (
                <View>
                  <Text className="text-[#FBFAF1] text-center text-[13px] font-semibold mb-2 px-6 mt-3 w-full max-w-[200px] mx-auto">
                    {post.description}
                  </Text>
                  <View className="relative items-center">
                    {/* Post image with glowing shadow */}
                    <View
                      style={{
                        shadowColor: "#FFFFFF",
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.6,
                        shadowRadius: 20,
                        elevation: 10,
                        borderRadius: 20,
                      }}
                    >
                      <Image
                        source={post.image}
                        className="w-[140px] h-[180px] rounded-2xl"
                        resizeMode="cover"
                      />
                    </View>

                    {/* Play button overlay */}
                    <View
                      className="absolute items-center justify-center"
                      style={{ width: 120, height: 160 }}
                    >
                      <View className="overflow-hidden rounded-full p-3 bg-black/40">
                        <BlurView
                          style={StyleSheet.absoluteFill}
                          tint="dark"
                          intensity={50}
                        />
                        <Image
                          source={icons.play}
                          className="h-5 w-5"
                          resizeMode="contain"
                        />
                      </View>
                    </View>
                  </View>

                  <View className="border border-white/5 my-5" />
                  <Text className="text-white text-center font-bold text-[22px] mb-2">
                    Delete post
                  </Text>
                  <Text className="text-white/50 text-center text-base px-7 mb-8">
                    Are you sure you want to{"\n"}delete this post?
                  </Text>
                  <View className="flex-row justify-between gap-3 px-4 mb-6">
                    <TouchableOpacity
                      className="flex-1 py-4 rounded-full bg-[#E04B32]"
                      activeOpacity={0.85}
                      onPress={handleDelete}
                    >
                      <Text className="text-white font-bold text-[18px] text-center">
                        Delete
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 py-4 rounded-full bg-white/10"
                      activeOpacity={0.85}
                      onPress={closeWithSlide}
                    >
                      <Text className="text-white font-bold text-[18px] text-center">
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {/* Success State */}
              {deleteState === "success" && (
                <View className="items-center py-12">
                  <SuccessIcon />
                  <Text className="text-white font-bold text-[23px] mb-6">
                    Post deleted
                  </Text>
                  <TouchableOpacity
                    className="w-full max-w-[90%] mx-auto py-4 rounded-full bg-white/10 mt-2 "
                    onPress={closeWithSlide}
                    activeOpacity={0.8}
                  >
                    <Text className="text-white text-[18px] font-bold text-center">
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

export default DeletePostFlowModal;
