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
  jwtToken: string;
  user: User | null;
  error: any | null;
  code: string; // <--- add this!
}

export interface AuthTokens {
  jwtToken: string;
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

export interface NormalResponse {
  success: boolean;
  message: string;
}

export interface PasswordChangeRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UsernameChangeRequest {
  newUsername: string;
}

export interface AuthState {
  user: User | null;
  token?: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
