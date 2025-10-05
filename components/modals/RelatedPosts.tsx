import { dummyAllPosts } from "@/constants/data";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
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

  const SCREEN_HEIGHT = height + insets.bottom;
  const SHEET_HEIGHT = SCREEN_HEIGHT * 0.92; // ~92% height
  const CLOSED_Y = SCREEN_HEIGHT;
  const OPEN_Y = SCREEN_HEIGHT - SHEET_HEIGHT;

  const sheetY = useRef(new Animated.Value(CLOSED_Y)).current;

  const blurOpacity = sheetY.interpolate({
    inputRange: [OPEN_Y, CLOSED_Y],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const openWithSlide = () => {
    sheetY.setValue(CLOSED_Y);
    Animated.timing(sheetY, {
      toValue: OPEN_Y,
      duration: 260,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const closeWithSlide = () => {
    Animated.timing(sheetY, {
      toValue: CLOSED_Y,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(onClose);
  };

  useEffect(() => {
    if (visible) openWithSlide();
  }, [visible]);

  const handlePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dy) > 3 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_, g) => {
        const dy = Math.max(0, g.dy);
        const nextY = Math.min(CLOSED_Y, OPEN_Y + dy);
        sheetY.setValue(nextY);
      },
      onPanResponderRelease: (_, g) => {
        const shouldClose = g.dy > 120 || g.vy > 1.0;
        Animated.timing(sheetY, {
          toValue: shouldClose ? CLOSED_Y : OPEN_Y,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start(() => {
          if (shouldClose) onClose();
        });
      },
      onPanResponderTerminate: () => {
        Animated.spring(sheetY, {
          toValue: OPEN_Y,
          bounciness: 6,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  const [showUpload, setShowUpload] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [feedScrollEnabled, setFeedScrollEnabled] = useState(true);
  const [showLikePuff, setShowLikePuff] = useState(false);
  const [showDislikePuff, setShowDislikePuff] = useState(false);

  if (!visible) return null;

  return (
    <View
      pointerEvents="box-none"
      style={StyleSheet.absoluteFill}
      className="z-50"
    >
      <TouchableOpacity activeOpacity={1} style={StyleSheet.absoluteFill}>
        <FadingBlurBackground opacity={blurOpacity} />
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Animated.View
          style={{
            transform: [{ translateY: sheetY }],
            position: "absolute",
            left: 0,
            right: 0,
            height: SHEET_HEIGHT,
            bottom: 0,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            overflow: "hidden",
            backgroundColor: "black",
            zIndex: 1,
          }}
        >
          <View className="flex-1">
            {/* Frosted overlay */}
            <BlurView
              style={StyleSheet.absoluteFill}
              tint="dark"
              intensity={80}
              experimentalBlurMethod="dimezisBlurView"
            />

            {/* Content */}
            <View
              style={{ paddingBottom: insets.bottom }}
              className="flex-1 pt-2 "
            >
              <View
                className="flex-col items-center justify-center mb-3"
                {...handlePanResponder.panHandlers}
              >
                <DragToClose translateY={sheetY} onClose={closeWithSlide} />
                <Text className="text-white text-[21px] font-semibold">
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
