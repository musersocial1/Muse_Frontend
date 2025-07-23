import OTPModal from "@/components/modals/OTPModal";
import { icons } from "@/constants/icons";
import { RouterConstantUtil } from "@/constants/RouterConstantUtil";
import { useAuth } from "@/hooks/useAuth";
import { authAPI } from "@/lib/api/auth";
import { showError, showSuccess } from "@/lib/toast";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const ChangeEmail = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false); // <-- for liveness check
  const [emailError, setEmailError] = useState(""); // <-- for liveness check feedback

  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setIsEmailValid(validateEmail(text));
    setEmailError(""); // clear email error on input change
  };

  const handleChangeEmail = async () => {
    // Local validation
    if (!validateEmail(email)) {
      setIsEmailValid(false);
      setEmailError("Please enter a valid email address");
      inputRef.current?.focus();
      return;
    }

    setIsChecking(true);
    setEmailError("");

    try {
      // Step 1: Liveness check with backend
      const { exists, message } = await authAPI.checkEmailExists(email.trim());

      if (exists) {
        setEmailError(message || "Email is already in use");
        setIsEmailValid(false);
        inputRef.current?.focus();
        setIsChecking(false);
        return;
      }

      setIsChecking(false);

      // Step 2: Proceed to send change email OTP if available
      setIsLoading(true);

      const response = await authAPI.requestEmailChange({
        newEmail: email,
      });

      if (response) {
        try {
          await authAPI.sendOtpEmail({
            email: response.newEmail,
            otp: response.code,
          });
          showSuccess(
            "Verification Code Sent",
            "Please check your new email for the verification code"
          );
          setShowOTP(true);
        } catch (error: any) {
          showError(
            "Error",
            `${error.message} || "Failed to send verification code"`
          );
        }
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to check email";
      setEmailError(errorMessage);
      setIsEmailValid(false);
      inputRef.current?.focus();
    } finally {
      setIsLoading(false);
      setIsChecking(false);
    }
  };

  const handleOTPConfirm = async (otp: string) => {
    setOtpLoading(true);

    try {
      const response = await authAPI.confirmEmailChange({
        newEmail: email,
        code: otp,
      });

      if (response) {
        showSuccess("Success", "Email changed successfully");
        setShowOTP(false);
        router.replace(RouterConstantUtil.tabs.profile as any);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to send verification code";
      showError("Error", errorMessage);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(60); // 🔁 reset timer

    await handleChangeEmail(); // reuse existing resend logic
  };

  const insets = useSafeAreaInsets();

  const isButtonDisabled =
    !validateEmail(email) ||
    isLoading ||
    isChecking ||
    !!emailError ||
    !isEmailValid;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#121212" }}
      behavior={"padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? -50 : -55}
    >
      <View className="flex-1 bg-[#121212]">
        <StatusBar barStyle="light-content" />
        <SafeAreaView className="flex-1">
          <View className="flex-row items-center justify-between px-6 pb-4">
            <TouchableOpacity
              onPress={() =>
                router.replace(RouterConstantUtil.tabs.profile as any)
              }
              className="w-10 h-10 rounded-full items-center justify-center"
            >
              <Image source={icons.back} className="w-14 h-14" />
            </TouchableOpacity>
            <Text className="text-[#FFFFFF] text-[20px] font-bold">
              Change email
            </Text>
            <View className="w-10" />
          </View>

          <View className="flex-1 px-6 pt-8">
            <View
              className={`bg-[#2A2A2A] rounded-full h-[60px] px-[5%] mb-6 border-2 ${
                emailError
                  ? "border-red-500"
                  : isEmailValid && email.length > 0
                  ? "border-green-500"
                  : "border-transparent"
              }`}
            >
              <TextInput
                ref={inputRef}
                className="text-white/50 font-bold h-full text-[15px] font-sfpro-bold"
                value={email}
                onChangeText={handleEmailChange}
                placeholder="Enter your email"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading && !isChecking}
              />
              {/* Spinner while checking */}
              {isChecking && (
                <View style={{ position: "absolute", right: 24, top: 18 }}>
                  <ActivityIndicator size="small" color="#36f" />
                </View>
              )}
            </View>
            {!!emailError && (
              <Text className="text-red-500 text-sm mb-4 px-2">
                {emailError}
              </Text>
            )}
            {isEmailValid && !emailError && email.length > 0 && (
              <Text className="text-green-500 text-sm mb-4 px-2">
                Email looks good
              </Text>
            )}
          </View>

          <View className="px-6 pb-8">
            <TouchableOpacity
              className={`py-4 rounded-full items-center justify-center ${
                !isButtonDisabled ? "bg-secondary" : "bg-gray-600"
              }`}
              onPress={handleChangeEmail}
              disabled={isButtonDisabled}
            >
              {isLoading || isChecking ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  Change
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <OTPModal
          visible={showOTP}
          onClose={() => setShowOTP(false)}
          onConfirm={handleOTPConfirm}
          onResend={handleResendOTP}
          title="Confirm code"
          subtitle="Enter the 6-digits code we sent to your mail"
          email={email}
          resendTimer={resendTimer}
          canResend={canResend}
          isLoading={otpLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};
export default ChangeEmail;
