import { FadingBlurBackground } from "@/components/ui/FadingBlurBackground";
import { BlurView } from "expo-blur";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
import NormalFeeds from "../feed/NormalFeeds";

type Post = any;

interface InteractedPostsModalProps {
  visible: boolean;
  onClose: () => void;
  likedPosts: Post[];
  dislikedPosts: Post[];
  initialTab?: "liked" | "disliked";
}

const InteractedPostsModal: React.FC<InteractedPostsModalProps> = ({
  visible,
  onClose,
  likedPosts,
  dislikedPosts,
  initialTab = "liked",
}) => {
  const insets = useSafeAreaInsets();
  const { height } = Dimensions.get("window");

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

  const [tab, setTab] = useState<"liked" | "disliked">(initialTab);
  useEffect(() => setTab(initialTab), [initialTab, visible]);

  const posts = useMemo(
    () => (tab === "liked" ? likedPosts : dislikedPosts),
    [tab, likedPosts, dislikedPosts]
  );

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

      <View
        className="flex-row rounded-full overflow-hidden"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.03)",
          height: 53,
        }}
      >
        <Pressable
          onPress={() => setTab("liked")}
          className="flex-1 items-center justify-center"
          style={{
            backgroundColor: tab === "liked" ? "white" : "transparent",
            borderRadius: 999,
            margin: 4,
            marginRight: 2,
          }}
        >
          <Text
            style={{
              color: tab === "liked" ? "black" : "rgba(255,255,255,0.75)",
              fontWeight: "600",
              fontSize: 16,
            }}
          >
            Liked
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setTab("disliked")}
          className="flex-1 items-center justify-center"
          style={{
            backgroundColor: tab === "disliked" ? "white" : "transparent",
            borderRadius: 999,
            margin: 4,
            marginLeft: 2,
          }}
        >
          <Text
            style={{
              color: tab === "disliked" ? "black" : "rgba(255,255,255,0.75)",
              fontWeight: "600",
              fontSize: 16,
            }}
          >
            Disliked
          </Text>
        </Pressable>
      </View>
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
          <BlurView
            style={StyleSheet.absoluteFill}
            tint="dark"
            intensity={100}
            experimentalBlurMethod="dimezisBlurView"
          />

          {/* Content */}
          <View style={{ paddingBottom: insets.bottom }} className="flex-1">
            <NormalFeeds
              key={tab}
              posts={posts}
              addPost={() => {}}
              setUploadVisible={() => {}}
              externalScrollEnabled
              setExternalScrollEnabled={() => {}}
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
    </View>
  );
};

export default InteractedPostsModal;
