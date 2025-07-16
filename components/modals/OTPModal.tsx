import { images } from "@/constants/images";
import React, { useRef, useState } from "react";
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface OTPModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (otp: string) => void;
  onResend: () => void;
  title?: string;
  subtitle?: string;
  email?: string;
}

const OTPModal: React.FC<OTPModalProps> = ({
  visible,
  onClose,
  onConfirm,
  onResend,
  title = "Confirm code",
  subtitle = "Enter the 6-digits code we sent to your mail",
  email,
}) => {
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [isOTPValid, setIsOTPValid] = useState(true);
  const otpInputRefs = useRef<Array<TextInput | null>>([]);

  const handleOTPChange = (text: string, index: number) => {
    const newOtp = [...otpCode];
    newOtp[index] = text;
    setOtpCode(newOtp);
    setIsOTPValid(true);

    if (text && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const validateOTP = (): boolean => {
    return otpCode.every((digit) => digit !== "");
  };

  const handleConfirmOTP = () => {
    if (!validateOTP()) {
      setIsOTPValid(false);
      Alert.alert("Invalid OTP", "Please enter the complete 6-digit code");
      return;
    }

    onConfirm(otpCode.join(""));
    resetOTP();
  };

  const handleResendOTP = () => {
    resetOTP();
    onResend();
  };

  const resetOTP = () => {
    setOtpCode(["", "", "", "", "", ""]);
    setIsOTPValid(true);
  };

  const handleClose = () => {
    resetOTP();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-end">
          <TouchableOpacity
            className="flex-1 bg-black/50"
            activeOpacity={1}
            onPress={handleClose}
          />

          <ImageBackground
            source={images.otpmodalbg}
            resizeMode="cover"
            className="rounded-t-3xl overflow-hidden h-50"
          >
            <View className="bg-grayish-100 rounded-t-3xl pb-8">
              <View className="items-center py-4">
                <View className="w-12 h-2 bg-[#F3F3F326]/[10%] rounded-full" />
              </View>

              <View className="flex-row items-center justify-between px-6 py-2">
                <TouchableOpacity
                  onPress={handleClose}
                  className="w-10 h-10 rounded-full bg-[#F3F3F326]/[15%] items-center justify-center"
                >
                  <Text className="text-white text-xl">×</Text>
                </TouchableOpacity>
                <Text className="text-brandWhite text-[17.5px] font-semibold">
                  {title}
                </Text>
                <View className="w-10" />
              </View>

              {/* Content */}
              <View className="px-6 pt-6">
                <Text className="text-brandWhite text-center text-2xl font-bold mb-4">
                  Confirm OTP sent to your email
                </Text>
                <Text className="text-gray-400 text-center mb-8 text-base">
                  {subtitle}
                </Text>

                <View className="flex-row justify-center space-x-3 gap-2 mb-6">
                  {otpCode.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => (otpInputRefs.current[index] = ref) as any}
                      className={`w-14 h-14 bg-[#2B2B2B] rounded-full text-white text-center text-2xl font-bold border-[3px] border-brandWhite/[11%] ${
                        !isOTPValid && digit === ""
                          ? "border border-red-500"
                          : ""
                      }`}
                      maxLength={1}
                      keyboardType="numeric"
                      value={digit}
                      onChangeText={(text) => handleOTPChange(text, index)}
                      onKeyPress={({ nativeEvent }) =>
                        handleOTPKeyPress(nativeEvent.key, index)
                      }
                      selectTextOnFocus
                    />
                  ))}
                </View>

                {!isOTPValid && (
                  <Text className="text-red-500 text-sm text-center mb-4">
                    Please enter the complete 6-digit code
                  </Text>
                )}

                <TouchableOpacity onPress={handleResendOTP} className="mb-8">
                  <Text className="text-secondary text-center font-semibold text-lg">
                    Resend
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`py-5 rounded-full items-center mb-4 ${
                    validateOTP() ? "bg-secondary" : "bg-brandWhite/[14%]"
                  }`}
                  onPress={handleConfirmOTP}
                  disabled={!validateOTP()}
                >
                  <Text className="text-white text-center font-semibold text-lg">
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default OTPModal;
