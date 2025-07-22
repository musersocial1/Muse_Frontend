import { authAPI } from "@/lib/api/auth";
import { ValidationItem } from "@/lib/validation/ValidateItem";
import { STEPS, StepType } from "@/utils/constants";
import { Feather } from "@expo/vector-icons";
import React, { useRef, useState } from "react";

import {
  ActivityIndicator,
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
  direction: number; // add this
  onClose: () => void;
  currentStep: string;
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
  direction,
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

  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [canResendCode, setCanResendCode] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  // const [displayedStep, setDisplayedStep] = useState(currentStep);
  // const [direction, setDirection] = useState(1); // 1=forward, -1=back
  const slideX = useRef(new Animated.Value(0)).current;
  const [nextStep, setNextStep] = useState<string | null>(null);

  const [displayedStep, setDisplayedStep] = useState(currentStep);
  const [prevStep, setPrevStep] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pendingStep, setPendingStep] = useState<string | null>(null);
  const [pendingDirection, setPendingDirection] = useState<number>(1);

  const enterAnim = useRef(new Animated.Value(width)).current; // incoming card
  const exitAnim = useRef(new Animated.Value(0)).current; // outgoing card

  React.useEffect(() => {
    if (displayedStep !== currentStep) {
      setPrevStep(displayedStep);
      setNextStep(currentStep); // <-- store next step
      setIsAnimating(true);
      enterAnim.setValue(width * direction);
      exitAnim.setValue(0);

      Animated.parallel([
        Animated.timing(exitAnim, {
          toValue: -width * direction,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(enterAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setDisplayedStep(currentStep);
        setPrevStep(null);
        setNextStep(null); // <-- clear next step after animation
        setIsAnimating(false);
      });
    }
  }, [currentStep]);

  const stepTitles: Record<StepType, string> = {
    [STEPS.PHONE]: "Enter Phone Number",
    [STEPS.VERIFY_OTP]: "Verify Code",
    [STEPS.PASSWORD]: "Create Password",
    [STEPS.PERSONAL_INFO]: "Personal Information",
    [STEPS.USERNAME]: "Choose Username",
  };

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

  React.useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResendCode(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const phoneInputRef = useRef<TextInput>(null);
  React.useEffect(() => {
    if (!visible) return;
    if (currentStep === STEPS.PHONE && phoneInputRef.current) {
      // phoneInputRef.current?.focus();
      // setTimeout(() => phoneInputRef.current?.focus(), 0); // Delay for modal open
    }
    if (currentStep === STEPS.VERIFY_OTP && otpRefs.current[0]) {
      // otpRefs.current[0]?.focus();
      // setTimeout(() => otpRefs.current[0]?.focus(), 0); // Focus first OTP input
    }
  }, [visible, currentStep]);

  const validatePhoneNumber = (phone: string): string => {
    if (!phone || phone.trim().length === 0) {
      return "Phone number is required";
    }

    const formatted = formatPhoneNumber(phone);

    if (!isValidInternationalPhone(formatted)) {
      return "Please enter a valid phone number with country code (e.g., +1234567890)";
    }

    return "";
  };

  const validateOTP = (): string => {
    const otpString = otpValues.join("");
    if (otpString.length !== 6) {
      return "Please enter the complete 5-digit code";
    }
    if (!/^\d{6}$/.test(otpString)) {
      return "Code should contain only numbers";
    }
    return "";
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email";
    return "";
  };

  // const validatePassword = (password: string) => {
  //   if (!password.trim()) return "Password is required";
  //   if (password.length < 8) return "Password must be at least 8 characters";
  //   if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
  //     return "Password must contain uppercase, lowercase, and number";
  //   }
  //   return "";
  // };
  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    // const hasLowercase = /[a-z]/.test(password);
    // const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let error = "";
    if (!password.trim()) {
      error = "Password is required";
    } else if (!hasMinLength) {
      error = "Password must be at least 8 characters";
    } else if (!hasUppercase) {
      error = "Password must contain at least one uppercase letter";
    }
    // else if (!hasLowercase) {
    //   error = "Password must contain at least one lowercase letter";
    // }
    // else if (!hasNumber) {
    //   error = "Password must contain at least one number";
    // }
    else if (!hasSpecialChar) {
      error = "Password must contain at least one special character";
    }

    return {
      hasMinLength,
      hasUppercase,
      // hasLowercase,
      // hasNumber,
      hasSpecialChar,
      error, // empty string if all valid
    };
  };

  const passwordValidation = validatePassword(password);
  const passwordsMatch = !!password && password === confirmPassword;

  const validateName = (name: string) => {
    if (!name.trim()) return "This field is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    return "";
  };

  const formatPhoneNumber = (phone: string) => {
    let cleaned = phone.trim();

    if (cleaned.startsWith("+")) {
      cleaned = "+" + cleaned.slice(1).replace(/\D/g, "");
    } else {
      cleaned = cleaned.replace(/\D/g, "");
      // don't worry validation would catch this
    }
    return cleaned;
  };

  const isValidInternationalPhone = (phone: string): boolean => {
    return /^\+[1-9]\d{9,16}$/.test(phone);
  };

  const sendVerificationCode = async (phone: string) => {
    try {
      setIsLoading(true);
      setInputError("");

      const cleanedPhone = formatPhoneNumber(phone);

      // Validate before sending
      if (!isValidInternationalPhone(cleanedPhone)) {
        setInputError("Please enter a valid phone number with country code ");
        throw new Error(
          "Please enter a valid phone number with country code (e.g., +1234567890)"
        );
      }

      const response = await authAPI.sendPhoneVerificationCode({
        phoneNumber: cleanedPhone,
      });

      // Starting resend timer on here
      setCanResendCode(false);
      setResendTimer(60);

      return { success: true, data: response };
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send verification code";
      setInputError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationCode = async () => {
    if (!canResendCode || isLoading) return;

    try {
      setIsLoading(true);
      setInputError("");

      const cleanedPhone = formatPhoneNumber(phoneNumber);

      if (!isValidInternationalPhone(cleanedPhone)) {
        setInputError("Please enter a valid phone number with country code");
        throw new Error("Please enter a valid phone number with country code");
      }

      await authAPI.resendPhoneVerificationCode({ phoneNumber: cleanedPhone });

      // Resetting the timer on here
      setCanResendCode(false);
      setResendTimer(60);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to resend code";
      setInputError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (code: string) => {
    try {
      setIsLoading(true);
      setInputError("");

      const cleanedPhone = formatPhoneNumber(phoneNumber);

      if (!isValidInternationalPhone(cleanedPhone)) {
        setInputError("Invalid phone number format");
        throw new Error("Invalid phone number format");
      }

      const response = await authAPI.verifyPhoneVerificationCode({
        phoneNumber: cleanedPhone,
        code: code,
      });

      setIsPhoneVerified(true);
      return { success: true, data: response };
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid verification code";
      setInputError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (text: string, index: number) => {
    const cleaned = text.replace(/\D/g, "");

    // Always use the last digit typed, so if user types again in last box, it updates!
    const digit = cleaned.slice(-1) || "";

    // Set the value
    const newOtpValues = [...otpValues];
    newOtpValues[index] = digit;
    setOtpValues(newOtpValues);
    // Focus next if not last input
    if (cleaned && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // If on last input, blur it
    // if (index === 5 && cleaned) {
    //   setTimeout(() => otpRefs.current[5]?.blur(), 10);
    // }

    if (inputError) setInputError("");
  };

  const handleOTPKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const getCurrentValidation = () => {
    switch (currentStep) {
      case STEPS.PHONE:
        return validatePhoneNumber(phoneNumber);
      case STEPS.VERIFY_OTP:
        return validateOTP();
      case STEPS.PASSWORD: {
        const passwordResult = validatePassword(password);
        if (passwordResult.error) return passwordResult.error;
        if (password !== confirmPassword) return "Passwords don't match";
        return "";
      }
      case STEPS.PERSONAL_INFO:
        return (
          validateName(firstName) ||
          validateName(lastName) ||
          validateEmail(email)
        );
      case STEPS.USERNAME:
        return validateName(username);
      default:
        return "";
    }
  };

  const handleContinue = async () => {
    if (isLoading) return;

    const error = getCurrentValidation();
    if (error) {
      setInputError(error);
      return;
    }

    switch (currentStep) {
      case STEPS.PHONE:
        // Send verification code
        const result = await sendVerificationCode(phoneNumber);
        if (result.success) {
          onContinue();
        }
        break;

      case STEPS.VERIFY_OTP:
        // Verify code
        if (!isPhoneVerified) {
          const otpString = otpValues.join("");
          const result = await verifyCode(otpString);
          if (result.success) {
            onContinue();
          }
        } else {
          onContinue();
        }
        break;

      case STEPS.PASSWORD:
        console.log("Password step completed, moving to personal info");
        onContinue();
        break;

      case STEPS.PERSONAL_INFO:
        console.log("Personal info step completed, moving to username");
        onContinue();
        break;

      case STEPS.USERNAME:
        const formData = {
          phoneNumber: formatPhoneNumber(phoneNumber),
          verificationCode: otpValues.join(""),
          firstName,
          lastName,
          email,
          password,
          username,
        };

        console.log("Form submission data:", formData);
        onComplete(formData);
        break;

      default:
        console.warn("Unknown step:", currentStep);
        break;
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
        break;
      case "username":
        setUsername(value);
        break;
    }

    if (inputError) {
      setInputError("");
    }
  };

  const handleModalClose = () => {
    Keyboard.dismiss();
    setInputError("");
    setIsInputFocused(false);
    setIsPhoneVerified(false);
    setCanResendCode(false);
    setResendTimer(0);
    onClose();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const isValidInput = !getCurrentValidation();

  const renderModalContent = (step: string) => {
    const baseInputStyle = (
      hasError: boolean,
      isFocused: boolean,
      isValid: boolean
    ) =>
      `rounded-[17px] h-[4rem] px-[5%] leading-[17px] text-base  text-gray-900 border ${
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

    switch (step) {
      case STEPS.PHONE:
        return (
          <View className="bg-white  rounded-3xl py-[8%] shadow-2xl">
            <View className="px-6">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-semibold text-gray-900">
                  {stepTitles[step]}
                </Text>
                <TouchableOpacity
                  onPress={handleModalClose}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <Feather name="x" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View className="">
                <TextInput
                  value={phoneNumber}
                  ref={phoneInputRef}
                  onChangeText={(text) => handleInputChange(text, "phone")}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder="Enter phone number (+1234567890)"
                  placeholderTextColor="#9CA3AF"
                  className={baseInputStyle(
                    !!inputError,
                    isInputFocused,
                    isValidInput && !isLoading
                  )}
                  keyboardType="phone-pad"
                  returnKeyType="done"
                  onSubmitEditing={handleContinue}
                  maxLength={14}
                  editable={!isLoading}
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
                disabled={!isValidInput || isLoading}
                className={`rounded-full p-4 mb-3 ${
                  isValidInput && !isLoading ? "bg-secondary" : "bg-disabled"
                }`}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="blue" />
                ) : (
                  <Text
                    className={`text-center font-semibold text-base ${
                      isValidInput && !isLoading
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                  >
                    Send Code
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );

      case STEPS.VERIFY_OTP:
        return (
          <View className="bg-white  py-[8%] rounded-3xl shadow-2xl">
            <View className="px-6  ">
              <View className="flex-row justify-between items-center mb-6">
                <TouchableOpacity
                  onPress={onBack}
                  className="p-2 bg-gray-100 rounded-full"
                  disabled={isLoading}
                >
                  <Feather name="arrow-left" size={20} color="#666" />
                </TouchableOpacity>
                <Text className="text-xl font-semibold text-gray-900">
                  {stepTitles[step]}
                </Text>
                <TouchableOpacity
                  onPress={handleModalClose}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <Feather name="x" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View className="mb-4">
                <View className="flex-row  text-sm justify-center space-x-3 gap-2 mb-4">
                  {otpValues.map((value, index) => (
                    <TextInput
                      key={index}
                      ref={(ref: any) => (otpRefs.current[index] = ref)}
                      value={value ? value[0] : ""}
                      onChangeText={(text) => handleOTPChange(text, index)}
                      onKeyPress={({ nativeEvent }) =>
                        handleOTPKeyPress(nativeEvent.key, index)
                      }
                      className={otpInputStyle(!!inputError, false, !!value)}
                      keyboardType="number-pad"
                      style={{
                        width: width / 8,
                        height: width / 8,
                        textAlign: "center",
                        textAlignVertical: "center", // <-- This is the main part for vertical
                        lineHeight: width / 16, // <-- This ensures perfect centering
                        fontSize: 20, // Make the number bold and big, if you want
                      }}
                      selectTextOnFocus
                      editable={!isLoading}
                    />
                  ))}
                </View>
                {inputError ? (
                  <Text className="text-red-500 text-sm text-center px-2">
                    {inputError}
                  </Text>
                ) : null}
              </View>

              <TouchableOpacity
                onPress={resendVerificationCode}
                disabled={!canResendCode || isLoading}
                className="mb-4"
              >
                <Text
                  className={`text-center text-sm ${
                    canResendCode && !isLoading
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                >
                  {resendTimer > 0
                    ? `Resend code in ${resendTimer}s`
                    : "Didn't receive the code? Resend"}
                </Text>
              </TouchableOpacity>
              <Text className="text-gray-500 text-sm text-center mb-4 leading-5">
                Enter the 5-digit code sent to{"\n"}
                {phoneNumber}
              </Text>

              <TouchableOpacity
                onPress={handleContinue}
                disabled={!isValidInput || isLoading}
                className={`rounded-full p-4 mb-3 ${
                  isValidInput && !isLoading ? "bg-secondary" : "bg-disabled"
                }`}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="blue" />
                ) : (
                  <Text
                    className={`text-center font-semibold text-base ${
                      isValidInput && !isLoading
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                  >
                    Verify Code
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );

      case STEPS.PASSWORD:
        return (
          <View className="bg-white rounded-3xl shadow-2xl">
            <View className="px-6 py-8">
              <View className="flex-row justify-between items-center mb-6">
                <TouchableOpacity
                  onPress={onBack}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <Feather name="arrow-left" size={20} color="#666" />
                </TouchableOpacity>
                <Text className="text-xl font-semibold text-gray-900">
                  {stepTitles[step]}
                </Text>
                <TouchableOpacity
                  onPress={handleModalClose}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <Feather name="x" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Add gap-3 here to space out each child */}
              <View className="mb-2 gap-3">
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
                    textAlignVertical="center"
                    style={{ lineHeight: 17 }}
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
              </View>
              <View className=" mb-2  w-full p-2">
                <ValidationItem
                  label="At least 1 uppercase letter"
                  passed={passwordValidation.hasUppercase}
                />
                <ValidationItem
                  label="At least 1 special character"
                  passed={passwordValidation.hasSpecialChar}
                />
                <ValidationItem
                  label="Minimum 8 characters"
                  passed={passwordValidation.hasMinLength}
                />
                <ValidationItem
                  label="Passwords must match"
                  passed={passwordsMatch}
                />
              </View>
              {inputError ? (
                <Text className="text-red-500 text-sm mt-2 px-2">
                  {inputError}
                </Text>
              ) : null}

              {/* <Text className="text-gray-500 text-sm text-center mb-4 leading-5">
                Password must be at least 8 characters with{"\n"}uppercase,
                lowercase, and numbers
              </Text> */}

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

      case STEPS.PERSONAL_INFO:
        return (
          <View
            className="bg-white  rounded-3xl shadow-2xl"
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
                  {stepTitles[step]}
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

      case STEPS.USERNAME:
        return (
          <View
            className="bg-white rounded-3xl shadow-2xl"
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
                  {stepTitles[step]}
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

              <View className="flex-1" />

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
          <View className="flex-1 justify-end">
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
              style={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              {/* ---- Card Animation Area ---- */}
              <View
                style={{
                  position: "relative",
                }}
                className="justify-center w-[90vw]  items-center"
              >
                {/* Outgoing (old) step slides out */}
                {isAnimating && prevStep !== null && (
                  <Animated.View
                    className={
                      " w-full   rounded-[20px] overflow-hidden mb-[10vw]"
                    }
                    style={{
                      position: "absolute",

                      bottom: 0,
                      left: 0,
                      transform: [{ translateX: exitAnim }],
                      zIndex: 1,
                    }}
                  >
                    {renderModalContent(prevStep)}
                  </Animated.View>
                )}
                {/* Incoming (new/current) step slides in */}
                <Animated.View
                  className={
                    " w-full  rounded-[20px] overflow-hidden mb-[10vw]"
                  }
                  style={{
                    transform: [
                      { translateX: isAnimating ? enterAnim : 0 },
                      { translateY: slideAnim },
                    ],
                    position: isAnimating ? "absolute" : "relative",
                    bottom: 0,
                    left: 0,
                    zIndex: 2,
                  }}
                >
                  {renderModalContent(
                    isAnimating && nextStep ? nextStep : displayedStep
                  )}
                </Animated.View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default OnboardingModal;
