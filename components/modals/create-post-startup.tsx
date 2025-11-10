import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";

import { user } from "@/constants/data";
import { TextInput } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomBar from "../MakeAPost/BottomBar";
import CircleRevealOverlay from "../MakeAPost/CircleRevealOverlay";
import CreatePost from "../MakeAPost/CreatePost";
import PostCommunities from "../MakeAPost/PostCommunities";

export type MediaItem = {
  id: string;
  uri: any;
  type: "image" | "video";
};

export default function CreatePostStart({
  showModal,
  onClose,
  showCommunities: shouldShowCommunities = true,
  preMedia,
}: any) {
  const router = useRouter();

  const [text, setText] = useState("");
  const insets = useSafeAreaInsets();
  const wordCount = useMemo(() => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }, [text]);

  const progress = Math.min(wordCount / 300, 1);

  const size = 38;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };
  const [images, setImages] = useState<{ id: string; uri: string }[]>([]);

  const [processing, setProcessing] = useState(false);

  const [media, setMedia] = useState<MediaItem[]>(preMedia || []);

  useEffect(() => {
    if (showModal) {
      if (preMedia && preMedia.length > 0) {
        setMedia(preMedia);
      } else {
        setMedia([]);
      }
    }
  }, [showModal, preMedia]);

  const removeItem = (id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
  };

  const openCamera = async () => {
    Keyboard.dismiss();
    try {
      const { status: camStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      if (camStatus !== "granted") {
        alert("Camera permission is required!");
        return;
      }
      setTimeout(() => {
        setProcessing(true);
      }, 1200);

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 0.8,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        const newItem: MediaItem = {
          id: Date.now().toString(),
          uri: asset.uri,
          type: asset.type === "video" ? "video" : "image",
        };
        setMedia((prev) => [...prev, newItem]);
      }
    } finally {
      setProcessing(false);
    }
  };

  const openGallery = async () => {
    Keyboard.dismiss();
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Media library permission is required!");
        return;
      }

      setTimeout(() => {
        setProcessing(true);
      }, 1200);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const newItems: MediaItem[] = result.assets.map((asset, index) => ({
          id: asset.assetId + asset.uri + Date.now().toString() + "-" + index,
          uri: asset.uri,
          type: asset.type === "video" ? "video" : "image",
        }));
        setMedia((prev) => [...prev, ...newItems]);
      }
    } finally {
      setProcessing(false);
    }
  };

  const [showCommunities, setShowCommunities] = useState(false);
  const { width, height } = Dimensions.get("window");
  const bottomBarTranslate = useRef(new Animated.Value(100)).current;

  const [visibleCircle, setVisibleCircle] = useState(false);
  const [mode, setMode] = useState<"expand" | "shrink">("expand");
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);

  const contentOpacity = useRef(new Animated.Value(0)).current;
  const [selectedCommunityIds, setSelectedCommunityIds] = useState<string[]>(
    []
  );

  const [hasExpanded, setHasExpanded] = useState(false);

  useEffect(() => {
    if (showModal) {
      const cx = width - 40;
      const cy = height - 100;
      setOrigin({ x: cx, y: cy });
      setMode("expand");
      setVisibleCircle(true);

      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 500,
        delay: 400,
        useNativeDriver: true,
      }).start();

      Animated.timing(bottomBarTranslate, {
        toValue: 0,
        duration: 300,
        delay: 300,
        useNativeDriver: true,
      }).start();
    } else {
      contentOpacity.setValue(0);
      bottomBarTranslate.setValue(100);
    }
  }, [showModal]);

  const handleClose = () => {
    Keyboard.dismiss();

    Animated.timing(bottomBarTranslate, {
      toValue: 100,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(contentOpacity, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setMode("shrink");
      setVisibleCircle(true);

      setTimeout(() => {
        setVisibleCircle(false);
        setHasExpanded(false);
        onClose?.();
      }, 450);
    });
  };

  const inputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 600);

    return () => clearTimeout(timer);
  }, []);
  return (
    <Modal visible={showModal} animationType="none" transparent>
      <CircleRevealOverlay
        visible={visibleCircle}
        origin={origin}
        mode={mode}
        color="#121212"
        duration={450}
      />
      <Animated.View
        style={{
          paddingTop: Platform.OS == "android" ? 10 : insets.top + 10,
          paddingBottom: Platform.OS == "android" ? 15 : insets.bottom,
        }}
        className="flex-1 bg-transparent  px-4"
      >
        <Animated.View
          style={{
            opacity: contentOpacity,
          }}
          className="flex-row justify-between items-center mb-6"
        >
          <TouchableOpacity onPress={handleClose}>
            <Text className="text-white text-3xl">✕</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => console.log("Go to drafts")}>
            <Text className="text-[#0368FF] font-sfpro-bold text-xl">
              Drafts
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <KeyboardAvoidingView
          className="flex-1 "
          behavior={"padding"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 5}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: insets.bottom + 20,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={{
                opacity: contentOpacity,
              }}
              className={"flex-1 "}
            >
              <CreatePost
                text={text}
                setText={setText}
                media={media}
                removeItem={removeItem}
                processing={processing}
                inputRef={inputRef}
                preMedia={preMedia}
              />
            </Animated.View>
          </ScrollView>

          <Animated.View
            style={{
              transform: [{ translateY: bottomBarTranslate }],
            }}
          >
            <BottomBar
              text={text}
              openGallery={openGallery}
              openCamera={openCamera}
              progressProps={{
                size,
                strokeWidth,
                radius,
                circumference,
                strokeDashoffset,
              }}
              onPost={() => {
                Keyboard.dismiss();

                if (!shouldShowCommunities || preMedia) {
                  router.replace({
                    pathname: "/(tabs)/home",
                    params: {
                      triggerUpload: "1",
                      communities: "",
                    },
                  });
                  handleClose();
                  return;
                }

                if (selectedCommunityIds.length > 0) {
                  router.replace({
                    pathname: "/(tabs)/home",
                    params: {
                      triggerUpload: "1",
                      communities: selectedCommunityIds.join(","),
                    },
                  });
                  handleClose();
                } else {
                  setTimeout(() => {
                    setShowCommunities(true);
                  }, 60);
                }
              }}
            />
          </Animated.View>

          {shouldShowCommunities && (
            <PostCommunities
              visible={showCommunities}
              onClose={() => setShowCommunities(false)}
              onNudge={() => console.log("Nudge pressed")}
              onDone={(ids) => {
                setSelectedCommunityIds(ids);
              }}
              user={user}
            />
          )}
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
}
