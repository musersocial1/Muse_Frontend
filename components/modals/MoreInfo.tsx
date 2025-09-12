import { images } from "@/constants/images";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BlurView } from "expo-blur";

import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

interface MoreInfoModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: (data: {
    birthMonth: number;
    birthDay: number;
    birthYear: number;
    accountType: string;
    gender: string;
    interests: string[];
  }) => void;
}

export default function MoreInfoModal({
  visible,
  onClose,
  onComplete,
}: MoreInfoModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    birthMonth: 0,
    birthDay: 0,
    birthYear: 0,
    accountType: "",
    gender: "",
    interests: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());

  // Handle date change from DateTimePicker
  const handleDateChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedDate(date);
      setFormData((prev) => ({
        ...prev,
        birthMonth: date.getMonth() + 1,
        birthDay: date.getDate(),
        birthYear: date.getFullYear(),
      }));
    }
  };

  // Validation
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0: // Date step
        return (
          formData.birthYear > 0 &&
          formData.birthMonth > 0 &&
          formData.birthDay > 0
        );
      case 1: // Account type step
        return formData.accountType !== "";
      case 2: // Gender step
        return formData.gender !== "";
      case 3: // Interests step
        return formData.interests.length > 0;
      default:
        return false;
    }
  };

  const handleContinue = async () => {
    if (!isStepValid(currentStep) || isLoading) return;

    if (currentStep < 3) {
      goToStep(currentStep + 1);
    } else {
      setIsLoading(true);
      try {
        // onComplete can be async!
        await onComplete(formData);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const enterOpacity = useRef(new Animated.Value(0)).current;
  const exitOpacity = useRef(new Animated.Value(1)).current;

  const slideAnim = useRef(new Animated.Value(width)).current;
  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const [prevStep, setPrevStep] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const enterAnim = useRef(new Animated.Value(width)).current;
  const exitAnim = useRef(new Animated.Value(0)).current;

  const STEP_CONTAINER_HEIGHT = 350; // Whatever fits the largest content

  const goToStep = (next: number) => {
    if (next === currentStep) return;

    setPrevStep(currentStep);
    setCurrentStep(next);
    setIsAnimating(true);
    enterOpacity.setValue(0);
    exitOpacity.setValue(1);
    enterAnim.setValue(width);
    exitAnim.setValue(0);

    Animated.parallel([
      Animated.timing(exitAnim, {
        toValue: -width,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(exitOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(enterAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setPrevStep(null);
      setIsAnimating(false);
    });
  };

  const insets = useSafeAreaInsets();

  const Header = () => (
    <View className="flex-row items-start justify-between px-6 ">
      <View className="flex-1 items-start">
        <Image
          source={images.logo}
          className="w-36 h-20"
          resizeMode="contain"
        />
      </View>
    </View>
  );

  const ButtonFooter = () => (
    <View className="px-6 w-full pt-2">
      <TouchableOpacity
        onPress={handleContinue}
        disabled={!isStepValid(currentStep) || isLoading}
        className={`h-[3.7rem] items-center flex justify-center rounded-full ${
          isLoading
            ? "bg-white"
            : isStepValid(currentStep)
            ? "bg-secondary"
            : "bg-gray-400"
        }`}
      >
        {/* <Text className="text-white text-center font-semibold text-lg">
          {currentStep === 3 ? "Complete" : "Continue"}
        </Text> */}
        {isLoading ? (
          <ActivityIndicator size="small" color="#0368FF" />
        ) : (
          <Text className="text-white text-center font-semibold text-lg">
            {currentStep === 3 ? "Complete" : "Continue"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderDateStep = () => (
    <View
      style={{ minHeight: STEP_CONTAINER_HEIGHT }}
      className="flex-1  h-full"
    >
      <View className="px-6 mt-4 mb-8">
        <Text className="text-[#FFFFFF] text-[32px] font-medium text-start mb-2">
          {`We'd love to know your \nbirthday — just the date!`}
        </Text>
        <Text className="text-white/70 text-start text-[16px]">
          Fill in your birthday details below
        </Text>
      </View>
      <View
        style={{ transform: [{ translateY: -30 }] }}
        className="flex-1 items-center justify-center"
      >
        <BlurView
          intensity={100}
          style={{
            borderRadius: 24,
            width: width * 0.9,
            backgroundColor: "transparent",
            padding: 6,
            margin: 0,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.13,
            shadowRadius: 12,
            elevation: 4,
            alignSelf: "center",
          }}
          tint="light"
          className="bg-black/20 overflow-hidden py-2.5 relative"
          experimentalBlurMethod="dimezisBlurView"
        >
          <Animated.View className="bg-white p-2 rounded-[24px]">
            <DateTimePicker
              testID="dateTimePicker"
              value={selectedDate}
              mode="date"
              display={"spinner"}
              // maximumDate={new Date()}
              style={{
                backgroundColor: "white",
                width: "100%",
                borderRadius: 24,
              }}
              textColor="black"
              onChange={handleDateChange}
            />
          </Animated.View>
        </BlurView>
      </View>
    </View>
  );

  const renderAccountTypeStep = () => (
    <View
      style={{ minHeight: STEP_CONTAINER_HEIGHT }}
      className="flex-1 justify-between"
    >
      <View className="px-4 mt-4 mb-8">
        <Text className="text-[#FFFFFF] font-sfpro-medium text-[32px] font-medium text-start mb-2">
          {`Select your \naccount type`}
        </Text>
        <Text className="text-white/70  text-start text-[16px]">
          You can switch this later in your profile setting
        </Text>
      </View>

      <View className="flex-1 justify-center px-4">
        <View className="space-y-5 gap-3">
          <View className="overflow-hidden rounded-[30px]">
            <BlurView
              intensity={100}
              tint="light"
              className=" p-1.5 overflow-hidden "
              experimentalBlurMethod="dimezisBlurView"
            >
              <TouchableOpacity
                onPress={() => updateFormData("accountType", "join")}
                className={`bg-white rounded-[30px] p-2.5 flex-row items-center `}
              >
                <View className="w-14 h-14 bg-[#F3F3F3] rounded-full mr-4 items-center justify-center">
                  <Image
                    source={images.createCommunity}
                    className=" w-14 h-14"
                    resizeMode="contain"
                  />
                </View>
                <Text className="flex-1 text-[#000000] font-sfpro-bold text-[16px]">
                  Join a community
                </Text>

                <TouchableOpacity
                  disabled={formData.accountType === "join_community"}
                  onPress={() =>
                    updateFormData("accountType", "join_community")
                  }
                  className={`px-4  py-3 rounded-full ml-2 ${
                    formData.accountType !== "join_community"
                      ? "bg-[#0368FF] text-white"
                      : "text-white bg-gray-400"
                  }`}
                  activeOpacity={
                    formData.accountType === "join_community" ? 1 : 0
                  }
                >
                  <Text
                    className={` font-neutral-bold  ${
                      formData.accountType !== "join_community"
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {formData.accountType === "join_community"
                      ? "Selected"
                      : "Select"}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </BlurView>
          </View>

          <View className="overflow-hidden rounded-[30px]">
            <BlurView
              intensity={100}
              tint="light"
              className=" p-1.5 overflow-hidden "
              experimentalBlurMethod="dimezisBlurView"
            >
              <TouchableOpacity
                onPress={() =>
                  updateFormData("accountType", "create_community")
                }
                className={`bg-white  rounded-[30px] p-2.5  flex-row items-center `}
              >
                <View className="w-14 h-14 bg-[#F3F3F3] rounded-full mr-3 items-center justify-center">
                  <Image
                    source={images.joinCommunity}
                    className=" w-14 h-14"
                    resizeMode="contain"
                  />
                </View>
                <Text className="flex-1 text-black font-bold text-[16px]">
                  Create a community
                </Text>

                <TouchableOpacity
                  disabled={formData.accountType === "create_community"}
                  onPress={() =>
                    updateFormData("accountType", "create_community")
                  }
                  className={`px-4  py-3 rounded-full ml-2 ${
                    formData.accountType !== "create_community"
                      ? "bg-[#0368FF] text-white"
                      : "text-white bg-gray-400"
                  }`}
                  activeOpacity={
                    formData.accountType === "create_community" ? 1 : 0
                  }
                >
                  <Text
                    className={` font-neutral-bold  ${
                      formData.accountType !== "create"
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {formData.accountType === "create_community"
                      ? "Selected"
                      : "Select"}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </BlurView>
          </View>
        </View>
      </View>
    </View>
  );
  const tr = [{ translateY: -20 }]; // Moves 50 units DOWN
  // or use a negative value to move up: [{ translateY: -30 }]

  const renderGenderStep = () => (
    <View className="flex-1 justify-between">
      <View className="px-6  mb-8">
        <Text className="text-[#FFFFFF] text-[32px] font-medium text-start mb-2">
          {`What's your\nGender`}
        </Text>
        <Text className="text-white/70 text-start text-[16px]">
          Tell us how you want to be identified
        </Text>
      </View>

      <View style={{ transform: tr }} className="flex-1  justify-center px-4">
        <View className="flex-row space-x-4 gap-3 mb-3">
          {[
            {
              gender: "female",
              label: "Female",
              image: images.female,
            },
            {
              gender: "male",
              label: "Male",
              image: images.male,
            },
          ].map(({ gender, label, image }) => {
            const selected = formData.gender === gender;
            return (
              <TouchableOpacity
                key={gender}
                onPress={() => updateFormData("gender", gender)}
                className={`w-[40vw] h-fit aspect-[1/1.5] flex-1  bg-white rounded-[20px] overflow-hidden relative  ${
                  selected
                    ? "border-2 border-transparent"
                    : "border-2 border-transparent"
                }`}
              >
                <Image
                  source={image}
                  className="w-full scale-150 h-full"
                  resizeMode="cover"
                />
                <Text className="absolute bottom-[5%] text-white font-neutral-medium text-3xl capitalize left-[4%]">
                  {gender}
                </Text>
                {selected && (
                  <View className="absolute top-4 right-4 w-8 h-8 bg-secondary rounded-full items-center justify-center">
                    <Feather name="check" size={16} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={() => updateFormData("gender", "other")}
          className={`  overflow-hidden rounded-3xl flex-row items-center justify-between `}
        >
          <BlurView
            intensity={70}
            tint="dark"
            className="flex items-center w-full flex-row justify-between h-full p-7"
            experimentalBlurMethod="dimezisBlurView"
          >
            <Text className="text-white font-neutral-medium leading-[20px]  text-[20px] font-medium">
              Prefer not to say
            </Text>
            <View
              className={`w-6 h-6 rounded-full border-2 border-white/50 ${
                formData.gender === "other" ? "bg-secondary" : ""
              }`}
            />
          </BlurView>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderInterestsStep = () => {
    const interestCategories = [
      {
        title: "Sport",
        items: [
          "Football",
          "Tennis",
          "Basketball",
          "Soccer",
          "Baseball",
          "Cricket",
          "Boxing",
          "Golf",
        ],
      },
      {
        title: "Science",
        items: ["Rocket science", "Science & technology", "Satellite"],
      },
      {
        title: "Foods",
        items: ["Food", "Drinks", "Healthy eating"],
      },
      {
        title: "Technology",
        items: ["Design", "Coding", "AI", "Security"],
      },
      {
        title: "Gadgets",
        items: ["Smartphones", "Laptop", "TVs", "Arcade", "Headset"],
      },
    ];

    return (
      <View className="flex-1 justify-between">
        <ScrollView className="flex-1">
          <View className="px-6 mt-4 mb-6">
            <Text className="text-[#FFFFFF] text-[32px] font-medium text-start mb-2">
              {`What are your\ninterests`}
            </Text>
            <Text className="text-white/70 text-start text-[16px]">
              Select at least one interest to continue
            </Text>
          </View>

          <View className="flex-1 px-6">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              {interestCategories.map((category, index) => (
                <View key={index} className="mb-6">
                  <Text className="text-[#FFFFFF] font-extrabold text-[18px] mb-3">
                    {category.title}
                  </Text>
                  <View className="flex-row flex-wrap">
                    {category.items.map((item, itemIndex) => (
                      <TouchableOpacity
                        key={itemIndex}
                        onPress={() => toggleInterest(item)}
                        className={`mr-2 mb-2 px-4 py-3 rounded-full ${
                          formData.interests.includes(item)
                            ? "bg-secondary"
                            : "bg-[#FFFFFF14]/20"
                        }`}
                      >
                        <Text
                          className={`text-[15px] ${
                            formData.interests.includes(item)
                              ? "text-white font-medium"
                              : "text-white"
                          }`}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  };

  function renderStep(step: any) {
    switch (step) {
      case 0:
        return renderDateStep();
      case 1:
        return renderAccountTypeStep();
      case 2:
        return renderGenderStep();
      case 3:
        return renderInterestsStep();
      default:
        return renderDateStep();
    }
  }

  // Reset form when modal closes
  React.useEffect(() => {
    if (!visible) {
      setCurrentStep(0);
      setFormData({
        birthMonth: 0,
        birthDay: 0,
        birthYear: 0,
        accountType: "",
        gender: "",
        interests: [],
      });
      setSelectedDate(new Date());
    }
  }, [visible]);

  return (
    <SafeAreaView
      className="flex-1 justify-between relative"
      style={
        {
          // paddingBottom: 70,
          // top: insets.top,
        }
      }
    >
      <Header />
      <Animated.View className="flex-1 relative">
        {/* Outgoing step animation */}
        {isAnimating && prevStep !== null && (
          <Animated.View
            style={{
              position: "absolute",
              width,
              height: "100%",
              top: 0,
              left: 0,
              opacity: exitOpacity,
              transform: [{ translateX: exitAnim }],
              zIndex: 1,
            }}
          >
            {renderStep(prevStep)}
          </Animated.View>
        )}

        {/* Current step */}
        <Animated.View
          style={{
            width,
            height: "100%",
            transform: [{ translateX: isAnimating ? enterAnim : 0 }],
            // opacity: isAnimating ? enterOpacity : 1,
            position: isAnimating ? "absolute" : "relative",
            top: 0,
            left: 0,
            zIndex: 2,
          }}
        >
          {renderStep(currentStep)}
        </Animated.View>
      </Animated.View>
      <ButtonFooter />
    </SafeAreaView>
  );
}
