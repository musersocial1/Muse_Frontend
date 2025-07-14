import { images } from "@/constants/images";
import { BlurView as ExpoBlurView } from "expo-blur";
import { Sparkles, User } from "lucide-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
    birthMonth: "September",
    birthDay: "17",
    birthYear: "2021",
    accountType: "",
    gender: "",
    interests: [] as string[],
  });

  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
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

  const DatePicker = ({
    data,
    selectedValue,
    onValueChange,
  }: {
    data: string[];
    selectedValue: string;
    onValueChange: (value: string) => void;
  }) => {
    const selectedIndex = data.findIndex((item) => item === selectedValue);

    return (
      <View className="flex-1 mx-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: 60,
            alignItems: "center",
          }}
          snapToInterval={40}
          decelerationRate="fast"
        >
          {data.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onValueChange(item)}
              className="h-10 justify-center items-center"
            >
              <Text
                className={`text-lg ${
                  item === selectedValue
                    ? "text-black font-semibold"
                    : "text-gray-400"
                }`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderDateStep = () => (
    <View className="flex-1">
      <View className="px-6 mt-4 mb-8">
        <Text className="text-[#FFFFFF] text-[32px] font-medium text-start mb-2">
          {`We'd love to know your \nbirthday — just the date!`}
        </Text>
        <Text className="text-white/70 text-start text-[16px]">
          Fill in your birthday details below
        </Text>
      </View>

      {/* Date Picker */}
      <View className="flex-1 justify-center px-6">
        <View className="bg-white rounded-2xl mx-4 h-48 overflow-hidden">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
            <Text className="text-gray-500 text-sm flex-1 text-center">
              Month
            </Text>
            <Text className="text-gray-500 text-sm flex-1 text-center">
              Day
            </Text>
            <Text className="text-gray-500 text-sm flex-1 text-center">
              Year
            </Text>
          </View>

          <View className="flex-row flex-1">
            <DatePicker
              data={months}
              selectedValue={formData.birthMonth}
              onValueChange={(value) => updateFormData("birthMonth", value)}
            />
            <DatePicker
              data={days}
              selectedValue={formData.birthDay}
              onValueChange={(value) => updateFormData("birthDay", value)}
            />
            <DatePicker
              data={years}
              selectedValue={formData.birthYear}
              onValueChange={(value) => updateFormData("birthYear", value)}
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderAccountTypeStep = () => (
    <View className="flex-1">
      {/* Title Section */}
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
                <User />
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
                <Sparkles />
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
    <View className="flex-1">
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
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
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
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <View className="flex-1">
        <ExpoBlurView intensity={50} tint="dark" className="absolute inset-0" />

        <View className="flex-1 bg-white/60 backdrop-blur-sm">
          {/* Header */}
          <View className="flex-row items-start justify-between px-6 pt-14 pb-2">
            <View className="flex-1 items-start">
              <Image
                source={images.logo}
                className="w-36 h-20"
                resizeMode="contain"
              />
            </View>
          </View>

          {renderCurrentStep()}

          <View className="px-6 pb-8 mb-6">
            <TouchableOpacity
              onPress={handleContinue}
              className="bg-secondary py-4 rounded-full"
            >
              <Text className="text-white text-center font-semibold text-lg">
                {currentStep === 3 ? "Continue" : "Continue"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
