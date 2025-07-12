import { Platform } from "react-native";
import { env } from "./env";

/**
 * App-wide configuration and constants
 * This file contains app-specific settings, theme configurations, and business logic constants
 */

// App Metadata
export const APP_CONFIG = {
  name: env.APP_NAME,
  version: env.APP_VERSION,
  buildNumber: Platform.select({
    ios: env.IS_PROD ? 1 : 1000,
    android: env.IS_PROD ? 1 : 1000,
  }),
  environment: env.APP_ENV,
  scheme: env.APP_SCHEME,
  bundleId: env.BUNDLE_ID,
} as const;

// Navigation Configuration
export const NAVIGATION_CONFIG = {
  initialRouteName: "index",
  defaultScreenOptions: {
    headerShown: false,
    gestureEnabled: true,
    animation: "slide_from_right",
  },
  tabBarOptions: {
    showLabel: true,
    activeTintColor: "#3B82F6",
    inactiveTintColor: "#64748B",
    style: {
      backgroundColor: "#FFFFFF",
      borderTopWidth: 1,
      borderTopColor: "#E2E8F0",
    },
  },
} as const;

// API Configuration
export const API_CONFIG = {
  baseURL: env.API_URL,
  version: env.API_VERSION,
  timeout: env.API_TIMEOUT,
  retryAttempts: env.MAX_RETRY_ATTEMPTS,
  retryDelay: 1000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-App-Version": env.APP_VERSION,
    "X-Platform": Platform.OS,
  },
} as const;

// Storage Configuration
export const STORAGE_CONFIG = {
  prefix: env.STORAGE_PREFIX,
  keys: {
    // Authentication
    AUTH_TOKEN: `${env.STORAGE_PREFIX}auth_token`,
    REFRESH_TOKEN: `${env.STORAGE_PREFIX}refresh_token`,
    USER_DATA: `${env.STORAGE_PREFIX}user_data`,

    // App State
    APP_STATE: `${env.STORAGE_PREFIX}app_state`,
    SETTINGS: `${env.STORAGE_PREFIX}settings`,
    CACHE: `${env.STORAGE_PREFIX}cache`,

    // Onboarding
    ONBOARDING_COMPLETED: `${env.STORAGE_PREFIX}onboarding_completed`,
    FIRST_LAUNCH: `${env.STORAGE_PREFIX}first_launch`,
  },
  expirationTimes: {
    SHORT: 5 * 60 * 1000, // 5 minutes
    MEDIUM: 30 * 60 * 1000, // 30 minutes
    LONG: 24 * 60 * 60 * 1000, // 24 hours
    PERSISTENT: -1, // Never expires
  },
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: env.ENABLE_ANALYTICS,
  ENABLE_CRASH_REPORTING: env.ENABLE_CRASH_REPORTING,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_BIOMETRIC_AUTH: Platform.select({
    ios: true,
    android: true,
  }),
  ENABLE_DARK_MODE: true,
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: false,
  },
  phone: /^\+?[\d\s-()]+$/,
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
  },
} as const;

// Animation Configuration
export const ANIMATION_CONFIG = {
  timing: {
    short: 150,
    medium: 300,
    long: 500,
  },
  easing: {
    easeInOut: "ease-in-out",
    easeIn: "ease-in",
    easeOut: "ease-out",
    linear: "linear",
  },
  spring: {
    tension: 100,
    friction: 8,
  },
} as const;

// Debug Configuration
export const DEBUG_CONFIG = {
  enableLogging: env.ENABLE_DEBUG_MODE,
  enableReduxLogging: env.ENABLE_DEBUG_MODE,
  enableNetworkLogging: env.ENABLE_DEBUG_MODE,
  enablePerformanceLogging: env.ENABLE_DEBUG_MODE,
  logLevel: env.IS_DEV ? "debug" : env.IS_STAGING ? "info" : "error",
} as const;

// Export utility functions
export const isFeatureEnabled = (
  feature: keyof typeof FEATURE_FLAGS
): boolean => {
  return FEATURE_FLAGS[feature] === true;
};

export const getStorageKey = (
  key: keyof typeof STORAGE_CONFIG.keys
): string => {
  return STORAGE_CONFIG.keys[key];
};

// Type exports
export type ApiConfig = typeof API_CONFIG;
export type StorageConfig = typeof STORAGE_CONFIG;
