import MoreInfoModal from "@/components/modals/MoreInfo";
import OnboardingModal from "@/components/modals/OnboardingModal";
import { images } from "@/constants/images";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  ImageBackground,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", ""]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [moreInfoVisible, setMoreInfoVisible] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const router = useRouter();

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    setModalVisible(true);
    setCurrentStep(0);
    setPhoneNumber("");
  };

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setCurrentStep(0);
    setPhoneNumber("");
    setOtpValues(["", "", "", "", ""]);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };

  const handleComplete = (formData: any) => {
    console.log("=== ONBOARDING COMPLETE ===");
    console.log("Final form data:", JSON.stringify(formData, null, 2));

    Alert.alert("Success!", "Account created successfully!", [
      {
        text: "OK",
        onPress: () => {
          setMoreInfoVisible(true);
          resetForm();
        },
      },
    ]);
  };

  const handleMoreInfoComplete = (moreInfoData: any) => {
    console.log("=== MORE INFO COMPLETE ===");
    console.log("More info data:", JSON.stringify(moreInfoData, null, 2));

    Alert.alert("Success!", "Profile setup completed successfully!", [
      {
        text: "OK",
        onPress: () => {
          resetForm();
          setMoreInfoVisible(false);
          router.push(RouterConstantUtil.tabs.home as any);
        },
      },
    ]);
  };

  const handleMoreInfoClose = () => {
    setMoreInfoVisible(false);
  };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <ImageBackground
        source={images.splash}
        resizeMode="cover"
        className="flex-1"
      >
        <View className="flex-1 px-6">
          {/* Bottom section with content */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
            className="flex-1 justify-end pb-20"
          >
            <View className="items-center">
              <Image
                source={images.logo}
                className="w-52 h-20"
                resizeMode="contain"
              />
            </View>
            <View className="items-center mb-10">
              <Text className="text-[#FFFFFF] text-3xl font-bold text-center leading-tight mb-2">
                Access over 1000+{"\n"}tailored{" "}
                <Text className="text-[#FFFFFF]">communities</Text>
              </Text>
            </View>

            <View className="w-full space-y-3">
              <TouchableOpacity
                className="bg-white/10 border border-white/20 rounded-2xl py-5 px-6 backdrop-blur-md"
                activeOpacity={0.8}
              >
                <Text className="text-white text-center font-medium text-base">
                  Already have an account
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleGetStarted}
                className="bg-secondary rounded-2xl py-5 px-6 shadow-lg mt-4"
                activeOpacity={0.9}
              >
                <Text className="text-white text-center font-medium text-base">
                  Get started
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ImageBackground>

      <OnboardingModal
        visible={modalVisible}
        onClose={handleModalClose}
        currentStep={currentStep}
        onContinue={handleContinue}
        onBack={handleBack}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        otpValues={otpValues}
        setOtpValues={setOtpValues}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        username={username}
        setUsername={setUsername}
        onComplete={handleComplete}
      />
      <MoreInfoModal
        visible={moreInfoVisible}
        onClose={handleMoreInfoClose}
        onComplete={handleMoreInfoComplete}
      />
    </>
  );
}
