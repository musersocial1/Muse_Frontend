import CommunityImageScreen from "@/components/community/CommunityImage";
import CommunityNameScreen from "@/components/community/CommunityName";
import DoneCreating from "@/components/community/DoneCreating";
import Preview from "@/components/community/Preview";
import ProgressBar from "@/components/community/ProgressBar";
import ProgressiveBlur from "@/components/ui/progressiveBlur";
import { communityAPI } from "@/lib/api/community";
import { showError, showSuccess } from "@/lib/toast";
import { CommunityData } from "@/types/community";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { View } from "react-native-animatable";

const { width } = Dimensions.get("window");

const TOTAL_STEPS = 4;

const CreateCommunity: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [displayedStep, setDisplayedStep] = useState(1);
  const [prevStep, setPrevStep] = useState<number | null>(null);
  const [nextStep, setNextStep] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [communityData, setCommunityData] = useState<CommunityData>({
    name: "",
    coverImage: "",
    bio: "",
    categories: [],
    coverImageUploadUrl: "",
    coverImageKey: "",
    price: "",
    isPrivate: false,
    isPaidCommunity: false,
    guidelines: "",
    links: [],
  });

  const enterAnim = useRef(new Animated.Value(width)).current;
  const exitAnim = useRef(new Animated.Value(0)).current;

  const updateData = (data: Partial<CommunityData>) => {
    setCommunityData((prev) => ({ ...prev, ...data }));
  };
  const opacityAnim = useRef(new Animated.Value(1)).current;

  // Step controls
  const goToStep = (next: number) => {
    if (next === currentStep || next < 1 || next > TOTAL_STEPS) return;
    setDirection(next > currentStep ? 1 : -1);
    setPrevStep(displayedStep);
    setNextStep(next);
    setIsAnimating(true);
    setCurrentStep(next);
    enterAnim.setValue(width * (next > currentStep ? 1 : -1));
    exitAnim.setValue(0);

    Animated.parallel([
      Animated.timing(exitAnim, {
        toValue: -width * (next > currentStep ? 1 : -1),
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(enterAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentStep(next);
      setDisplayedStep(next);
      setPrevStep(null);
      setNextStep(null);
      setIsAnimating(false);

      opacityAnim.setValue(1);
    });
  };
  const [lastStep, setLastStep] = useState(1);

  const bgAnim = useRef(
    new Animated.Value(currentStep >= 3 ? 0 : width)
  ).current;
  const gradientAnim = useRef(new Animated.Value(0)).current;
  const bgOpacityAnim = useRef(
    new Animated.Value(currentStep >= 3 ? 1 : 0)
  ).current;
  const gradientOpacity = useRef(
    new Animated.Value(currentStep < 3 ? 1 : 0)
  ).current;

  useEffect(() => {
    if (currentStep >= 3 && lastStep < 3) {
      Animated.parallel([
        Animated.timing(gradientOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(bgOpacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(gradientAnim, {
          toValue: -width,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(bgAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (currentStep < 3 && lastStep >= 3) {
      Animated.parallel([
        Animated.timing(gradientOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(bgOpacityAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(gradientAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(bgAnim, {
          toValue: width,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
    setLastStep(currentStep);
  }, [currentStep]);

  const goNextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      if (currentStep === 4) {
        handleSubmit();
      } else {
        goToStep(currentStep + 1);
      }
    }
  };

  const goPrevStep = () => {
    if (currentStep > 1) goToStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const payload = {
        name: communityData.name,
        coverImage: {
          url: communityData.coverImage,
          key: communityData.coverImageKey,
        },
        bio: communityData.bio,
        links: communityData.links,
        price: communityData.isPaidCommunity
          ? parseFloat(communityData.price) || 0
          : 0,
        type: communityData.isPrivate ? "private" : "public",
        guideline: communityData.guidelines,
        category: communityData.categories[1],
      };

      await communityAPI.createCommunity(payload);
      showSuccess("Community created successfully");
      goToStep(8);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create community";
      showError("Failed", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderScreen = (step: number) => {
    const screenProps = {
      data: communityData,
      onUpdate: updateData,
      onNext: goNextStep,
      onBack: goPrevStep,
    };

    switch (step) {
      case 1:
        return <CommunityNameScreen {...screenProps} />;
      case 2:
        return <CommunityImageScreen {...screenProps} />;
      case 3:
        return <Preview {...screenProps} />;
      case 4:
        return <DoneCreating />;
      default:
        return <CommunityNameScreen {...screenProps} />;
    }
  };

  return (
    <View
      className={`${
        [1, 2].includes(currentStep) ? "bg-black" : "bg-primary"
      } flex-1`}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            zIndex: 0,
            opacity: gradientOpacity,
            transform: [{ translateX: gradientAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={["#0368FF", "#703636", "#000000"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            zIndex: 1,
            opacity: bgOpacityAnim,
            transform: [{ translateX: bgAnim }],
          },
        ]}
      >
        <ProgressiveBlur useAlt={currentStep >= 4} />
        <View className="w-full aspect-[1/1.3]">
          <Image
            source={{
              uri:
                communityData.coverImage ||
                "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400",
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      </Animated.View>

      <View className="flex-1 z-[100] justify-between">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "padding"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            style={{ flex: 1 }}
          >
            <View className="flex-1   justify-between">
              {isAnimating && prevStep !== null && (
                <Animated.View
                  style={{
                    position: "absolute",
                    left: 0,
                    // right: 0,
                    // top: 0,
                    height: "100%",
                    // bottom: 0,
                    zIndex: 1,
                    width: "100%",
                    transform: [{ translateX: exitAnim }],
                    opacity: opacityAnim,
                  }}
                  className="flex-1 "
                >
                  {renderScreen(prevStep)}
                </Animated.View>
              )}
              <Animated.View
                style={{
                  width: "100%",
                  flex: 1,
                  transform: [
                    {
                      translateX: isAnimating
                        ? enterAnim
                        : new Animated.Value(0),
                    },
                  ],
                  position: isAnimating ? "absolute" : "relative",
                  left: 0,
                  // top: 0,
                  // right: 0,
                  // bottom: 0,
                  height: "100%",

                  zIndex: 2,
                }}
                className="flex-1 "
              >
                {renderScreen(
                  isAnimating && nextStep !== null ? nextStep : displayedStep
                )}
              </Animated.View>
            </View>

            {currentStep < 4 && (
              <View className="pb-8 px-4">
                <ProgressBar
                  currentStep={Math.min(currentStep, 4)}
                  totalSteps={4}
                />
                <TouchableOpacity
                  onPress={goNextStep}
                  className="rounded-full bg-[#0368FF] py-4 mt-6"
                >
                  <Text className="text-white text-xl font-sfpro-bold text-center">
                    {currentStep === 4 ? "Create Community" : "Save & Continue"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default CreateCommunity;
