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
  const bgAnim = useRef(new Animated.Value(0)).current; // 0 (transparent) → 1 (full opacity)

  const router = useRouter();
  // On first mount, animate the entry of the main card (fade in + slide up)
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, // Fade in to visible
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0, // Slide to default position (from below)
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Combined modal visibility flag for animations (either onboarding or more info modal)
  const anyModalVisible = modalVisible || moreInfoVisible;

  // Animate main card opacity/position based on modal state
  React.useEffect(() => {
    // Animate bg: 1 for visible, 0 for hidden
    Animated.timing(bgAnim, {
      toValue: anyModalVisible ? 1 : 0,
      duration: 600,
      useNativeDriver: false, // backgroundColor can't use native driver
    }).start();
    if (anyModalVisible) {
      // If any modal is open: fade out and slide down the main card
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0, // Fade out
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50, // Slide down by 50 units
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // If no modal is open: fade in and reset position
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1, // Fade in
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0, // Reset slide position
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [anyModalVisible]);

  // Blur background intensity animation based on modal state
  React.useEffect(() => {
    const listener = blurAnim.addListener(({ value }) => {
      setBlurIntensity(value); // Sync local state with animation value
    });

    // Animate blur: show when a modal is open, hide otherwise
    Animated.timing(blurAnim, {
      toValue: anyModalVisible ? 100 : 0, // Max blur = 100, none = 0
      duration: 600,
      useNativeDriver: false, // BlurView requires nativeDriver: false
    }).start();

    return () => blurAnim.removeListener(listener);
  }, [anyModalVisible]);

  const animatedBgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      "rgba(255,255,255,0)", // hidden
      "rgba(255,255,255,0.4)", // visible
    ],
  });

  // Handlers for showing/hiding the onboarding modal and triggering blur animation
  const handleGetStarted = () => {
    setModalVisible(true);
    setCurrentStep(0);
    setPhoneNumber("");
    // Animate blur in when onboarding starts
    Animated.timing(blurAnim, {
      toValue: 100,
      duration: 600,
      useNativeDriver: false,
    }).start();
  };

  const handleModalClose = () => {
    setModalVisible(false);
    resetForm();
    // Animate blur out when modal closes
    Animated.timing(blurAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: false,
    }).start();
  };

  // Onboarding navigation: go to next/previous step in the modal
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

  // Reset all onboarding form fields
  const resetForm = () => {
    setCurrentStep(0);
    setPhoneNumber("");
    setOtpValues(["", "", "", "", ""]);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };

  // Onboarding complete handler
  const handleComplete = (formData: any) => {
    console.log("=== ONBOARDING COMPLETE ===");
    console.log("Final form data:", JSON.stringify(formData, null, 2));

    Alert.alert("Success!", "Account created successfully!", [
      {
        text: "OK",
        onPress: () => {
          setMoreInfoVisible(true); // Open more info modal after success
          setModalVisible(false);
          resetForm();
        },
      },
    ]);
  };

  // More info modal complete handler
  const handleMoreInfoComplete = (moreInfoData: any) => {
    console.log("=== MORE INFO COMPLETE ===");
    console.log("More info data:", JSON.stringify(moreInfoData, null, 2));

    Alert.alert("Success!", "Profile setup completed successfully!", [
      {
        text: "OK",
        onPress: () => {
          // resetForm();
          // setMoreInfoVisible(false); // Close more info modal and go home
          router.replace(RouterConstantUtil.tabs.home as any); // <--- then go home!
        },
      },
    ]);
  };

  // Close more info modal handler
  const handleMoreInfoClose = () => {
    setMoreInfoVisible(false);
  };
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

          <Animated.View
            style={{
              flex: 1,
              paddingHorizontal: 24, // px-6
              backgroundColor: animatedBgColor,
            }}
          >
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

              <View className="w-full  space-y-3">
                <BlurView intensity={20} tint="light">
                  <TouchableOpacity
                    className="bg-white/10 border border-white/20 rounded-2xl py-5 px-6 backdrop-blur-md"
                    activeOpacity={0.8}
                    onPress={() => router.replace("/home")} // Or "/(tabs)/home" if needed
                  >
                    <Text className="text-white text-center font-sfpro-bold text-lg">
                      Already have an account
                    </Text>
                  </TouchableOpacity>
                </BlurView>

                <TouchableOpacity
                  onPress={handleGetStarted}
                  className="bg-secondary rounded-2xl py-5 px-6 shadow-lg mt-4"
                  activeOpacity={0.9}
                >
                  <Text className="text-white text-center  font-sfpro-bold text-lg">
                    Get started
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
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
      {moreInfoVisible && (
        <MoreInfoModal
          visible={moreInfoVisible}
          onClose={handleMoreInfoClose}
          onComplete={handleMoreInfoComplete}
        />
      )}
    </View>
  );
}
