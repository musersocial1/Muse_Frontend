import { dummyAllPosts } from "@/constants/data";
import { images } from "@/constants/images";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AllFeeds from "../feed/AllFeeds";
import DragToClose from "../navigations/DragToClose";
import { FadingBlurBackground } from "../ui/FadingBlurBackground";
import PuffySmoke from "../ui/PuffySmoke";

interface RelatedPostsProps {
  visible: boolean;
  onClose: () => void;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const { width, height } = Dimensions.get("window");

  // Use the actual device height, including safe-area bottom inset
  const SCREEN_HEIGHT = height + insets.bottom;

  const HIDE_OFFSET = SCREEN_HEIGHT;
  const sheetY = useRef(new Animated.Value(HIDE_OFFSET)).current;

  const blurOpacity = sheetY.interpolate({
    inputRange: [0, HIDE_OFFSET],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const openWithSlide = () => {
    // Reset then slide up
    sheetY.setValue(HIDE_OFFSET);
    Animated.timing(sheetY, {
      toValue: 0,
      duration: 260,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const closeWithSlide = () => {
    Animated.timing(sheetY, {
      toValue: HIDE_OFFSET,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => onClose());
  };

  useEffect(() => {
    if (visible) openWithSlide();
  }, [visible]);

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) sheetY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          Animated.timing(sheetY, {
            toValue: HIDE_OFFSET,
            duration: 220,
            useNativeDriver: true,
          }).start(() => onClose());
        } else {
          Animated.spring(sheetY, {
            toValue: 0,
            bounciness: 6,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const [showUpload, setShowUpload] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [feedScrollEnabled, setFeedScrollEnabled] = useState(true);
  const [flatListScrollEnabled, setFlatListScrollEnabled] = useState(true);
  const [showLikePuff, setShowLikePuff] = useState(false);
  const [showDislikePuff, setShowDislikePuff] = useState(false);

  if (!visible) return null;

  return (
    <View
      pointerEvents="box-none"
      style={StyleSheet.absoluteFill}
      className="z-50"
    >
      {/* Dim/blur background. Tapping backdrop closes, though the sheet is full-screen */}
      <TouchableOpacity
        activeOpacity={1}
        style={StyleSheet.absoluteFill}
        onPress={closeWithSlide}
      >
        <FadingBlurBackground opacity={blurOpacity} />
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Animated.View
          style={{
            transform: [{ translateY: sheetY }],
            // Full-screen sheet
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            // Ensure it sits above the backdrop
            zIndex: 1,
            backgroundColor: "black",
          }}
          {...responder.panHandlers}
        >
          <View className="flex-1">
            {/* Background flourish */}
            <View className="flex-1 items-center absolute top-0 left-0 right-0 bottom-0">
              <View className="w-[220px] pt-24 blur-2xl aspect-square rounded-full border-2 border-white/10">
                <Image
                  source={images.img11}
                  className="w-full rounded-full h-full"
                  resizeMode="cover"
                  blurRadius={150}
                />
              </View>
            </View>

            {/* Frosted overlay */}
            <BlurView
              style={StyleSheet.absoluteFill}
              tint="dark"
              intensity={100}
              experimentalBlurMethod="dimezisBlurView"
            />

            {/* Content */}
            <View
              style={{ paddingBottom: insets.bottom }}
              className="flex-1 px-3 pt-10"
            >
              <View className="flex-col items-center justify-center mb-4">
                {/* Drag handle / indicator */}
                <DragToClose translateY={sheetY} onClose={closeWithSlide} />
                <Text className="text-white text-xl font-semibold">
                  Related Posts
                </Text>
              </View>

              <AllFeeds
                posts={dummyAllPosts}
                addPost={() => setShowUpload(true)}
                setUploadVisible={setUploadVisible}
                externalScrollEnabled={feedScrollEnabled}
                setExternalScrollEnabled={setFeedScrollEnabled}
                onShowLikePuff={() => setShowDislikePuff(true)}
                onShowDislikePuff={() => setShowLikePuff(true)}
              />
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Puffs */}
      <PuffySmoke
        type="like"
        visible={showLikePuff}
        x={width - 140}
        y={height * 0.45}
        onComplete={() => setShowLikePuff(false)}
      />
      <PuffySmoke
        type="dislike"
        visible={showDislikePuff}
        x={20}
        y={height * 0.45}
        onComplete={() => setShowDislikePuff(false)}
      />
    </View>
  );
};

export default RelatedPosts;
