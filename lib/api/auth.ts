import {
  AuthResponse,
  EmailChangeRequest,
  LoginRequest,
  PasswordChangeRequest,
  PhoneVerificationRequest,
  PhoneVerificationResponse,
  RegisterRequest,
  SendPhoneVerificationRequest,
  User,
  UsernameChangeRequest,
} from "@/types/auth";
import { apiClient } from "./apiClient";

export const authAPI = {
  // Authentication endpoints
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/user/signin", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<any> => {
    const response = await apiClient.post<any>("/user/signup", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/user/logout");
  },

  // Phone verification endpoints
  sendPhoneVerificationCode: async (
    data: SendPhoneVerificationRequest
  ): Promise<PhoneVerificationResponse> => {
    const response = await apiClient.post<PhoneVerificationResponse>(
      "/user/send-code",
      data
    );
    return response.data;
  },

  resendPhoneVerificationCode: async (
    data: SendPhoneVerificationRequest
  ): Promise<PhoneVerificationResponse> => {
    const response = await apiClient.post<PhoneVerificationResponse>(
      "/user/resend-code",
      data
    );
    return response.data;
  },

  verifyPhoneVerificationCode: async (
    data: PhoneVerificationRequest
  ): Promise<PhoneVerificationResponse> => {
    const response = await apiClient.post<PhoneVerificationResponse>(
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
    const response = await apiClient.post<AuthResponse>(
      "/user/verify-login",
      data
    );
    return response.data;
  },

  resendEmailVerificationCode: async (data: {
    email: string;
  }): Promise<PhoneVerificationResponse> => {
    const response = await apiClient.post<PhoneVerificationResponse>(
      "/user/resend",
      data
    );
    return response.data;
  },

  // User profile endpoints
  getUserProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>("/user/me");
    return response.data;
  },

  // Account management endpoints
  requestEmailChange: async (
    data: EmailChangeRequest
  ): Promise<PhoneVerificationResponse> => {
    const response = await apiClient.post<PhoneVerificationResponse>(
      "/user/change-email",
      data
    );
    return response.data;
  },

  confirmEmailChange: async (
    code: string
  ): Promise<PhoneVerificationResponse> => {
    const response = await apiClient.post<PhoneVerificationResponse>(
      "/user/confirm-email",
      { code }
    );
    return response.data;
  },

  requestPasswordChange: async (
    data: PasswordChangeRequest
  ): Promise<PhoneVerificationResponse> => {
    const response = await apiClient.post<PhoneVerificationResponse>(
      "/user/change-password",
      data
    );
    return response.data;
  },

  confirmPasswordChange: async (
    code: string
  ): Promise<PhoneVerificationResponse> => {
    const response = await apiClient.post<PhoneVerificationResponse>(
      "/user/confirm-change-password",
      { code }
    );
    return response.data;
  },

  changeUsername: async (
    data: UsernameChangeRequest
  ): Promise<PhoneVerificationResponse> => {
    const response = await apiClient.post<PhoneVerificationResponse>(
      "/user/username",
      data
    );
    return response.data;
  },
};
