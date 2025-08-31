import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { authAPI } from "@/lib/api/auth";
import { ValidationItem } from "@/lib/validation/ValidateItem";
import { STEPS, StepType } from "@/utils/constants";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
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
import CountryPicker from "react-native-country-picker-modal";
const { width, height } = Dimensions.get("window");

interface OnboardingModalProps {
  visible: boolean;
  direction: number; // add this
  onClose: () => void;
  currentStep: string;
  setCurrentStep: (val: StepType) => void;
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
  detectedCountryCode: string;
  detectedCallingCode: string;
  fullName: any;
  setFullName: any;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  visible,
  direction,
  onClose,
  currentStep,
  setCurrentStep,
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
  fullName,
  setFullName,
  detectedCallingCode,
  detectedCountryCode,
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

  const [usernameAvailable, setUsernameAvailable] = useState(false);

  const [isUsernameChecking, setIsUsernameChecking] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [canResendCode, setCanResendCode] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const slideX = useRef(new Animated.Value(0)).current;
  const [nextStep, setNextStep] = useState<string | null>(null);

  const [displayedStep, setDisplayedStep] = useState(currentStep);
  const [prevStep, setPrevStep] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const enterAnim = useRef(new Animated.Value(width)).current; // incoming card
  const exitAnim = useRef(new Animated.Value(0)).current; // outgoing card
  const [countryCode, setCountryCode] = useState<any>(detectedCountryCode);
  const [callingCode, setCallingCode] = useState(detectedCallingCode);

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);

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
        setNextStep(null);
        setIsAnimating(false);
      });
    }
  }, [currentStep]);
  useEffect(() => {
    setCountryCode(detectedCountryCode);
  }, [detectedCountryCode]);

  useEffect(() => {
    setCallingCode(detectedCallingCode);
  }, [detectedCallingCode]);
  const usernameCheckTimeout = useRef<any>(null);

  const checkUsernameAvailability = (username: string) => {
    const uname = username.toLowerCase().replace(/\s/g, "");

    // Reset on empty or < 3 chars
    if (!uname) {
      setUsernameError("");
      setUsernameAvailable(false);
      setIsUsernameChecking(false);
      return;
    }

    if (uname.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      setUsernameAvailable(false);
      setIsUsernameChecking(false);
      return;
    }

    if (usernameCheckTimeout.current) {
      clearTimeout(usernameCheckTimeout.current);
    }
    setIsUsernameChecking(true);

    usernameCheckTimeout.current = setTimeout(async () => {
      try {
        const { exists } = await authAPI.checkUsernameExists(uname);
        if (exists) {
          setUsernameError("Username is already taken");
          setUsernameAvailable(false);
        } else {
          setUsernameError(""); // no error
          setUsernameAvailable(true);
        }
      } catch (e) {
        setUsernameError("Error checking username");
        setUsernameAvailable(false);
      } finally {
        setIsUsernameChecking(false);
      }
    }, 500);
  };

  const stepTitles: Record<StepType, string> = {
    [STEPS.AUTH_METHOD]: "Get started",
    [STEPS.PHONE]: "Enter Phone Number",
    [STEPS.VERIFY_OTP]: "Verify Code",
    [STEPS.PASSWORD]: "Create Password",
    [STEPS.PERSONAL_INFO]: "Personal Information",
    [STEPS.USERNAME]: "Enter Unique Username",
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

    // Wait a tick for modal animation to finish
    setTimeout(() => {
      switch (currentStep) {
        case STEPS.PHONE:
          phoneInputRef.current?.focus();
          break;
        case STEPS.VERIFY_OTP:
          otpRefs.current[0]?.focus();
          break;
        case STEPS.PERSONAL_INFO:
          firstNameRef.current?.focus();
          break;
        case STEPS.PASSWORD:
          passwordRef.current?.focus();
          break;
        case STEPS.USERNAME:
          usernameRef.current?.focus();
          break;

        default:
          break;
      }
    }, 600);
  }, [currentStep, visible]);

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
      return "Please enter the complete 6-digit code";
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

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);

    let error = "";
    if (!password.trim()) {
      error = "Password is required";
    } else if (!hasNumber) {
      error = "Password must have atleast one digit";
    } else if (!hasMinLength) {
      error = "Password must be at least 8 characters";
    } else if (!hasUppercase) {
      error = "Password must contain at least one uppercase letter";
    } else if (!hasSpecialChar) {
      error = "Password must contain at least one special character";
    }

    return {
      hasMinLength,
      hasUppercase,
      // hasLowercase,
      hasNumber,
      hasSpecialChar,
      error, // empty string if all valid
    };
  };

  const passwordValidation = validatePassword(password);
  const isPasswordValid =
    passwordValidation.hasMinLength &&
    passwordValidation.hasUppercase &&
    passwordValidation.hasNumber &&
    passwordValidation.hasSpecialChar;

  const isUsernameValid =
    !!username && username.length >= 3 && usernameAvailable && !usernameError;

  const canContinue = isPasswordValid && !isLoading;

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

    const digit = cleaned.slice(-1) || "";

    // Set the value
    const newOtpValues = [...otpValues];
    newOtpValues[index] = digit;
    setOtpValues(newOtpValues);
    // Focus next if not last input
    if (cleaned && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    if (inputError) setInputError("");
  };

  const handleOTPKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  React.useEffect(() => {
    setInputError("");
  }, [currentStep]);

  const getCurrentValidation = () => {
    switch (currentStep) {
      case STEPS.PHONE:
        return validatePhoneNumber(phoneNumber);

      case STEPS.VERIFY_OTP:
        return validateOTP();

      case STEPS.PASSWORD: {
        const passwordResult = validatePassword(password);
        if (passwordResult.error) return passwordResult.error;

        return ""; // All good!
      }

      case STEPS.PERSONAL_INFO:
        return validateName(fullName) || validateEmail(email);

      case STEPS.USERNAME:
        if (!username.trim()) return "Username is required";
        if (username.length < 3)
          return "Username must be at least 3 characters";
        if (usernameError) return usernameError;
        if (!usernameAvailable) return "Username is not available";
        return "";

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

    try {
      switch (currentStep) {
        case STEPS.AUTH_METHOD: {
          if (isGoogleAuth) {
            setCurrentStep(STEPS.USERNAME);
          } else {
            onContinue();
          }
          break;
        }

        case STEPS.PHONE: {
          setIsLoading(true);
          setInputError("");
          const { exists, message } = await authAPI.checkPhoneNumberExists(
            phoneNumber
          );
          if (exists) {
            setInputError(message || "Phone number already exists.");
            return;
          }
          const result = await sendVerificationCode(phoneNumber);
          if (result.success) onContinue();
          break;
        }

        case STEPS.VERIFY_OTP: {
          if (!isPhoneVerified) {
            const otpString = otpValues.join("");
            const result = await verifyCode(otpString);
            if (result.success) onContinue();
          } else {
            onContinue();
          }
          break;
        }

        case STEPS.PASSWORD: {
          setIsLoading(true);
          setInputError("");
          if (password !== confirmPassword) {
            setInputError("Passwords don't match");
            return; // Add return here to prevent continuing
          }
          onContinue();
          break;
        }

        case STEPS.PERSONAL_INFO: {
          setIsLoading(true);
          setInputError("");
          const { exists, message } = await authAPI.checkEmailExists(email);
          if (exists) {
            setInputError(message || "Email already exists.");
            setFocusedField("email");
            setTimeout(() => emailRef.current?.focus(), 100);
            return;
          }
          onContinue();
          break;
        }

        case STEPS.USERNAME: {
          setIsLoading(true);
          setInputError("");
          if (!usernameAvailable) {
            setInputError("Username is not available.");
            return;
          }
          const { exists, message } = await authAPI.checkUsernameExists(
            username
          );
          if (exists) {
            setInputError(message || "Username is already taken.");
            return;
          }

          // Different form data based on auth method
          const formData = isGoogleAuth
            ? {
                // Google auth - minimal data needed
                fullName,
                username: username.toLowerCase().replace(/\s/g, ""),
                authMethod: "google",
              }
            : {
                // Email auth - full registration data
                phoneNumber: formatPhoneNumber(phoneNumber),
                verificationCode: otpValues.join(""),
                fullName,
                email,
                password,
                username: username.toLowerCase().replace(/\s/g, ""),
                authMethod: "email",
              };

          console.log("Form submission data:", formData);
          onComplete(formData);
          break;
        }

        default:
          console.warn("Unknown step:", currentStep);
          setCurrentStep(STEPS.PHONE);
      }
    } catch (err: any) {
      setInputError(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string, field: string) => {
    switch (field) {
      case "phone":
        setPhoneNumber(formatPhoneNumber(value));
        break;
      case "fullName":
        setFullName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "username":
        const usernameValue = value.toLowerCase().replace(/\s/g, "");
        setUsername(usernameValue);
        setUsernameError("");
        checkUsernameAvailability(usernameValue);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
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

  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const usernameRef = useRef<TextInput>(null);

  const formatPhoneForDisplay = (phone: any) => {
    const cleaned = phone.replace(/[^\d]/g, "");

    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    } else if (cleaned.length <= 10) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(
        6
      )}`;
    } else {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(
        6,
        10
      )} ${cleaned.slice(10)}`;
    }
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

              <View
                className={`${baseInputStyle(
                  !!inputError,
                  isInputFocused,
                  isValidInput && !isLoading
                )} flex flex-row pl-3 items-center`}
              >
                {/* Country Picker Button */}
                <TouchableOpacity
                  className="flex-row   z-[100] items-center h-full pr-2  rounded-[8px] "
                  onPress={() => setShowCountryPicker(true)}
                  activeOpacity={0.9}
                >
                  <CountryPicker
                    countryCode={countryCode}
                    withFlag
                    withCallingCode
                    withFilter
                    withEmoji
                    visible={showCountryPicker}
                    onClose={() => setShowCountryPicker(false)}
                    onSelect={(country) => {
                      setCountryCode(country.cca2);
                      setCallingCode(country.callingCode[0]);
                    }}
                    containerButtonStyle={{
                      padding: 0,
                      margin: 0,
                      minHeight: 0,
                      minWidth: 0,
                    }}
                    modalProps={{
                      animationType: "slide",
                      presentationStyle: "overFullScreen", // iOS
                      transparent: true,
                    }}
                    theme={{
                      fontFamily: "System",
                      backgroundColor: "#ffffff",
                      onBackgroundTextColor: "#333333",
                      filterPlaceholderTextColor: "#aaa",
                      activeOpacity: 0.7,
                    }}
                  />
                  <Text className=" text-base text-black">+{callingCode}</Text>
                </TouchableOpacity>

                <TextInput
                  value={formatPhoneForDisplay(
                    phoneNumber.replace(`+${callingCode}`, "")
                  )}
                  ref={phoneInputRef}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/\D/g, "");
                    const fullNumber = `+${callingCode}${cleaned}`;
                    setPhoneNumber(fullNumber);
                  }}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder="Enter Phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  returnKeyType="done"
                  style={{ flex: 1, height: 64 }}
                  maxLength={15}
                  editable={!isLoading}
                />
              </View>
              {inputError ? (
                <Text className="text-red-500 text-sm mt-2 px-2">
                  {inputError}
                </Text>
              ) : null}

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

      case STEPS.AUTH_METHOD:
        return (
          <View className="bg-white rounded-3xl py-[8%] shadow-2xl">
            <View className="px-6">
              <View className="flex-row justify-between items-center mb-6">
                <TouchableOpacity
                  onPress={onBack}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <Feather name="arrow-left" size={20} color="#666" />
                </TouchableOpacity>
                <View className="absolute left-0 right-0 items-center mt-5">
                  <Image
                    source={images.logo}
                    className="w-36 h-20"
                    resizeMode="contain"
                  />
                </View>
                <TouchableOpacity
                  onPress={handleModalClose}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <Feather name="x" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View className="items-center mb-8 mt-4">
                <Text className="text-[24px] font-neutral-bold  text-[#000000] mb-3">
                  Lets get started
                </Text>
              </View>
              <View className="items-center mb-3">
                <TouchableOpacity
                  className="bg-[#F3F3F3]/[10%] w-full items-center rounded-full py-3 px-6 border border-[#0000000F]/[5%]"
                  activeOpacity={0.8}
                  onPress={() => {
                    setIsGoogleAuth(true);
                    setCurrentStep(STEPS.USERNAME);
                  }}
                >
                  <Image
                    source={icons.google}
                    className="w-10 h-10"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <View className="mb-[30%]">
                <TouchableOpacity
                  onPress={() => {
                    setIsGoogleAuth(false);
                    onContinue();
                  }}
                  className="bg-[#0368FF] rounded-full py-6 px-6"
                  activeOpacity={0.8}
                >
                  <Text className="text-[#FFFFFF] text-center font-semibold text-[16px]">
                    Continue with email
                  </Text>
                </TouchableOpacity>
              </View>
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

              <View className="mb-2 gap-3">
                {/* Password */}
                <View className="relative">
                  <TextInput
                    value={password}
                    ref={passwordRef}
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
                    ref={confirmPasswordRef}
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
              </View>

              {/* Password validation items */}
              <View className=" w-full p-2">
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
                  label="At least 1 numeric character"
                  passed={passwordValidation.hasNumber}
                />
              </View>

              {inputError ? (
                <Text className="text-red-500 text-sm px-2 mt-2">
                  {inputError}
                </Text>
              ) : null}

              <TouchableOpacity
                onPress={handleContinue}
                disabled={!canContinue || isLoading}
                className={`rounded-full mt-4 p-4 ${
                  canContinue ? "bg-secondary" : "bg-disabled"
                }`}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#0368FF" />
                ) : (
                  <Text
                    className={`text-center font-semibold text-base ${
                      canContinue ? "text-white" : "text-gray-400"
                    }`}
                  >
                    Continue
                  </Text>
                )}
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
                    value={fullName}
                    ref={firstNameRef} // Or rename to fullNameRef for clarity
                    onChangeText={(text) => handleInputChange(text, "fullName")}
                    onFocus={() => setFocusedField("fullName")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Full name"
                    placeholderTextColor="#9CA3AF"
                    className={baseInputStyle(
                      !!inputError && !fullName.trim(),
                      focusedField === "fullName",
                      !!fullName.trim()
                    )}
                    returnKeyType="next"
                  />
                </View>

                <View>
                  <TextInput
                    value={email}
                    ref={emailRef}
                    onChangeText={(text) => handleInputChange(text, "email")}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Email address"
                    placeholderTextColor="#9CA3AF"
                    className={baseInputStyle(
                      (!!inputError && focusedField === "email") ||
                        (!!inputError &&
                          inputError.toLowerCase().includes("email")),
                      focusedField === "email",
                      !!email.trim()
                    )}
                    autoCapitalize="none"
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
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text
                    className={`text-center font-semibold text-base ${
                      isValidInput ? "text-white" : "text-gray-400"
                    }`}
                  >
                    Continue
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );
      case STEPS.USERNAME:
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
                <View className="relative">
                  <TextInput
                    value={username}
                    onChangeText={(text) => handleInputChange(text, "username")}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                    ref={usernameRef}
                    placeholder="Choose a username"
                    placeholderTextColor="#9CA3AF"
                    className={baseInputStyle(
                      !!usernameError || !!inputError,
                      isInputFocused,
                      !!username.trim() && usernameAvailable && !usernameError
                    )}
                    returnKeyType="next"
                    autoCapitalize="none"
                  />
                  {isUsernameChecking && (
                    <View style={{ position: "absolute", right: 16, top: 18 }}>
                      <ActivityIndicator size="small" color="blue" />
                    </View>
                  )}
                </View>

                {usernameError || inputError ? (
                  <Text className="text-red-500 text-sm px-2 mt-2">
                    {usernameError || inputError}
                  </Text>
                ) : usernameAvailable && username.length >= 3 ? (
                  <Text className="text-green-600 text-sm px-2 mt-2">
                    Username is available
                  </Text>
                ) : null}
              </View>

              <TouchableOpacity
                onPress={handleContinue}
                disabled={!isUsernameValid || isLoading}
                className={`rounded-full mt-4 p-4 ${
                  isUsernameValid ? "bg-secondary" : "bg-disabled"
                }`}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#0368FF" />
                ) : (
                  <Text
                    className={`text-center font-semibold text-base ${
                      isUsernameValid ? "text-white" : "text-gray-400"
                    }`}
                  >
                    Continue
                  </Text>
                )}
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
