import { BlurView as ExpoBlurView } from "expo-blur";
// import { ArrowLeft, Eye, EyeOff, X } from "lucide-react-native";
import { Feather } from "@expo/vector-icons";

import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface OnboardingModalProps {
  visible: boolean;
  onClose: () => void;
  currentStep: number;
  onContinue: () => void;
  onBack: () => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  otpValues: string[];
  setOtpValues: (code: string[]) => void;
  firstName: string;
  setFirstName: (name: string) => void;
  lastName: string;
  setLastName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  username: string;
  setUsername: (username: string) => void;
  onComplete: (formData: any) => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  visible,
  onClose,
  currentStep,
  onContinue,
  onBack,
  phoneNumber,
  setPhoneNumber,
  otpValues,
  setOtpValues,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  username,
  setUsername,
  onComplete,
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [inputError, setInputError] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const otpRefs = useRef<TextInput[]>([]);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [focusedOtpIndex, setFocusedOtpIndex] = useState<number | null>(null);

  const totalSteps = 5;
  const stepTitles = [
    "Create account",
    "Enter verification code",
    "Set password",
    "Enter your details",
    "Enter username",
  ];

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setIsKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const phoneInputRef = useRef<TextInput>(null);
  React.useEffect(() => {
    if (!visible) return;
    // Auto-focus logic based on step
    if (currentStep === 0 && phoneInputRef.current) {
      setTimeout(() => phoneInputRef.current?.focus(), 200); // Delay for modal open
    }
    if (currentStep === 1 && otpRefs.current[0]) {
      setTimeout(() => otpRefs.current[0]?.focus(), 200); // Focus first OTP input
    }
    // Add similar blocks for other steps if needed
  }, [visible, currentStep]);

  const validatePhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 0) return "Phone number is required";
    if (cleaned.length < 10) return "Phone number must be at least 10 digits";
    if (cleaned.length > 15) return "Phone number is too long";
    return "";
  };

  const validateOTP = () => {
    const otpString = otpValues.join("");
    if (otpString.length === 0) return "Verification code is required";
    if (otpString.length !== 5) return "Please enter all 5 digits";
    return "";
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password.trim()) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Password must contain uppercase, lowercase, and number";
    }
    return "";
  };

  const validateName = (name: string) => {
    if (!name.trim()) return "This field is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    return "";
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length >= 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
        6,
        10
      )}`;
    } else if (cleaned.length >= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
        6
      )}`;
    } else if (cleaned.length >= 3) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    }
    return cleaned;
  };

  const handleOTPChange = (text: string, index: number) => {
    text = text.replace(/\D/g, "");

    // PASTE (multi-char, e.g., "12345")
    if (text.length > 1) {
      const chars = text.slice(0, 5).split("");
      setOtpValues(chars.concat(Array(5 - chars.length).fill("")));

      // Blur the last box if all are filled
      if (chars.length >= 5) {
        setTimeout(() => otpRefs.current[4]?.blur(), 10);
      } else {
        setTimeout(() => otpRefs.current[chars.length]?.focus(), 10);
      }
      if (inputError) setInputError("");
      return;
    }

    // SINGLE ENTRY
    const newOtpValues = [...otpValues];
    newOtpValues[index] = text[0] || "";
    setOtpValues(newOtpValues);

    // Move focus to next input only if not last
    if (text && index < 4) {
      otpRefs.current[index + 1]?.focus();
    }
    // If we're on the last box, BLUR (and do NOT focus anything else)
    if (index === 4 && text) {
      setTimeout(() => otpRefs.current[4]?.blur(), 10);
    }
    if (inputError) setInputError("");
  };

  const handleOTPKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const getCurrentValidation = () => {
    switch (currentStep) {
      case 0:
        return validatePhoneNumber(phoneNumber);
      case 1:
        return validateOTP();
      case 2:
        return validatePassword(password);
      case 3:
        return (
          validateName(firstName) ||
          validateName(lastName) ||
          validateEmail(email)
        );
      case 4:
        return validateName(username);
      default:
        return "";
    }
  };

  const handleContinue = () => {
    const error = getCurrentValidation();
    if (error) {
      setInputError(error);
      return;
    }

    if (currentStep === 4) {
      // Final step - submit the form
      const formData = {
        phoneNumber,
        verificationCode: otpValues.join(""),
        firstName,
        lastName,
        email,
        password,
        submittedAt: new Date().toISOString(),
      };

      console.log("Form submission data:", formData);
      onComplete(formData);
    } else {
      onContinue();
    }
  };

  const handleInputChange = (value: string, field: string) => {
    switch (field) {
      case "phone":
        setPhoneNumber(formatPhoneNumber(value));
        break;
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
      case "username":
        setUsername(value);
    }

    if (inputError) {
      setInputError("");
    }
  };

  const handleModalClose = () => {
    Keyboard.dismiss();
    setInputError("");
    setIsInputFocused(false);
    onClose();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const isValidInput = !getCurrentValidation();

  const renderModalContent = () => {
    const baseInputStyle = (
      hasError: boolean,
      isFocused: boolean,
      isValid: boolean
    ) =>
      `rounded-[17px] h-[3.9rem] px-[5%] text-base  text-gray-900 border ${
        hasError
          ? "bg-light-red border-border-red"
          : isFocused
          ? "bg-light-blue border-border-blue"
          : isValid
          ? "bg-light-green border-border-green"
          : "bg-[#F5F5F5] border-[#A3A3A321]"
      }`;

    const otpInputStyle = (
      hasError: boolean,
      isFocused: boolean,
      hasValue: boolean
    ) =>
      `w-14 h-14 rounded-2xl text-center text-xl font-semibold border ${
        hasError
          ? "bg-light-red border-border-red text-red-600"
          : isFocused
          ? "bg-light-blue border-border-blue text-blue-600"
          : hasValue
          ? "bg-light-green border-border-green text-green-600"
          : "bg-[#F5F5F5] border-[#A3A3A321] text-gray-900"
      }`;

    switch (currentStep) {
      case 0:
        return (
          <View
            className="bg-white rounded-t-3xl py-[8%] shadow-2xl"
            // style={{ minHeight: isKeyboardVisible ? "40%" : "40%" }}
          >
            <View className="px-6">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-semibold text-gray-900">
                  {stepTitles[currentStep]}
                </Text>
                <TouchableOpacity
                  onPress={handleModalClose}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <Feather name="x" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View className="mb-4">
                <TextInput
                  value={phoneNumber}
                  ref={phoneInputRef}
                  onChangeText={(text) => handleInputChange(text, "phone")}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder="Enter phone number"
                  placeholderTextColor="#9CA3AF"
                  className={baseInputStyle(
                    !!inputError,
                    isInputFocused,
                    isValidInput
                  )}
                  keyboardType="phone-pad"
                  returnKeyType="done"
                  onSubmitEditing={handleContinue}
                  maxLength={14}
                />
                {inputError ? (
                  <Text className="text-red-500 text-sm mt-2 px-2">
                    {inputError}
                  </Text>
                ) : null}
              </View>

              <Text className="text-gray-500 text-md text-center mb-8 leading-5 mt-5">
                Enter your number so we can send a{"\n"}confirmation code to
                proceed
              </Text>

              <TouchableOpacity
                onPress={handleContinue}
                disabled={!isValidInput}
                className={`rounded-full p-4 mb-3 ${
                  isValidInput ? "bg-secondary" : "bg-disabled"
                }`}
                activeOpacity={0.8}
              >
                <Text
                  className={`text-center font-semibold text-base ${
                    isValidInput ? "text-white" : "text-gray-400"
                  }`}
                >
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 1:
        return (
          <View
            className="bg-white  py-[8%] rounded-t-3xl shadow-2xl"
            // style={{ minHeight: isKeyboardVisible ? 500 : 300 }}
          >
            <View className="px-6  ">
              <View className="flex-row justify-between items-center mb-6">
                <TouchableOpacity
                  onPress={onBack}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <Feather name="arrow-left" size={20} color="#666" />
                </TouchableOpacity>
                <Text className="text-xl font-semibold text-gray-900">
                  {stepTitles[currentStep]}
                </Text>
                <TouchableOpacity
                  onPress={handleModalClose}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <Feather name="x" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View className="mb-4">
                <View className="flex-row justify-center space-x-3 gap-4 mb-4">
                  {otpValues.map((value, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => (otpRefs.current[index] = ref!) as any}
                      value={value ? value[0] : ""}
                      onChangeText={(text) => handleOTPChange(text, index)}
                      onKeyPress={({ nativeEvent }) =>
                        handleOTPKeyPress(nativeEvent.key, index)
                      }
                      className={otpInputStyle(!!inputError, false, !!value)}
                      keyboardType="number-pad"
                      // maxLength={1}
                      selectTextOnFocus
                    />
                  ))}
                </View>
                {inputError ? (
                  <Text className="text-red-500 text-sm text-center px-2">
                    {inputError}
                  </Text>
                ) : null}
              </View>

              <Text className="text-gray-500 text-sm text-center mb-8 leading-5">
                Enter the 5-digit code sent to{"\n"}
                {phoneNumber}
              </Text>

              <TouchableOpacity
                onPress={handleContinue}
                disabled={!isValidInput}
                className={`rounded-full p-4 mb-3 ${
                  isValidInput ? "bg-secondary" : "bg-disabled"
                }`}
                activeOpacity={0.8}
              >
                <Text
                  className={`text-center font-semibold text-base ${
                    isValidInput ? "text-white" : "text-gray-400"
                  }`}
                >
                  Verify code
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 2:
        return (
          <View className="bg-white rounded-t-3xl shadow-2xl">
            <View className="px-6 py-8">
              <View className="flex-row justify-between items-center mb-6">
                <TouchableOpacity
                  onPress={onBack}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <Feather name="arrow-left" size={20} color="#666" />
                </TouchableOpacity>
                <Text className="text-xl font-semibold text-gray-900">
                  {stepTitles[currentStep]}
                </Text>
                <TouchableOpacity
                  onPress={handleModalClose}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <Feather name="x" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Add gap-3 here to space out each child */}
              <View className="mb-4 gap-3">
                <View className="relative">
                  <TextInput
                    value={password}
                    onChangeText={(text) => handleInputChange(text, "password")}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Create password"
                    placeholderTextColor="#9CA3AF"
                    className={baseInputStyle(
                      !!inputError,
                      focusedField === "password",
                      isValidInput
                    )}
                    secureTextEntry={!showPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleContinue}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4"
                  >
                    {showPassword ? (
                      <Feather name="eye-off" size={20} color="#666" />
                    ) : (
                      <Feather name="eye" size={20} color="#666" />
                    )}
                  </TouchableOpacity>
                </View>
                <View className="relative">
                  <TextInput
                    value={confirmPassword}
                    onChangeText={(text) =>
                      handleInputChange(text, "confirmPassword")
                    }
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Confirm password"
                    placeholderTextColor="#9CA3AF"
                    className={baseInputStyle(
                      !!inputError,
                      focusedField === "confirmPassword",
                      isValidInput
                    )}
                    secureTextEntry={!showPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleContinue}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4"
                  >
                    {showPassword ? (
                      <Feather name="eye-off" size={20} color="#666" />
                    ) : (
                      <Feather name="eye" size={20} color="#666" />
                    )}
                  </TouchableOpacity>
                </View>
                {inputError ? (
                  <Text className="text-red-500 text-sm mt-2 px-2">
                    {inputError}
                  </Text>
                ) : null}
              </View>

              <Text className="text-gray-500 text-sm text-center mb-4 leading-5">
                Password must be at least 8 characters with{"\n"}uppercase,
                lowercase, and numbers
              </Text>

              <TouchableOpacity
                onPress={handleContinue}
                disabled={!isValidInput}
                className={`rounded-full p-4 ${
                  isValidInput ? "bg-secondary" : "bg-disabled"
                }`}
                activeOpacity={0.8}
              >
                <Text
                  className={`text-center font-semibold text-base ${
                    isValidInput ? "text-white" : "text-gray-400"
                  }`}
                >
                  Complete Setup
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 3:
        return (
          <View
            className="bg-white  rounded-t-3xl shadow-2xl"
            // style={{ minHeight: isKeyboardVisible ? 550 : 400 }}
          >
            <View className="px-6 pt-6 pb-6">
              <View className="flex-row justify-between items-center mb-6">
                <TouchableOpacity
                  onPress={onBack}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <Feather name="arrow-left" size={20} color="#666" />
                </TouchableOpacity>
                <Text className="text-xl font-semibold text-gray-900">
                  {stepTitles[currentStep]}
                </Text>
                <TouchableOpacity
                  onPress={handleModalClose}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <Feather name="x" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View className="space-y-4 gap-3 mb-6">
                <View>
                  <TextInput
                    value={firstName}
                    onChangeText={(text) =>
                      handleInputChange(text, "firstName")
                    }
                    onFocus={() => setFocusedField("firstName")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="First name"
                    placeholderTextColor="#9CA3AF"
                    className={baseInputStyle(
                      !!inputError && !firstName.trim(),
                      focusedField === "firstName",
                      !!firstName.trim()
                    )}
                    returnKeyType="next"
                  />
                </View>

                <View>
                  <TextInput
                    value={lastName}
                    onChangeText={(text) => handleInputChange(text, "lastName")}
                    onFocus={() => setFocusedField("lastName")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Last name"
                    placeholderTextColor="#9CA3AF"
                    className={baseInputStyle(
                      !!inputError && !lastName.trim(),
                      focusedField === "lastName",
                      !!lastName.trim()
                    )}
                    returnKeyType="next"
                  />
                </View>

                <View>
                  <TextInput
                    value={email}
                    onChangeText={(text) => handleInputChange(text, "email")}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Email address"
                    placeholderTextColor="#9CA3AF"
                    className={baseInputStyle(
                      !!inputError && !email.trim(),
                      focusedField === "email",
                      !!email.trim()
                    )}
                    keyboardType="email-address"
                    returnKeyType="done"
                    onSubmitEditing={handleContinue}
                  />
                </View>

                {inputError ? (
                  <Text className="text-red-500 text-sm px-2">
                    {inputError}
                  </Text>
                ) : null}
              </View>

              <Text className="text-gray-500 text-sm text-center mb-4 leading-5">
                This information will be used to{"\n"}personalize your
                experience
              </Text>

              <TouchableOpacity
                onPress={handleContinue}
                disabled={!isValidInput}
                className={`rounded-full p-4 ${
                  isValidInput ? "bg-secondary" : "bg-disabled"
                }`}
                activeOpacity={0.8}
              >
                <Text
                  className={`text-center font-semibold text-base ${
                    isValidInput ? "text-white" : "text-gray-400"
                  }`}
                >
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      // case 3:
      //   return (
      //     <View
      //       className="bg-white rounded-t-3xl shadow-2xl"
      //       style={{ minHeight: isKeyboardVisible ? 500 : 380 }}
      //     >
      //       <View className="px-6 pt-6  pb-6">
      //         <View className="flex-row justify-between items-center mb-6">
      //           <TouchableOpacity
      //             onPress={onBack}
      //             className="p-2 bg-gray-100 rounded-full"
      //           >
      //             <Feather name="arrow-left" size={20} color="#666" />
      //           </TouchableOpacity>
      //           <Text className="text-xl font-semibold text-gray-900">
      //             {stepTitles[currentStep]}
      //           </Text>
      //           <TouchableOpacity
      //             onPress={handleModalClose}
      //             className="p-2 bg-gray-100 rounded-full"
      //           >
      //             <Feather name="x" size={20} color="#666" />
      //           </TouchableOpacity>
      //         </View>

      //         <View className="mb-4 gap-3">
      //           <View className="relative">
      //             <TextInput
      //               value={password}
      //               onChangeText={(text) => handleInputChange(text, "password")}
      //               onFocus={() => setIsInputFocused(true)}
      //               onBlur={() => setIsInputFocused(false)}
      //               placeholder="Create password"
      //               placeholderTextColor="#9CA3AF"
      //               className={baseInputStyle(
      //                 !!inputError,
      //                 isInputFocused,
      //                 isValidInput
      //               )}
      //               secureTextEntry={!showPassword}
      //               returnKeyType="done"
      //               onSubmitEditing={handleContinue}
      //             />
      //             <TouchableOpacity
      //               onPress={() => setShowPassword(!showPassword)}
      //               className="absolute right-4 top-4"
      //             >
      //               {showPassword ? (
      //                 <Feather name="eye-off" size={20} color="#666" />
      //               ) : (
      //                 <Feather name="eye" size={20} color="#666" />
      //               )}
      //             </TouchableOpacity>
      //           </View>
      //           <View className="relative">
      //             <TextInput
      //               value={confirmPassword}
      //               onChangeText={(text) =>
      //                 handleInputChange(text, "confirmPassword")
      //               }
      //               onFocus={() => setIsInputFocused(true)}
      //               onBlur={() => setIsInputFocused(false)}
      //               placeholder="Confirm password"
      //               placeholderTextColor="#9CA3AF"
      //               className={baseInputStyle(
      //                 !!inputError,
      //                 isInputFocused,
      //                 isValidInput
      //               )}
      //               secureTextEntry={!showPassword}
      //               returnKeyType="done"
      //               onSubmitEditing={handleContinue}
      //             />
      //             <TouchableOpacity
      //               onPress={() => setShowPassword(!showPassword)}
      //               className="absolute right-4 top-4"
      //             >
      //               {showPassword ? (
      //                 <Feather name="eye-off" size={20} color="#666" />
      //               ) : (
      //                 <Feather name="eye" size={20} color="#666" />
      //               )}
      //             </TouchableOpacity>
      //           </View>
      //           {inputError ? (
      //             <Text className="text-red-500 text-sm mt-2 px-2">
      //               {inputError}
      //             </Text>
      //           ) : null}
      //         </View>

      //         <Text className="text-gray-500 text-sm text-center mb-8 leading-5">
      //           Password must be at least 8 characters with{"\n"}uppercase,
      //           lowercase, and numbersddjd
      //         </Text>

      //         <TouchableOpacity
      //           onPress={handleContinue}
      //           disabled={!isValidInput}
      //           className={`rounded-full p-4 ${
      //             isValidInput ? "bg-secondary" : "bg-disabled"
      //           }`}
      //           activeOpacity={0.8}
      //         >
      //           <Text
      //             className={`text-center font-semibold text-base ${
      //               isValidInput ? "text-white" : "text-gray-400"
      //             }`}
      //           >
      //             Complete Setup
      //           </Text>
      //         </TouchableOpacity>
      //       </View>
      //     </View>
      //   );

      case 4:
        return (
          <View
            className="bg-white rounded-t-3xl shadow-2xl"
            // style={{ minHeight: isKeyboardVisible ? 550 : 260 }}
          >
            <View className="px-6 pt-6 pb-8">
              <View className="flex-row justify-between items-center mb-6">
                <TouchableOpacity
                  onPress={onBack}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <Feather name="arrow-left" size={20} color="#666" />
                </TouchableOpacity>
                <Text className="text-xl font-semibold text-gray-900">
                  {stepTitles[currentStep]}
                </Text>
                <TouchableOpacity
                  onPress={handleModalClose}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <Feather name="x" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View className="space-y-4 gap-3 mb-6">
                <View>
                  <TextInput
                    value={username}
                    onChangeText={(text) => handleInputChange(text, "username")}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    placeholder="Enter username"
                    placeholderTextColor="#9CA3AF"
                    className={baseInputStyle(
                      !!inputError && !username.trim(),
                      isInputFocused,
                      !!username.trim()
                    )}
                    returnKeyType="next"
                  />
                </View>

                {inputError ? (
                  <Text className="text-red-500 text-sm px-2">
                    {inputError}
                  </Text>
                ) : null}
              </View>

              <TouchableOpacity
                onPress={handleContinue}
                disabled={!isValidInput}
                className={`rounded-full p-4 ${
                  isValidInput ? "bg-secondary" : "bg-disabled"
                }`}
                activeOpacity={0.8}
              >
                <Text
                  className={`text-center font-semibold text-base ${
                    isValidInput ? "text-white" : "text-gray-400"
                  }`}
                >
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleModalClose}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <Animated.View style={{ opacity: fadeAnim }} className="flex-1">
          <ExpoBlurView
            intensity={50}
            tint="dark"
            className="absolute inset-0"
          />

          <View className="flex-1 justify-end">
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
              style={{ flex: 1, justifyContent: "flex-end" }}
            >
              {/* Animated Card */}
              <Animated.View
                style={{
                  transform: [{ translateY: slideAnim }],
                  alignSelf: "center", // centers the card horizontally
                  // marginBottom: !isKeyboardVisible ? width * 0.1 : width * 0.06, // 10vw or 6vw
                }}
                className="w-[90vw] max-w-[400px] bg-white rounded-3xl overflow-hidden  mb-[8vw] "
              >
                {renderModalContent()}
              </Animated.View>
            </KeyboardAvoidingView>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default OnboardingModal;
