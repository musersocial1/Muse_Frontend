import { Feather } from "@expo/vector-icons";
import { BlurView as ExpoBlurView } from "expo-blur";

import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { useAuthState } from "@/hooks/useAuthState";
import { authAPI } from "@/lib/api/auth";
import { useRouter } from "expo-router";
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

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onClose }) => {
  const router = useRouter();

  // Animation states
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Form states
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));

  // UI states
  const [inputError, setInputError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [canResendCode, setCanResendCode] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const { login, error, clearError, verifyLogin } = useAuthState();

  const otpRefs = useRef<TextInput[]>([]);
  const stepTitles = ["Enter details", "Enter verification code"];

  // Reset all states when modal closes
  const resetStates = () => {
    setCurrentStep(0);
    setEmail("");
    setPassword("");
    setOtpValues(Array(6).fill(""));
    setInputError("");
    setFocusedField(null);
    setShowPassword(false);
    setIsLoading(false);
    setCanResendCode(false);
    setResendTimer(0);
  };

  // Animation effects
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
      resetStates();
    }
  }, [visible]);

  // Auto-focus inputs when step changes
  React.useEffect(() => {
    if (!visible) return;

    if (currentStep === 0) {
      setTimeout(() => {
        // Focus first input in step 0
      }, 200);
    }
    if (currentStep === 1 && otpRefs.current[0]) {
      setTimeout(() => otpRefs.current[0]?.focus(), 200);
    }
  }, [visible, currentStep]);

  // Resend timer effect
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

  // Validation functions
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

  // API functions
  const handleLogin = async (email: string) => {
    try {
      setIsLoading(true);
      setInputError("");

      const response = await login(email, password);

      console.log(response, "login res");

      setCanResendCode(false);
      setResendTimer(60);

      return { success: true, data: response };
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send verification code";
      console.log(error, "the rrrrr");
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
      await authAPI.resendEmailVerificationCode({ email });

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

      const response = await verifyLogin(email, code);

      router.push(RouterConstantUtil.tabs.home as any);
      handleModalClose();
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

  // Handler functions
  const handleOTPChange = (text: string, index: number) => {
    const cleaned = text.replace(/\D/g, "");

    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 6).split("");
      const newOtpValues = Array(6).fill("");
      chars.forEach((char, i) => {
        newOtpValues[i] = char;
      });
      setOtpValues(newOtpValues);

      if (chars.length === 6) {
        setTimeout(() => otpRefs.current[5]?.blur(), 10);
      } else {
        setTimeout(() => otpRefs.current[chars.length]?.focus(), 10);
      }

      if (inputError) setInputError("");
      return;
    }

    const newOtpValues = [...otpValues];
    newOtpValues[index] = cleaned[0] || "";
    setOtpValues(newOtpValues);

    if (cleaned && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    if (index === 5 && cleaned) {
      setTimeout(() => otpRefs.current[5]?.blur(), 10);
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
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        return emailError || passwordError;
      case 1:
        return validateOTP();
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

    if (currentStep === 0) {
      const result = await handleLogin(email);
      if (result.success) {
        setCurrentStep(1);
      }
      return;
    }

    if (currentStep === 1) {
      const otpString = otpValues.join("");
      await verifyCode(otpString);
      return;
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setInputError("");
    }
  };

  const handleInputChange = (value: string, field: string) => {
    switch (field) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
    }

    if (inputError) {
      setInputError("");
    }
  };

  const handleModalClose = () => {
    Keyboard.dismiss();
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
      `rounded-[17px] h-[3.9rem] px-[5%] text-base text-gray-900 border ${
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
          <View className="bg-white rounded-t-3xl py-[8%] shadow-2xl">
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
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    // Focus password field
                  }}
                />

                <View className="relative mt-4">
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
                      !!password.trim()
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

              {inputError ? (
                <Text className="text-red-500 text-sm mt-2 px-2">
                  {inputError}
                </Text>
              ) : null}

              <Text className="text-gray-500 text-md text-center mb-8 leading-5 mt-5">
                Enter your email and password to{"\n"}receive a verification
                code
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
                  <ActivityIndicator size="small" color="white" />
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

      case 1:
        return (
          <View className="bg-white py-[8%] rounded-t-3xl shadow-2xl">
            <View className="px-6">
              <View className="flex-row justify-between items-center mb-6">
                <TouchableOpacity
                  onPress={handleBack}
                  className="p-2 bg-gray-100 rounded-full"
                  disabled={isLoading}
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
                <View className="flex-row justify-center space-x-3 gap-2 mb-4">
                  {otpValues.map((value, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => (otpRefs.current[index] = ref!) as any}
                      value={value}
                      onChangeText={(text) => handleOTPChange(text, index)}
                      onKeyPress={({ nativeEvent }) =>
                        handleOTPKeyPress(nativeEvent.key, index)
                      }
                      className={otpInputStyle(!!inputError, false, !!value)}
                      keyboardType="number-pad"
                      selectTextOnFocus
                      editable={!isLoading}
                      maxLength={1}
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
                Enter the 6-digit code sent to{"\n"}
                {email}
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
                  <ActivityIndicator size="small" color="white" />
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
              <Animated.View
                style={{
                  transform: [{ translateY: slideAnim }],
                  alignSelf: "center",
                }}
                className="w-[90vw] max-w-[400px] bg-white rounded-3xl overflow-hidden mb-[8vw]"
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

export default LoginModal;
