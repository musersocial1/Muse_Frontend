import { icons } from "@/constants/icons";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DragToClose from "../navigations/DragToClose";
import { FadingBlurBackground } from "../ui/FadingBlurBackground";

const { width } = Dimensions.get("window");

interface AddModeratorsFlowProps {
  visible: boolean;
  onClose: () => void;
  onAddModerator: (moderatorData: ModeratorData) => void;
}

interface ModeratorData {
  name: string;
  email: string;
  permissions: {
    memberPosts: boolean;
    creatorPosts: boolean;
    exclusiveContent: boolean;
    groups: boolean;
    communityAnalytics: boolean;
    communityCashflow: boolean;
  };
}

type FlowStep = "empty" | "form" | "permissions" | "success";

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, onToggle }) => {
  return (
    <TouchableOpacity
      onPress={onToggle}
      className={`w-12 h-6 rounded-full p-1 ${
        enabled ? "bg-white" : "bg-gray-600"
      }`}
      activeOpacity={0.8}
    >
      <View
        className={`w-4 h-4 rounded-full ${
          enabled ? "bg-gray-800 ml-auto" : "bg-gray-400"
        }`}
      />
    </TouchableOpacity>
  );
};

const AddModerators: React.FC<AddModeratorsFlowProps> = ({
  visible,
  onClose,
  onAddModerator,
}) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>("empty");
  const [moderatorName, setModeratorName] = useState("");
  const [moderatorEmail, setModeratorEmail] = useState("");
  const [permissions, setPermissions] = useState({
    memberPosts: true,
    creatorPosts: false,
    exclusiveContent: false,
    groups: false,
    communityAnalytics: false,
    communityCashflow: false,
  });

  const insets = useSafeAreaInsets();
  const HIDE_OFFSET = 300;
  const sheetY = useRef(new Animated.Value(HIDE_OFFSET)).current;

  useEffect(() => {
    if (visible) {
      sheetY.setValue(HIDE_OFFSET);
      Animated.timing(sheetY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      sheetY.setValue(HIDE_OFFSET);
      setTimeout(() => {
        setCurrentStep("empty");
        setModeratorName("");
        setModeratorEmail("");
        setPermissions({
          memberPosts: true,
          creatorPosts: false,
          exclusiveContent: false,
          groups: false,
          communityAnalytics: false,
          communityCashflow: false,
        });
      }, 300);
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

  const handleContinueFromForm = () => {
    if (moderatorName.trim() && moderatorEmail.trim()) {
      setCurrentStep("permissions");
    }
  };

  const handleAddModerator = () => {
    const moderatorData: ModeratorData = {
      name: moderatorName,
      email: moderatorEmail,
      permissions,
    };

    onAddModerator(moderatorData);
    setCurrentStep("success");
  };

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderEmptyState = () => (
    <View className=" px-6 pb-6 items-center">
      <Text className="text-[#FFFFFF] text-[20px] font-bold text-center mb-5">
        Moderators
      </Text>

      <View className="w-16 h-16  rounded-full items-center justify-center mb-6">
        <Image
          source={icons.no_moderators}
          className="h-full w-full"
          resizeMode="cover"
        />
      </View>

      <Text className="text-white text-[16px] font-bold text-center mb-4">
        You have not added{"\n"}any moderators
      </Text>

      <Text className="text-white/50 text-center font-medium text-[14px] mb-8 leading-6">
        Moderators help ou manage sections on{"\n"}the platform you give them
        access to
      </Text>

      <TouchableOpacity
        onPress={() => setCurrentStep("form")}
        className="bg-[#0368FF] rounded-full py-4 px-8 w-full "
        activeOpacity={0.8}
      >
        <Text className="text-white text-center text-[16px] font-bold">
          Add moderator
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderModeratorForm = () => (
    <View className="px-6 pb-6">
      <Text className="text-[#FFFFFF] text-[20px] font-bold text-center mb-7">
        Moderator info
      </Text>
      <View className="mb-6 rounded-2xl overflow-hidden">
        <BlurView
          intensity={20}
          tint="light"
          style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
        />
        <TextInput
          value={moderatorName}
          onChangeText={setModeratorName}
          className="px-4 py-6 text-white/50 text-[16px] font-bold "
          placeholder="Moderator name"
          placeholderTextColor="#6B7280"
        />
      </View>

      <View className="mb-10 rounded-2xl overflow-hidden">
        <BlurView
          intensity={20}
          tint="light"
          style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
        />
        <TextInput
          value={moderatorEmail}
          onChangeText={setModeratorEmail}
          className="px-4 py-6 text-white/50 text-[16px] font-bold "
          placeholder="Enter email "
          placeholderTextColor="#6B7280"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity
        onPress={handleContinueFromForm}
        disabled={!moderatorName.trim() || !moderatorEmail.trim()}
        className={`rounded-full py-5 px-8 ${
          moderatorName.trim() && moderatorEmail.trim()
            ? "bg-[#0368FF]"
            : "bg-gray-700"
        }`}
        activeOpacity={0.8}
      >
        <Text
          className={`text-center text-lg font-bold ${
            moderatorName.trim() && moderatorEmail.trim()
              ? "text-white"
              : "text-gray-400"
          }`}
        >
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderPermissions = () => {
    const permissionItems = [
      { key: "memberPosts", label: "Member posts" },
      { key: "creatorPosts", label: "Creator posts" },
      { key: "exclusiveContent", label: "Exclusive content" },
      { key: "groups", label: "Groups" },
      { key: "communityAnalytics", label: "Community analytics" },
      { key: "communityCashflow", label: "Community cashflow" },
    ];

    return (
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pb-6">
          <Text className="text-[#FFFFFF] text-[20px] font-bold text-center mb-7">
            Grant access
          </Text>

          {/* Permission items */}
          <View className="space-y-4 gap-4 mb-8">
            {permissionItems.map((item) => {
              const isSelected =
                permissions[item.key as keyof typeof permissions];

              return (
                <View
                  key={item.key}
                  className="relative rounded-2xl overflow-hidden"
                >
                  <BlurView
                    tint="light"
                    intensity={10}
                    className="rounded-2xl absolute inset-0"
                  />

                  <TouchableOpacity
                    onPress={() =>
                      togglePermission(item.key as keyof typeof permissions)
                    }
                    activeOpacity={0.8}
                    className="flex-row justify-between items-center px-4 py-5"
                  >
                    <Text className="text-white/50 text-[16px] font-bold">
                      {item.label}
                    </Text>

                    {isSelected ? (
                      <View className="w-6 h-6 rounded-full border-2 border-white items-center justify-center">
                        <View className="w-3 h-3 rounded-full bg-white" />
                      </View>
                    ) : (
                      <View className="w-6 h-6 rounded-full border-2 border-white/50" />
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          <TouchableOpacity
            onPress={handleAddModerator}
            className="bg-[#0368FF] rounded-full py-5 px-8 w-[250px] mx-auto"
            activeOpacity={0.8}
          >
            <Text className="text-white text-center text-lg font-bold">
              Add moderator
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderSuccess = () => (
    <View className="p-6 items-center">
      <View className="w-32 h-32  rounded-full items-center justify-center mb-6 p-4">
        <Image
          source={icons.envelope}
          className="h-full w-full"
          resizeMode="cover"
        />
      </View>

      <Text className="text-white text-[20px] font-bold text-center mb-4">
        We sent a moderator invite
      </Text>

      <Text className="text-white/50 text-center font-medium text-[16px] mb-8 leading-6">
        We sent an invite code to {moderatorEmail}.{"\n"}When they accept you
        will be notified
      </Text>

      <TouchableOpacity
        onPress={closeWithSlide}
        className="bg-[#0368FF] rounded-full py-4 px-8  w-[200px] mx-auto"
        activeOpacity={0.8}
      >
        <Text className="text-white text-center text-lg font-bold">Done</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "form":
        return renderModeratorForm();
      case "permissions":
        return renderPermissions();
      case "success":
        return renderSuccess();
      default:
        return renderEmptyState();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1">
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
              <View className="bg-[#1D1D1C] w-full border border-white/10 rounded-[30px] overflow-hidden">
                <DragToClose translateY={sheetY} onClose={onClose} />
                {renderCurrentStep()}
              </View>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default AddModerators;
