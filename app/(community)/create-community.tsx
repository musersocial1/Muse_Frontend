import CommunityCategory from "@/components/community/CommunityCategory";
import CommunityDetails from "@/components/community/CommunityDetailsScreen";
import CommunityImageScreen from "@/components/community/CommunityImageScreen";
import CommunityNameScreen from "@/components/community/CommunityName";
import CommunityTypeScreen from "@/components/community/CommunityType";
import DoneCreating from "@/components/community/DoneCreating";
import Guidelines from "@/components/community/GuildeLines";
import PricingScreen from "@/components/community/Pricing";
import { CommunityData } from "@/types/community";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const CreateCommunity: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [communityData, setCommunityData] = useState<CommunityData>({
    name: "",
    coverImage: "",
    location: "",
    categories: [""],
    price: "",
    isPrivate: false,
    isPaidCommunity: false,
    guidelines: "",
  });

  const slideAnim = useRef(new Animated.Value(0)).current;

  const updateData = (data: Partial<CommunityData>) => {
    setCommunityData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < 8) {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep((prev) => prev + 1);
        slideAnim.setValue(width);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep((prev) => prev - 1);
        slideAnim.setValue(-width);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  useEffect(() => {
    if ([1, 2, 7].includes(currentStep)) {
      StatusBar.setBackgroundColor("#0368FF", true); // blue
    } else {
      StatusBar.setBackgroundColor("#FF6A00", true); // orange
    }
  }, [currentStep]);

  const handleSubmit = () => {
    console.log("Community Created:", communityData);
    nextStep();
  };

  const renderCurrentScreen = () => {
    const screenProps = {
      data: communityData,
      onUpdate: updateData,
      onNext: nextStep,
      onBack: prevStep,
    };

    switch (currentStep) {
      case 1:
        return <CommunityNameScreen {...screenProps} />;
      case 2:
        return <CommunityImageScreen {...screenProps} />;
      case 3:
        return <CommunityDetails {...screenProps} />;
      case 4:
        return <PricingScreen {...screenProps} />;
      case 5:
        return <CommunityTypeScreen {...screenProps} />;
      case 6:
        return <Guidelines {...screenProps} />;
      case 7:
        return <CommunityCategory {...screenProps} onSubmit={handleSubmit} />;
      case 8:
        return <DoneCreating />;
      default:
        return <CommunityNameScreen {...screenProps} />;
    }
  };

  return (
    <SafeAreaView
      className={`${
        [1, 2].includes(currentStep) ? "bg-black" : "bg-primary" // bg-[#FF6A00] ths is orange
      } flex-1 `}
    >
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateX: slideAnim }],
        }}
      >
        {renderCurrentScreen()}
      </Animated.View>
    </SafeAreaView>
  );
};

export default CreateCommunity;
