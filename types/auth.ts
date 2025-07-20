export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  isPhoneVerified: boolean;
  dateOfBirth: string;
  accountType: string;
  gender: string;
  interests: string[];
  profilePicture: string;
  usernameChangeCount: number;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User | null;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  phoneNumber: string;
  username: string;
  firstName: string;
  lastName: string;
  confirmPassword: string;
  dateOfBirth: string;
  accountType: string;
  gender: string;
  interests: string[];
}

export interface PhoneVerificationRequest {
  phoneNumber: string;
  code: string;
}

export interface SendPhoneVerificationRequest {
  phoneNumber: string;
}

export interface PhoneVerificationResponse {
  success: boolean;
  message: string;
}

export interface EmailChangeRequest {
  newEmail: string;
  password: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UsernameChangeRequest {
  username: string;
}

export interface AuthState {
  user: User | null;
  token?: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
