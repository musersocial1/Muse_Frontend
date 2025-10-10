import { dummyAllPosts } from "@/constants/data";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AllFeeds from "../feed/AllFeeds";
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
  const sheetY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const blurOpacity = sheetY.interpolate({
    inputRange: [0, SCREEN_HEIGHT],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const openWithSlide = () => {
    sheetY.setValue(SCREEN_HEIGHT);
    Animated.timing(sheetY, {
      toValue: 0,
      duration: 260,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const closeWithSlide = () => {
    Animated.timing(sheetY, {
      toValue: SCREEN_HEIGHT,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(onClose);
  };

  useEffect(() => {
    if (visible) openWithSlide();
  }, [visible]);

  const [showUpload, setShowUpload] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [feedScrollEnabled, setFeedScrollEnabled] = useState(true);
  const [showLikePuff, setShowLikePuff] = useState(false);
  const [showDislikePuff, setShowDislikePuff] = useState(false);

  if (!visible) return null;

  const ListHeader = (
    <View
      style={{
        paddingTop: insets.top + 15,
        paddingBottom: 8,
        paddingHorizontal: 16,
      }}
    >
      <View className="items-center mb-4">
        <Pressable
          onPress={closeWithSlide}
          accessibilityRole="button"
          accessibilityLabel="Close"
          className="w-14 h-14 rounded-full items-center justify-center"
          style={{ backgroundColor: "rgba(243, 243, 243, 0.15)" }}
        >
          <Text style={{ color: "white", fontSize: 25, fontWeight: "600" }}>
            ×
          </Text>
        </Pressable>
      </View>

      <Text
        style={{
          color: "white",
          fontSize: 21,
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        Related Posts
      </Text>
    </View>
  );

  return (
    <View
      pointerEvents="box-none"
      style={StyleSheet.absoluteFill}
      className="z-50"
    >
      {/* Backdrop */}
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
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            backgroundColor: "#121212",
          }}
        >
          {/* Global blur like InteractedPostsModal */}
          <BlurView
            style={StyleSheet.absoluteFill}
            tint="dark"
            intensity={100}
            experimentalBlurMethod="dimezisBlurView"
          />

          {/* Content */}
          <View style={{ paddingBottom: insets.bottom }} className="flex-1">
            <AllFeeds
              posts={dummyAllPosts}
              addPost={() => setShowUpload(true)}
              setUploadVisible={setUploadVisible}
              externalScrollEnabled={feedScrollEnabled}
              setExternalScrollEnabled={setFeedScrollEnabled}
              onShowLikePuff={() => setShowDislikePuff(true)}
              onShowDislikePuff={() => setShowLikePuff(true)}
              ListHeaderComponent={ListHeader}
              stickyHeaderIndices={[0]}
              ListHeaderComponentStyle={{
                backgroundColor: "rgba(18,18,18,0.9)",
                zIndex: 10,
              }}
            />
          </View>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Puffs (feed reactions; header has no like/dislike tabs) */}
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
