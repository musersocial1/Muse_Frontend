import { authAPI } from "@/lib/api/auth";
import {
  EmailChangeRequest,
  PasswordChangeRequest,
  PhoneVerificationRequest,
  SendPhoneVerificationRequest,
  UsernameChangeRequest,
} from "@/types/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
};

export const useUserProfile = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: authAPI.getUserProfile,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export const useSendPhoneVerification = () => {
  return useMutation({
    mutationFn: (data: SendPhoneVerificationRequest) =>
      authAPI.sendPhoneVerificationCode(data),
    onSuccess: (data) => {
      console.log("Phone verification code sent:", data.message);
    },
    onError: (error: any) => {
      console.error(
        "Send phone verification error:",
        error.response?.data?.message
      );
    },
  });
};

export const useResendPhoneVerification = () => {
  return useMutation({
    mutationFn: (data: SendPhoneVerificationRequest) =>
      authAPI.resendPhoneVerificationCode(data),
    onSuccess: (data) => {
      console.log("Phone verification code resent:", data.message);
    },
    onError: (error: any) => {
      console.error(
        "Resend phone verification error:",
        error.response?.data?.message
      );
    },
  });
};

export const useVerifyPhoneCode = () => {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: (data: PhoneVerificationRequest) =>
      authAPI.verifyPhoneVerificationCode(data),
    onSuccess: async (data) => {
      console.log("Phone verification successful:", data.message);
      // RefreshING user data after successful verification
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
    onError: (error: any) => {
      console.error("Verify phone code error:", error.response?.data?.message);
    },
  });
};

// Email verification mutations
export const useResendEmailVerification = () => {
  return useMutation({
    mutationFn: authAPI.resendEmailVerificationCode,
    onSuccess: (data) => {
      console.log("Email verification code resent:", data.message);
    },
    onError: (error: any) => {
      console.error(
        "Resend email verification error:",
        error.response?.data?.message
      );
    },
  });
};

// Account management mutations
export const useRequestEmailChange = () => {
  return useMutation({
    mutationFn: (data: EmailChangeRequest) => authAPI.requestEmailChange(data),
    onSuccess: (data) => {
      console.log("Email change request sent:", data.message);
    },
    onError: (error: any) => {
      console.error(
        "Request email change error:",
        error.response?.data?.message
      );
    },
  });
};

// export const useConfirmEmailChange = () => {
//   const queryClient = useQueryClient();
//   const { refreshUser } = useAuth();

//   return useMutation({
//     mutationFn: (code: string) => authAPI.confirmEmailChange({code}),
//     onSuccess: async (data) => {
//       console.log("Email change confirmed:", data.message);
//       await refreshUser();
//       queryClient.invalidateQueries({ queryKey: authKeys.profile() });
//     },
//     onError: (error: any) => {
//       console.error(
//         "Confirm email change error:",
//         error.response?.data?.message
//       );
//     },
//   });
// };

export const useRequestPasswordChange = () => {
  return useMutation({
    mutationFn: (data: PasswordChangeRequest) =>
      authAPI.requestPasswordChange(data),
    onSuccess: (data) => {
      console.log("Password change request sent:", data.message);
    },
    onError: (error: any) => {
      console.error(
        "Request password change error:",
        error.response?.data?.message
      );
    },
  });
};

// export const useConfirmPasswordChange = () => {
//   const { logout } = useAuth();

//   return useMutation({
//     mutationFn: (code: string) => authAPI.confirmPasswordChange(code),
//     onSuccess: async (data) => {
//       console.log("Password changed successfully:", data.message);
//       // Log user out after password change for security IIT init
//       await logout();
//     },
//     onError: (error: any) => {
//       console.error(
//         "Confirm password change error:",
//         error.response?.data?.message
//       );
//     },
//   });
// };

export const useChangeUsername = () => {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  return useMutation({
    mutationFn: (data: UsernameChangeRequest) => authAPI.changeUsername(data),
    onSuccess: async (data) => {
      console.log("Username changed successfully:", data.message);
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
    onError: (error: any) => {
      console.error("Change username error:", error.response?.data?.message);
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  return useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

// Custom hook for phone verification flow
export const usePhoneVerificationFlow = () => {
  const sendCode = useSendPhoneVerification();
  const resendCode = useResendPhoneVerification();
  const verifyCode = useVerifyPhoneCode();

  const sendVerificationCode = async (phoneNumber: string) => {
    return sendCode.mutateAsync({ phoneNumber });
  };

  const resendVerificationCode = async (phoneNumber: string) => {
    return resendCode.mutateAsync({ phoneNumber });
  };

  const verifyVerificationCode = async (phoneNumber: string, code: string) => {
    return verifyCode.mutateAsync({ phoneNumber, code });
  };

  return {
    sendVerificationCode,
    resendVerificationCode,
    verifyVerificationCode,
    isLoading:
      sendCode.isPending || resendCode.isPending || verifyCode.isPending,
    error: sendCode.error || resendCode.error || verifyCode.error,
    isSuccess: verifyCode.isSuccess,
  };
};
