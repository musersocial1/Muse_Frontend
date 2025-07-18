import { images } from "@/constants/images";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BlurView } from "expo-blur";

import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
// import React, { useRef, useState } from "react";
// import { ScrollView, Text, TouchableOpacity, View, Animated } from "react-native";

const { width, height } = Dimensions.get("window");

interface MoreInfoModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
}

export default function MoreInfoModal({
  visible,
  onClose,
  onComplete,
}: MoreInfoModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    birthMonth: "",
    birthDay: "",
    birthYear: "",
    accountType: "",
    gender: "",
    interests: [] as string[],
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleContinue = () => {
    if (currentStep < 3) {
      goToStep(currentStep + 1);
    } else {
      onComplete(formData);
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

  const slideAnim = useRef(new Animated.Value(width)).current; // Start from right edge
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
      }).start(() => {
        // Optionally handle cleanup
      });
    }
  }, [visible]);

  // Date picker data
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const years = Array.from({ length: 50 }, (_, i) => (2024 - i).toString());

  const [prevStep, setPrevStep] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const enterAnim = useRef(new Animated.Value(width)).current; // Incoming step starts offscreen (right)
  const exitAnim = useRef(new Animated.Value(0)).current; // Outgoing step starts at 0
  const goToStep = (next: number) => {
    if (next === currentStep) return;
    setPrevStep(currentStep);
    setCurrentStep(next);
    setIsAnimating(true);

    enterAnim.setValue(width);
    exitAnim.setValue(0);

    Animated.parallel([
      Animated.timing(exitAnim, {
        toValue: -width, // Outgoing moves left
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(enterAnim, {
        toValue: 0, // Incoming moves into view
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setPrevStep(null);
      setIsAnimating(false);
    });
  };

  const ITEM_HEIGHT = 40;

  const insets = useSafeAreaInsets();

  function PickerColumn({ data, selectedValue, onValueChange }: any) {
    const scrollRef = useRef<any>(null);
    const [selectedIndex, setSelectedIndex] = useState(
      data.findIndex((item: any) => item === selectedValue)
    );

    // Scroll to selected on mount/update
    React.useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          y: selectedIndex * ITEM_HEIGHT,
          animated: false,
        });
      }
    }, [selectedIndex]);

    const handleScrollEnd = (e: any) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const newIndex = Math.round(offsetY / ITEM_HEIGHT);
      setSelectedIndex(newIndex);
      onValueChange(data[newIndex]);
    };

    // For display: parse the selectedDate into fields (or use from state)
    const displayBirthday = selectedDate
      ? `${selectedDate.toLocaleString("default", {
          month: "long",
        })} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
      : "Select Date";

    // When date is picked
    const handleDateChange = (event: any, date?: Date) => {
      setShowDatePicker(false); // Always hide the picker after a choice
      if (date) {
        setSelectedDate(date);
        // Update formData as well
        updateFormData(
          "birthMonth",
          date.toLocaleString("default", { month: "long" })
        );
        updateFormData("birthDay", date.getDate().toString());
        updateFormData("birthYear", date.getFullYear().toString());
      }
    };

    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={handleScrollEnd}
          contentContainerStyle={{
            paddingVertical: ITEM_HEIGHT * 2, // Top/bottom padding for centering
          }}
        >
          {data.map((item: any, idx: any) => {
            const isSelected = idx === selectedIndex;
            return (
              <View
                key={item}
                style={{
                  height: ITEM_HEIGHT,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: isSelected ? 24 : 18,
                    color: isSelected ? "#111" : "#aaa",
                    fontWeight: isSelected ? "bold" : "normal",
                    transform: [{ scale: isSelected ? 1.03 : 1 }],
                    opacity: isSelected ? 1 : 0.5,
                  }}
                >
                  {item}
                </Text>
              </View>
            );
          })}
        </ScrollView>
        {/* Center highlight line */}
        <View
          style={{
            position: "absolute",
            top: ITEM_HEIGHT * 2,
            height: ITEM_HEIGHT,
            left: 0,
            right: 0,
            borderRadius: 12,
            backgroundColor: "#fff8",
            borderWidth: 2,
            borderColor: "#e3e6e8",
            zIndex: 2,
          }}
          pointerEvents="none"
        />
      </View>
    );
  }

  const Header = () => (
    <View className="flex-row items-start justify-between px-6  pb-2">
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
    <View className="px-6  w-full  pt-2">
      <TouchableOpacity
        onPress={handleContinue}
        className="bg-secondary py-4 rounded-full"
      >
        <Text className="text-white text-center font-semibold text-lg">
          {currentStep === 3 ? "Continue" : "Continue"}
        </Text>
      </TouchableOpacity>
    </View>
  );
  const renderDateStep = () => (
    <View
      // style={{ height: height - (insets.bottom + insets.top) }}
      className=" flex-1 h-full "
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
        {/* DatePicker modal */}
        <BlurView
          intensity={100}
          style={{
            borderRadius: 24, // big round corners
            width: width * 0.9, // ~88% of screen width
            backgroundColor: "transparent",
            padding: 6,
            margin: 0,
            alignItems: "center",
            shadowColor: "#000", // shadow for iOS
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.13,
            shadowRadius: 12,
            elevation: 4, // shadow for Android (not visible with iOS spinner, but safe)
            alignSelf: "center",
          }}
          tint="light"
          className=" bg-black/20  overflow-hidden py-2.5 relativ "
        >
          <Animated.View className=" bg-white p-2  rounded-[24px]">
            <DateTimePicker
              testID="dateTimePicker"
              value={selectedDate || new Date(2000, 0, 1)}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              // maximumDate={new Date()}
              style={{
                backgroundColor: "white", // don't override parent bg
                width: "100%",
                borderRadius: 24, // big round corners
              }}
              textColor="black"
              // onChange={handleDateChange}
            />
          </Animated.View>
        </BlurView>
      </View>
      {/* <ButtonFooter /> */}
    </View>
  );

  const renderAccountTypeStep = () => (
    <View className=" flex-1  justify-between ">
      <View className="px-6 mt-4 mb-8">
        <Text className="text-[#FFFFFF] text-[32px] font-medium text-start mb-2">
          {`Select your \naccount type`}
        </Text>
        <Text className="text-white/70 text-start text-[16px]">
          You can switch this later in your profile setting
        </Text>
      </View>

      {/* Account Options */}
      <View className="flex-1 justify-center px-6">
        <View className="space-y-4 gap-3">
          <View className="bg-white rounded-2xl p-4 flex-row items-center border-[5px] border-[#FFFFFF1A]/70">
            <View className="w-16 h-16 bg-[#F3F3F3] rounded-full mr-4 items-center justify-center">
              <Text className="text-lg">
                <Feather name="user" size={32} color="#888" />
              </Text>
            </View>
            <Text className="flex-1 text-[#000000] font-bold text-[16px]">
              Join a community
            </Text>
            <TouchableOpacity
              onPress={() => updateFormData("accountType", "join")}
              className={`px-8 py-3 rounded-full ${
                formData.accountType === "join" ? "bg-blue-500" : "bg-secondary"
              }`}
            >
              <Text className="text-white font-medium">Select</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-2xl p-4 flex-row items-center">
            <View className="w-16 h-16 bg-disabled rounded-full mr-4 items-center justify-center">
              <Text className="text-lg">
                <Feather name="star" size={32} color="#888" />{" "}
              </Text>
            </View>
            <Text className="flex-1 text-black font-bold text-[16px]">
              Create a community
            </Text>
            <TouchableOpacity
              onPress={() => updateFormData("accountType", "create")}
              className={`px-8 py-3 rounded-full ${
                formData.accountType === "create"
                  ? "bg-blue-500"
                  : "bg-secondary"
              }`}
            >
              <Text className="text-white font-medium">Select</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderGenderStep = () => (
    <View
      // style={{ height: height - (insets.bottom + insets.top) }}
      className=" flex-1 justify-between "
    >
      <View className="px-6 mt-4 mb-8">
        <Text className="text-[#FFFFFF] text-[32px] font-medium text-start mb-2">
          {`What's your\nGender`}
        </Text>
        <Text className="text-white/70 text-start text-[16px]">
          Tell us how you want to be identified
        </Text>
      </View>

      <View className="flex-1 justify-center px-6">
        <View className="flex-row space-x-4 gap-2 mb-6">
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
                className={`flex-1 rounded-3xl overflow-hidden relative h-[280px] ${
                  selected ? "" : ""
                }`}
              >
                <Image
                  source={image}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={() => updateFormData("gender", "other")}
          className={`bg-black/45 p-5 rounded-3xl flex-row items-center justify-between ${
            formData.gender === "other" ? "border-4 border-white/50" : ""
          }`}
        >
          <Text className="text-white text-[18px] font-medium">
            Prefer not to say
          </Text>
          <View
            className={`w-6 h-6 rounded-full border-2 border-white/50 mr-4 ${
              formData.gender === "other" ? "bg-secondary" : ""
            }`}
          />
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
      <View
        // style={{ height: height - (insets.bottom + insets.top) }}
        className="  flex-1 justify-between "
      >
        <ScrollView className="flex-1">
          <View className="px-6 mt-4 mb-6">
            <Text className="text-[#FFFFFF] text-[32px] font-medium text-start mb-2">
              {`What are your\ninterests`}
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
                              ? "text-white"
                              : "text-white/70"
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

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      className="flex-1"
    >
      <SafeAreaView
        className="flex-1  relative"
        style={{ paddingBottom: insets.bottom, paddingTop: insets.top }}
      >
        <Header />
        <Animated.View
          className="flex-1 relative"
          // style={{
          //   flex: 1,
          //   transform: [{ translateX: slideAnim }],
          // }}
        >
          {/* Header */}

          {/* Outgoing */}
          {isAnimating && prevStep !== null && (
            <Animated.View
              style={{
                position: "relative",
                width,
                height: "100%",
                top: 0,
                left: 0,
                transform: [{ translateX: exitAnim }],
                zIndex: 1,
              }}
            >
              {renderStep(prevStep)}
            </Animated.View>
          )}

          {/* {renderCurrentStep()} */}

          {/* Incoming / current */}
          <Animated.View
            style={{
              width,
              height: "100%",
              transform: [{ translateX: isAnimating ? enterAnim : 0 }],
              position: "absolute",
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
    </Modal>
  );
}
