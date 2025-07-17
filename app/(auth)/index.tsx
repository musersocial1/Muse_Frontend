import MoreInfoModal from "@/components/modals/MoreInfo";
import OnboardingModal from "@/components/modals/OnboardingModal";
import { images } from "@/constants/images";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";

import {
  Alert,
  Animated,
  Image,
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
  const [moreInfoVisible, setMoreInfoVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
  const blurAnim = useRef(new Animated.Value(0)).current;
  const [blurIntensity, setBlurIntensity] = useState(0);

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

  React.useEffect(() => {
    if (modalVisible) {
      // Animate OUT: fade to 0, slide down (e.g., +50px)
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate IN: fade to 1, slide to original
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [modalVisible]);

  const handleGetStarted = () => {
    setModalVisible(true);
    setCurrentStep(0);
    setPhoneNumber("");
    Animated.timing(blurAnim, {
      toValue: 100,
      duration: 600,
      useNativeDriver: false,
    }).start();
  };

  const handleModalClose = () => {
    setModalVisible(false);
    resetForm();
    Animated.timing(blurAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: false,
    }).start();
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

  React.useEffect(() => {
    const listener = blurAnim.addListener(({ value }) => {
      setBlurIntensity(value);
    });

    Animated.timing(blurAnim, {
      toValue: modalVisible ? 100 : 0,
      duration: 600,
      useNativeDriver: false, // must be false for blur intensity
    }).start();

    return () => blurAnim.removeListener(listener);
  }, [modalVisible]);

  return (
    <View className="flex-1">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <View
        // source={images.splash}
        // resizeMode="cover"
        className="flex-1 relative"
      >
        <Image
          source={images.splash}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            resizeMode: "cover",
          }}
        />

        <BlurView intensity={blurIntensity} tint="dark" className="   flex-1">
          {/* <View className=" bg-black h-full  flex-1 inset-0 z-[100]" /> */}

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
                  onPress={() => router.replace("/home")} // Or "/(tabs)/home" if needed
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
        </BlurView>
      </View>

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
    </View>
  );
}
