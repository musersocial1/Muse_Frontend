import {
  AuthResponse,
  LoginRequest,
  NormalResponse,
  PasswordChangeRequest,
  PhoneVerificationRequest,
  RegisterRequest,
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
    console.log(response.data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<any> => {
    const response = await userApiClient.post<any>("/user/signup", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await userApiClient.post("/user/logout");
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
    return response.data;
  },

  // User profile endpoints
  getUserProfile: async (): Promise<User> => {
    const response = await userApiClient.get<User>("/user/me");
    console.log("proeilll", response.data);
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
    return response.data;
  },

  requestPasswordChange: async (
    data: PasswordChangeRequest
  ): Promise<NormalResponse> => {
    const response = await userApiClient.post<NormalResponse>(
      "/user/change-password",
      data
    );
    console.log(response.data, "theee ");
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
};
