import { Feather } from "@expo/vector-icons";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { useAuthState } from "@/hooks/useAuthState";
import { authAPI } from "@/lib/api/auth";
import { ValidationItem } from "@/lib/validation/ValidateItem";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
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

const { width, height } = Dimensions.get("window");

const STEPS = {
  AUTH_METHOD: "AUTH_METHOD",
  LOGIN: "LOGIN",
  VERIFY_OTP: "VERIFY_OTP",
  FORGOT_PASSWORD: "FORGOT_PASSWORD",
  RESET_OTP: "RESET_OTP",
  RESET_PASSWORD: "RESET_PASSWORD",
} as const;

type StepType = (typeof STEPS)[keyof typeof STEPS];

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
  const [currentStep, setCurrentStep] = useState<StepType>(STEPS.AUTH_METHOD);
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
  const [displayedStep, setDisplayedStep] = useState<StepType>(
    STEPS.AUTH_METHOD
  );
  const [prevStep, setPrevStep] = useState<StepType | null>(null);
  const [nextStep, setNextStep] = useState<StepType | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(1); // 1: right, -1: left
  const [resetResendTimer, setResetResendTimer] = useState(60);
  const [canResendResetCode, setCanResendResetCode] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] =
    useState(false);

  const enterAnim = useRef(new Animated.Value(width)).current;
  const exitAnim = useRef(new Animated.Value(0)).current;

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const forgotEmailRef = useRef<TextInput>(null);
  const resetPasswordRef = useRef<TextInput>(null); // Only if you want for step 4

  const otpRefs = useRef<TextInput[]>([]);
  const stepTitles = {
    [STEPS.LOGIN]: "Enter details",
    [STEPS.VERIFY_OTP]: "Enter verification code",
    [STEPS.FORGOT_PASSWORD]: "Forgot password",
    [STEPS.RESET_OTP]: "Reset password",
    [STEPS.RESET_PASSWORD]: "Reset password",
  };

  const [resetOtpValues, setResetOtpValues] = useState(Array(6).fill(""));
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const resetOtpRefs = useRef<TextInput[]>([]);

  // When you setCurrentStep(nextStep), run this:
  React.useEffect(() => {
    if (displayedStep !== currentStep) {
      setPrevStep(displayedStep);
      setNextStep(currentStep);
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
  React.useEffect(() => {
    let interval: any;
    if (resetResendTimer > 0) {
      setCanResendResetCode(false);
      interval = setInterval(() => {
        setResetResendTimer((prev) => {
          if (prev <= 1) {
            setCanResendResetCode(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resetResendTimer]);

  const handleResendResetCode = async () => {
    if (!canResendResetCode || isLoading) return;
    setIsLoading(true);
    setInputError("");
    try {
      await authAPI.forgotPassword(forgotPasswordEmail); // Call API to resend
      setResetResendTimer(60); // Reset timer
      setCanResendResetCode(false);
      // Optionally show toast: showSuccess("Code resent!");
    } catch (err: any) {
      setInputError(err?.toString() || "Failed to resend code.");
    }
    setIsLoading(false);
  };

  // Reset all states when modal closes
  const resetStates = () => {
    setCurrentStep(STEPS.AUTH_METHOD);
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

  // Step 2: Request OTP for forgot password
  const handleForgotPassword = async () => {
    setIsLoading(true);
    setInputError("");
    console.log("working");
    try {
      await authAPI.forgotPassword(forgotPasswordEmail);
      // If success, move to next step, show toast, etc.
      setDirection(1);
      setCurrentStep(STEPS.VERIFY_OTP);
      setEmail(forgotPasswordEmail);
    } catch (err: any) {
      // Here you can set your error state!
      setInputError(err?.toString() || "Couldn't send reset email.");
    }
    setIsLoading(false);
  };

  // Step 3: Reset password with OTP + new passwords
  const handleResetPassword = async () => {
    setIsLoading(true);
    setInputError("");
    if (resetPassword !== resetConfirmPassword) {
      setInputError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    try {
      const otpString = resetOtpValues.join("");
      await authAPI.resetPassword(
        otpString,
        resetPassword,
        resetConfirmPassword
      );

      // If successful:
      setInputError("");
      setDirection(1);
      setCurrentStep(STEPS.AUTH_METHOD); // Go to login
      setPassword("");
      setResetPassword("");
      setEmail("");
      setForgotPasswordEmail("");

      setResetConfirmPassword("");
      setResetOtpValues(Array(6).fill(""));
    } catch (e: any) {
      const errMsg = e?.toString() || "Couldn't reset password.";

      if (
        errMsg.includes("Invalid or expired reset token") ||
        errMsg.includes("Invalid or expired code") // in case your backend changes msg slightly
      ) {
        // Go back to OTP step
        setDirection(1);
        setCurrentStep(STEPS.VERIFY_OTP);
        setInputError("Invalid or expired reset code. Please try again.");
        setResetOtpValues(Array(6).fill(""));
      } else {
        setInputError(errMsg);
      }
    }
    setIsLoading(false);
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
    const timer = setTimeout(() => {
      if (currentStep === STEPS.LOGIN) {
        emailRef.current?.focus();
      } else if (currentStep === STEPS.VERIFY_OTP) {
        otpRefs.current[0]?.focus();
      } else if (currentStep === STEPS.FORGOT_PASSWORD) {
        forgotEmailRef.current?.focus();
      } else if (currentStep === STEPS.RESET_OTP) {
        resetOtpRefs.current[0]?.focus();
      } else if (currentStep === STEPS.RESET_PASSWORD) {
        resetPasswordRef.current?.focus();
      }
    }, 700);
    return () => clearTimeout(timer);
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
  const forgotEmailValidation = validateEmail(forgotPasswordEmail);
  const canSendReset =
    !!forgotPasswordEmail && forgotEmailValidation === "" && !isLoading;

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    // const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
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
    else if (!hasNumber) {
      error = "Password must contain at least one number";
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

  const resetPasswordValidation = validatePassword(resetPassword);
  const passwordsMatch =
    !!resetPassword &&
    !!resetConfirmPassword &&
    resetPassword === resetConfirmPassword;

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

  const passwordValidation = validatePassword(password);

  // API functions
  const handleLogin = async (email: string) => {
    try {
      setIsLoading(true);
      setInputError("");

      const response = await login(email, password);

      // console.log(response.code, "login res");

      setCanResendCode(false);
      setResendTimer(60);

      return { success: true, data: response };
    } catch (error: any) {
      console.log(error, "this is davis here");
      // const errorMessage =
      //   error?.response?.data?.message ||
      //   error?.message ||
      //   "Failed to send verification code";
      const errorMessage =
        error?.response?.data?.error || // <-- add this line
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send verification code";

      console.log(errorMessage, "the rrrrr");
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

      router.replace(RouterConstantUtil.tabs.home as any);
      // handleModalClose();
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
  // For login/verify OTP
  const handleOTPChange = (text: string, index: number) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 1) {
      // User pasted all digits at once!
      const chars = cleaned.slice(0, 6).split("");
      setOtpValues(chars);
      setTimeout(() => {
        if (chars.length < 6) {
          otpRefs.current[chars.length]?.focus();
        } else {
          otpRefs.current[5]?.blur();
        }
      }, 10);
      if (inputError) setInputError("");
      return;
    }
    // Normal flow...
    const newOtpValues = [...otpValues];
    newOtpValues[index] = cleaned[0] || "";
    setOtpValues(newOtpValues);
    if (cleaned && index < 5) otpRefs.current[index + 1]?.focus();
    if (index === 5 && cleaned)
      setTimeout(() => otpRefs.current[5]?.blur(), 10);
    if (inputError) setInputError("");
  };

  const handleOTPKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const getCurrentValidation = () => {
    switch (currentStep) {
      case STEPS.LOGIN:
        const passwordResult = validatePassword(password);
        if (passwordResult.error) return passwordResult.error;
        return "";
      case STEPS.VERIFY_OTP:
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

    switch (currentStep) {
      case STEPS.LOGIN:
        setDirection(2);
        setCurrentStep(STEPS.VERIFY_OTP);
        return;

      case STEPS.VERIFY_OTP:
        const otpString = otpValues.join("");
        await verifyCode(otpString);
        return;

      case STEPS.FORGOT_PASSWORD:
        setDirection(1);
        await handleForgotPassword();
        return;

      case STEPS.RESET_OTP:
        setDirection(1);
        setCurrentStep(STEPS.RESET_PASSWORD);
        return;

      case STEPS.RESET_PASSWORD:
        await handleResetPassword();
        return;
    }
  };
  const handleResetOTPChange = (text: string, index: number) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 6).split("");
      setResetOtpValues(chars);
      setTimeout(() => {
        if (chars.length < 6) {
          resetOtpRefs.current[chars.length]?.focus();
        } else {
          resetOtpRefs.current[5]?.blur();
        }
      }, 10);
      if (inputError) setInputError("");
      return;
    }
    const newResetValues = [...resetOtpValues];
    newResetValues[index] = cleaned[0] || "";
    setResetOtpValues(newResetValues);
    if (cleaned && index < 5) resetOtpRefs.current[index + 1]?.focus();
    if (index === 5 && cleaned)
      setTimeout(() => resetOtpRefs.current[5]?.blur(), 10);
    if (inputError) setInputError("");
  };

  const handleBack = (toStep: StepType) => {
    setDirection(-1);
    if (toStep) {
      setCurrentStep(toStep);
    } else {
      // Define your back navigation logic
      switch (currentStep) {
        case STEPS.LOGIN:
          setCurrentStep(STEPS.AUTH_METHOD);
          break;
        case STEPS.VERIFY_OTP:
          setCurrentStep(STEPS.LOGIN);
          break;
        case STEPS.FORGOT_PASSWORD:
          setCurrentStep(STEPS.AUTH_METHOD);
          break;
        case STEPS.RESET_OTP:
          setCurrentStep(STEPS.FORGOT_PASSWORD);
          break;
        case STEPS.RESET_PASSWORD:
          setCurrentStep(STEPS.RESET_OTP);
          break;
      }
    }
    setInputError("");
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
  // Add this above your render (if not already there)
  const isOtpComplete = resetOtpValues.every((d) => d && d.length === 1);
  const canContinue = isOtpComplete && !isLoading;
  const canReset =
    isOtpComplete &&
    resetPasswordValidation.hasUppercase &&
    resetPasswordValidation.hasSpecialChar &&
    resetPasswordValidation.hasNumber &&
    resetPasswordValidation.hasMinLength &&
    passwordsMatch &&
    !isLoading;

  const isValidInput = !getCurrentValidation();

  const renderModalContent = (step: string) => {
    const baseInputStyle = (
      hasError: boolean,
      isFocused: boolean,
      isValid: boolean
    ) =>
      `rounded-[17px] h-[3.9rem] leading-[17px] px-[5%] text-base text-gray-900 border ${
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
      `w-14 h-14 rounded-2xl leading-[20px] text-center text-xl font-semibold border ${
        hasError
          ? "bg-light-red border-border-red text-red-600"
          : isFocused
          ? "bg-light-blue border-border-blue text-blue-600"
          : hasValue
          ? "bg-light-green border-border-green text-green-600"
          : "bg-[#F5F5F5] border-[#A3A3A321] text-gray-900"
      }`;

    switch (step) {
      case STEPS.AUTH_METHOD:
        return (
          <View className="bg-white rounded-[40px]  p-[7%] shadow-2xl">
            <View className="">
              <View className="flex-row   items-center justify-between">
                {/* Center logo */}
                <View className="absolute left-0 right-0 items-center ">
                  <Image
                    source={images.logo}
                    className="w-28 "
                    resizeMode="contain"
                  />
                </View>

                {/* Close button aligned right */}
                <TouchableOpacity
                  onPress={handleModalClose}
                  className="p-3 bg-gray-100 rounded-full ml-auto"
                >
                  <Feather name="x" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View className="items-center my-8">
                <Text className="text-2xl font-neutral-bold  text-[#000000] mb-1.5">
                  Welcome Back!
                </Text>
                <Text className="text-base  font-normal text-center  text-[#000000]/50">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum,
                  saepe.
                </Text>
              </View>

              <View className="">
                <TouchableOpacity
                  onPress={() => {
                    setDirection(1); //  Set direction to -1 for right-to-left animation
                    setCurrentStep(STEPS.LOGIN);
                  }}
                  className="bg-[#0368FF] rounded-[28px] py-6 px-6"
                  activeOpacity={0.8}
                >
                  <Text className="text-[#FFFFFF] text-center font-semibold text-[16px]">
                    Login with Email
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="items-center mt-3">
                <TouchableOpacity
                  className="bg-[#F3F3F3] w-full items-center rounded-[28px] py-3 px-6 border justify-center gap-2 flex-row border-[#0000000F]/[5%]"
                  activeOpacity={0.8}
                  onPress={() =>
                    router.replace(RouterConstantUtil.tabs.home as any)
                  }
                >
                  <Image
                    source={icons.google}
                    className="w-8 h-10"
                    resizeMode="contain"
                  />
                  <Text className="text-center font-semibold text-[16px]">
                    Login with Google
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      case STEPS.LOGIN:
        return (
          <View className="bg-white rounded-t-3xl py-6 shadow-2xl">
            <View className="px-6">
              <View className="flex-row justify-between items-center mb-6">
                <TouchableOpacity
                  onPress={() => handleBack(STEPS.AUTH_METHOD)}
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

              <View className=" relative ">
                <TextInput
                  value={email}
                  onChangeText={(text) => handleInputChange(text, "email")}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  ref={emailRef}
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
                    placeholder="Enter password"
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
                    className="absolute right-4 top-[17px]"
                    // style={{ transform: [{ translateY: "-50%" }] }}
                  >
                    {showPassword ? (
                      <Feather name="eye-off" size={20} color="#666" />
                    ) : (
                      <Feather name="eye" size={20} color="#666" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View className="  mb-4 mt-2   w-full px-2">
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
                  label="Atleast 1 digit"
                  passed={passwordValidation.hasNumber}
                />
              </View>

              {inputError ? (
                <Text className="text-red-500 text-sm mb-3 px-2">
                  {inputError}
                </Text>
              ) : null}

              {/* <Text className="text-gray-500 text-md font-neutral-regular text-center mb-4 leading-5 mt-2">
                Enter your email and password to{"\n"}receive a verification
                code
              </Text> */}

              <TouchableOpacity
                onPress={() => {
                  setDirection(1); //  Set direction to -1 for right-to-left animation
                  setCurrentStep(STEPS.FORGOT_PASSWORD);
                }}
                className="w-full mb-3"
                activeOpacity={0.8}
              >
                <Text className="text-center py-2 font-sfpro-bold text-black/50 font-semibold text-lg">
                  Forgot password?
                </Text>
              </TouchableOpacity>

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
                    Continue
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );

      case STEPS.VERIFY_OTP:
        return (
          <View className="bg-white py-[8%] rounded-t-3xl shadow-2xl">
            <View className="px-6">
              <View className="flex-row justify-between items-center mb-6">
                <TouchableOpacity
                  onPress={() => handleBack(STEPS.LOGIN)}
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
                <View className="flex-row justify-center space-x-3 gap-2 mb-4">
                  {otpValues.map((value, index) => (
                    <TextInput
                      key={index}
                      ref={(ref: any) => (otpRefs.current[index] = ref!)}
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

      //  Forgot Password (input email)
      case STEPS.FORGOT_PASSWORD:
        return (
          <View className="bg-white rounded-t-3xl py-6 shadow-2xl">
            <View className="px-6">
              <View className="flex-row justify-between items-center mb-6">
                <TouchableOpacity
                  onPress={() => handleBack(STEPS.VERIFY_OTP)}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <Feather name="arrow-left" size={20} color="#666" />
                </TouchableOpacity>
                <Text className="text-xl font-semibold text-gray-900">
                  Forgot password
                </Text>
                <TouchableOpacity
                  onPress={handleModalClose}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <Feather name="x" size={20} color="#666" />
                </TouchableOpacity>
              </View>
              <Text className="text-gray-700 text-base mb-4">
                Enter your email to get a reset code.
              </Text>
              <TextInput
                value={forgotPasswordEmail}
                onChangeText={(text) => {
                  setForgotPasswordEmail(text);
                  setInputError(""); // clear error on input
                }}
                placeholder="Email address"
                ref={forgotEmailRef}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setFocusedField("forgotPasswordEmail")}
                onBlur={() => setFocusedField(null)}
                className={baseInputStyle(
                  !!inputError && !forgotPasswordEmail.trim(),
                  focusedField === "forgotPasswordEmail",
                  !!forgotPasswordEmail.trim()
                )}
                returnKeyType="done" // This sets the keyboard button text to "Done"
                onSubmitEditing={handleContinue}
              />
              <View className=" mt-2 w-full px-2">
                <ValidationItem
                  label="Must be a valid email"
                  passed={forgotEmailValidation === ""}
                />
              </View>
              {inputError ? (
                <Text className="text-red-500 text-sm ">{inputError}</Text>
              ) : null}
              <TouchableOpacity
                onPress={handleContinue}
                disabled={!canSendReset}
                className={`rounded-full p-4 mt-5 ${
                  canSendReset ? "bg-secondary" : "bg-disabled"
                }`}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="blue" />
                ) : (
                  <Text
                    className={`text-center font-semibold text-base ${
                      canSendReset ? "text-white" : "text-gray-400"
                    }`}
                  >
                    Send Code
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );

      case STEPS.RESET_OTP:
        return (
          <View className="bg-white rounded-t-3xl py-6 shadow-2xl">
            <View className="px-6">
              <View className="flex-row justify-between items-center mb-6">
                <TouchableOpacity
                  onPress={() => handleBack(STEPS.FORGOT_PASSWORD)}
                  className="p-2 bg-gray-100 rounded-full"
                  disabled={isLoading}
                >
                  <Feather name="arrow-left" size={20} color="#666" />
                </TouchableOpacity>
                <Text className="text-xl font-semibold text-gray-900">
                  Reset password
                </Text>
                <TouchableOpacity
                  onPress={handleModalClose}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <Feather name="x" size={20} color="#666" />
                </TouchableOpacity>
              </View>
              <Text className="text-gray-700 text-base mb-4">
                Enter the 6-digit code sent to your email, and your new
                password.
              </Text>
              {/* OTP Input UI */}
              <View className="mb-4">
                <View className="flex-row justify-center space-x-3 gap-2 mb-4">
                  {resetOtpValues.map((value, index) => (
                    <TextInput
                      key={index}
                      value={value}
                      ref={(ref: any) => (resetOtpRefs.current[index] = ref!)}
                      onChangeText={(text) => handleResetOTPChange(text, index)}
                      onKeyPress={({ nativeEvent }) => {
                        if (
                          nativeEvent.key === "Backspace" &&
                          !resetOtpValues[index] &&
                          index > 0
                        ) {
                          resetOtpRefs.current[index - 1]?.focus();
                        }
                      }}
                      keyboardType="number-pad"
                      className={otpInputStyle(!!inputError, false, !!value)}
                      maxLength={1}
                      selectTextOnFocus
                      editable={!isLoading}
                      placeholder="–"
                      placeholderTextColor="#9CA3AF"
                    />
                  ))}
                </View>
              </View>
              <View className="flex-row items-center justify-center mt-3 mb-3">
                <Text className="text-black font-semibold text-sm mr-2">
                  Resend code in
                </Text>
                <View className="bg-[#F7F7F7] rounded-full px-2 py-1">
                  <Text className="text-black font-bold text-sm">
                    {resetResendTimer > 0
                      ? `0${Math.floor(resetResendTimer / 60)}:${String(
                          resetResendTimer % 60
                        ).padStart(2, "0")}`
                      : "00:00"}
                  </Text>
                </View>
                {canResendResetCode && (
                  <TouchableOpacity
                    onPress={handleResendResetCode}
                    className="ml-4"
                    disabled={isLoading}
                  >
                    <Text className="text-blue-600 font-bold">Resend</Text>
                  </TouchableOpacity>
                )}
              </View>

              {inputError ? (
                <Text className="text-red-500 text-sm mt-3">{inputError}</Text>
              ) : null}
              <TouchableOpacity
                onPress={handleContinue}
                disabled={!canContinue}
                className={`rounded-full p-4 mt-2 ${
                  canContinue ? "bg-secondary" : "bg-disabled"
                }`}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="blue" />
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

      // : Reset Password (OTP + New Passwords)
      case STEPS.RESET_PASSWORD:
        return (
          <View className="bg-white rounded-t-3xl py-6 shadow-2xl">
            <View className="px-6">
              <View className="flex-row justify-between items-center mb-6">
                <TouchableOpacity
                  onPress={() => handleBack(STEPS.RESET_OTP)}
                  className="p-2 bg-gray-100 rounded-full"
                  disabled={isLoading}
                >
                  <Feather name="arrow-left" size={20} color="#666" />
                </TouchableOpacity>
                <Text className="text-xl font-semibold text-gray-900">
                  Reset password
                </Text>
                <TouchableOpacity
                  onPress={handleModalClose}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <Feather name="x" size={20} color="#666" />
                </TouchableOpacity>
              </View>
              <Text className="text-gray-700 text-base mb-4">
                Enter the 6-digit code sent to your email, and your new
                password.
              </Text>
              <View className=" gap-3">
                <View className="relative">
                  <TextInput
                    value={resetPassword}
                    onChangeText={setResetPassword}
                    ref={resetPasswordRef}
                    placeholder="New password"
                    secureTextEntry={!showResetPassword}
                    onFocus={() => setFocusedField("resetPassword")}
                    onBlur={() => setFocusedField(null)}
                    className={baseInputStyle(
                      !!inputError && !resetPassword.trim(),
                      focusedField === "resetPassword",
                      !!resetPassword.trim()
                    )}
                  />
                  <TouchableOpacity
                    onPress={() => setShowResetPassword((prev) => !prev)}
                    className="absolute right-4 top-4"
                    style={{ padding: 4 }}
                  >
                    <Feather
                      name={showResetPassword ? "eye-off" : "eye"}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>

                <View className="relative">
                  <TextInput
                    value={resetConfirmPassword}
                    onChangeText={setResetConfirmPassword}
                    placeholder="Confirm new password"
                    secureTextEntry={!showResetPassword}
                    onFocus={() => setFocusedField("resetConfirmPassword")}
                    onBlur={() => setFocusedField(null)}
                    className={baseInputStyle(
                      !!inputError && !resetConfirmPassword.trim(),
                      focusedField === "resetConfirmPassword",
                      !!resetConfirmPassword.trim()
                    )}
                  />
                  <TouchableOpacity
                    onPress={() => setShowResetPassword((prev) => !prev)}
                    className="absolute right-4 top-4"
                    style={{ padding: 4 }}
                  >
                    <Feather
                      name={showResetPassword ? "eye-off" : "eye"}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="mb-2 w-full p-2">
                <ValidationItem
                  label="At least 1 uppercase letter"
                  passed={resetPasswordValidation.hasUppercase}
                />
                <ValidationItem
                  label="At least 1 special character"
                  passed={resetPasswordValidation.hasSpecialChar}
                />
                <ValidationItem
                  label="Minimum 8 characters"
                  passed={resetPasswordValidation.hasMinLength}
                />
                <ValidationItem
                  label="Passwords must match"
                  passed={passwordsMatch}
                />
              </View>

              {inputError ? (
                <Text className="text-red-500 text-sm ">{inputError}</Text>
              ) : null}
              <TouchableOpacity
                onPress={handleContinue}
                disabled={!canReset}
                className={`rounded-full p-4 mt-2 ${
                  canReset ? "bg-secondary" : "bg-disabled"
                }`}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="blue" />
                ) : (
                  <Text
                    className={`text-center font-semibold text-base ${
                      canReset ? "text-white" : "text-gray-400"
                    }`}
                  >
                    Reset Password
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
      animationType="slide"
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
              {/* Sliding cards area */}
              <View
                style={{ position: "relative" }}
                className="justify-center w-[90vw] max-w-[400px] items-center"
              >
                {/* Outgoing card */}
                {isAnimating && prevStep !== null && (
                  <Animated.View
                    style={{
                      position: "absolute",
                      left: 0,
                      bottom: 0,
                      width: "100%",
                      zIndex: 1,
                      transform: [{ translateX: exitAnim }],
                    }}
                    className="rounded-3xl overflow-hidden mb-[10vw]"
                  >
                    {renderModalContent(prevStep)}
                  </Animated.View>
                )}
                {/* Incoming/current card */}
                <Animated.View
                  style={{
                    width: "100%",
                    transform: [{ translateX: isAnimating ? enterAnim : 0 }],
                    position: isAnimating ? "absolute" : "relative",
                    left: 0,
                    bottom: 0,
                    zIndex: 2,
                  }}
                  className="rounded-3xl overflow-hidden mb-[10vw]"
                >
                  {renderModalContent(
                    isAnimating && nextStep !== null ? nextStep : displayedStep
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

export default LoginModal;
