import { showError } from "@/lib/toast";
import {
  AuthResponse,
  LoginRequest,
  NormalResponse,
  PasswordChangeRequest,
  PhoneVerificationRequest,
  RegisterRequest,
  SendOtpRequest,
  SendPhoneVerificationRequest,
  User,
  UsernameChangeRequest,
} from "@/types/auth";
import { userApiClient } from "./apiClient";

export const authAPI = {
  // Authentication endpoints
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await userApiClient.post<AuthResponse>(
      "/user/signin",
      data
    );

    // If login is successful and response has code & email, trigger OTP email
    if (response.data?.code && response.data?.email) {
      console.log(response.data.code);

      try {
        // Optionally pass userName if available from response or input data
        await authAPI.sendOtpEmail({
          email: response.data.email,
          otp: response.data.code,
        });
        // console.log("OTP email sent!");
      } catch (error: any) {
        showError(
          "Error",
          `${error.message} || "Failed to send verification code"`
        );
        console.error("Failed to send OTP email:", error.message);
        // Optionally show user a toast or UI feedback
      }
    }
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<any> => {
    const response = await userApiClient.post<any>("/user/signup", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await userApiClient.post("/user/logout");
  },

  sendOtpEmail: async (data: SendOtpRequest): Promise<{ message: string }> => {
    // Get the API endpoint from env
    const url = `${process.env.EXPO_PUBLIC_EMAIL_LINK}/api/otps`;
    if (!url) throw new Error("Email OTP API link is not set in env vars");
    console.log(url, "this is url");
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resJson = await response.json();

    if (!response.ok) {
      throw new Error(resJson.error || "Failed to send OTP email");
    }
    return resJson;
  },

  // Phone verification endpoints
  sendPhoneVerificationCode: async (
    data: SendPhoneVerificationRequest
  ): Promise<NormalResponse> => {
    const response = await userApiClient.post<NormalResponse>(
      "/user/send-code",
      data
    );
    return response.data;
  },

  resendPhoneVerificationCode: async (
    data: SendPhoneVerificationRequest
  ): Promise<NormalResponse> => {
    const response = await userApiClient.post<NormalResponse>(
      "/user/resend-code",
      data
    );
    return response.data;
  },

  verifyPhoneVerificationCode: async (
    data: PhoneVerificationRequest
  ): Promise<NormalResponse> => {
    const response = await userApiClient.post<NormalResponse>(
      "/user/verify-code",
      data
    );
    return response.data;
  },

  // Email verification endpoints
  verifyLogin: async (data: {
    email: string;
    code: string;
  }): Promise<AuthResponse> => {
    const response = await userApiClient.post<AuthResponse>(
      "/user/verify-login",
      data
    );
    return response.data;
  },

  resendEmailVerificationCode: async (data: {
    email: string;
  }): Promise<NormalResponse> => {
    const response = await userApiClient.post<NormalResponse>(
      "/user/resend",
      data
    );
    console.log("response");
    return response.data;
  },

  // User profile endpoints
  getUserProfile: async (): Promise<any> => {
    const response = await userApiClient.get<User>("/user/me");
    return response.data;
  },

  // Account management endpoints
  requestEmailChange: async (data: {
    newEmail: string;
  }): Promise<NormalResponse> => {
    const response = await userApiClient.post<NormalResponse>(
      "/user/change-email",
      data
    );

    // console.log(response);
    return response.data;
  },

  confirmEmailChange: async (data: {
    newEmail: string;
    code: string;
  }): Promise<NormalResponse> => {
    const response = await userApiClient.post<NormalResponse>(
      "/user/confirm-email",
      data
    );
    console.log(response);
    return response.data;
  },

  requestPasswordChange: async (
    data: PasswordChangeRequest
  ): Promise<NormalResponse> => {
    const response = await userApiClient.post<NormalResponse>(
      "/user/change-password",
      data
    );
    // If login is successful and response has code & email, trigger OTP email
    if (response.data?.code && response.data?.email) {
      console.log(response.data.code);

      try {
        // Optionally pass userName if available from response or input data
        await authAPI.sendOtpEmail({
          email: response.data.email,
          otp: response.data.code,
        });
        // console.log("OTP email sent!");
      } catch (error: any) {
        showError(
          "Error",
          `${error.message} || "Failed to send verification code"`
        );
        console.error("Failed to send OTP email:", error.message);
        // Optionally show user a toast or UI feedback
      }
    }
    return response.data;
  },

  confirmPasswordChange: async (
    code: string,
    newPassword: string
  ): Promise<NormalResponse> => {
    const response = await userApiClient.post<NormalResponse>(
      "/user/confirm-password",
      { code, newPassword }
    );
    return response.data;
  },

  changeUsername: async (
    data: UsernameChangeRequest
  ): Promise<NormalResponse> => {
    const response = await userApiClient.patch<NormalResponse>(
      "/user/username",
      data
    );
    return response.data;
  },

  /**
   * Check if a phone number already exists (for onboarding)
   * @param phoneNumber string (should include country code, e.g. +2347012345678)
   * @returns { exists: boolean, ...data }
   */
  checkPhoneNumberExists: async (
    phoneNumber: string
  ): Promise<{ exists: boolean; [key: string]: any }> => {
    try {
      const response = await userApiClient.get("/user/check-user", {
        params: { phoneNumber },
      });
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return { exists: false };
      }
      throw error;
    }
  },
  checkEmailExists: async (
    email: string
  ): Promise<{ exists: boolean; [key: string]: any }> => {
    try {
      const response = await userApiClient.get("/user/check-user", {
        params: { email },
      });
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return { exists: false };
      }
      throw error;
    }
  },

  checkUsernameExists: async (
    username: string
  ): Promise<{ exists: boolean; [key: string]: any }> => {
    try {
      const response = await userApiClient.get("/user/check-user", {
        params: { username },
      });
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return { exists: false };
      }
      throw error;
    }
  },
};
