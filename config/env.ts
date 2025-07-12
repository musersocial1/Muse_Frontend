import Constants from "expo-constants";

/**
 * Environment configuration with type safety and validation
 * All environment variables should be prefixed with EXPO_PUBLIC_ to be accessible in the client
 */

// Environment types
type AppEnvironment = "development" | "staging" | "production";

interface EnvConfig {
  // App Info
  readonly APP_NAME: string;
  readonly APP_VERSION: string;
  readonly APP_ENV: AppEnvironment;
  readonly APP_SCHEME: string;
  readonly BUNDLE_ID: string;

  // API Configuration
  readonly API_URL: string;
  readonly API_VERSION: string;
  readonly API_TIMEOUT: number;

  // Authentication
  readonly AUTH_TOKEN_KEY: string;
  readonly REFRESH_TOKEN_KEY: string;
  readonly AUTH_REDIRECT_URL: string;

  // External Services
  readonly GOOGLE_CLIENT_ID?: string;
  readonly FACEBOOK_APP_ID?: string;
  readonly SENTRY_DSN?: string;
  readonly ANALYTICS_KEY?: string;
  readonly STRIPE_PUBLISHABLE_KEY?: string;

  // Storage
  readonly STORAGE_PREFIX: string;
  readonly CACHE_DURATION: number;

  // Feature Flags
  readonly ENABLE_ANALYTICS: boolean;
  readonly ENABLE_CRASH_REPORTING: boolean;
  readonly ENABLE_DEBUG_MODE: boolean;
  readonly ENABLE_DEV_TOOLS: boolean;

  // Development
  readonly IS_DEV: boolean;
  readonly IS_STAGING: boolean;
  readonly IS_PROD: boolean;

  // Networking
  readonly MAX_RETRY_ATTEMPTS: number;
  readonly REQUEST_TIMEOUT: number;
}

// Helper function to get environment variable with fallback
function getEnvVar(key: string, fallback: string = ""): string {
  return process.env[key] || fallback;
}

// Helper function to get boolean environment variable
function getBooleanEnvVar(key: string, fallback: boolean = false): boolean {
  const value = process.env[key];
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
}

// Helper function to get number environment variable
function getNumberEnvVar(key: string, fallback: number): number {
  const value = process.env[key];
  if (value === undefined) return fallback;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}

// Environment validation
function validateEnvironment(): void {
  const requiredVars = ["EXPO_PUBLIC_API_URL", "EXPO_PUBLIC_APP_ENV"];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
}

// Validate environment on module load
validateEnvironment();

// Main environment configuration
const APP_ENV = getEnvVar(
  "EXPO_PUBLIC_APP_ENV",
  "development"
) as AppEnvironment;
const IS_DEV = APP_ENV === "development";
const IS_STAGING = APP_ENV === "staging";
const IS_PROD = APP_ENV === "production";

export const env: EnvConfig = {
  // App Info
  APP_NAME: Constants.expoConfig?.name || "My Expo App",
  APP_VERSION: Constants.expoConfig?.version || "1.0.0",
  APP_ENV,
  APP_SCHEME: Constants.expoConfig?.scheme || "myapp",
  BUNDLE_ID:
    Constants.expoConfig?.ios?.bundleIdentifier || "com.company.myexpoapp",

  // API Configuration
  API_URL: getEnvVar(
    "EXPO_PUBLIC_API_URL",
    IS_DEV ? "http://localhost:4000/api" : "https://api.myapp.com"
  ),
  API_VERSION: getEnvVar("EXPO_PUBLIC_API_VERSION", "v1"),
  API_TIMEOUT: getNumberEnvVar("EXPO_PUBLIC_API_TIMEOUT", 30000),

  // Authentication
  AUTH_TOKEN_KEY: getEnvVar("EXPO_PUBLIC_AUTH_TOKEN_KEY", "auth_token"),
  REFRESH_TOKEN_KEY: getEnvVar(
    "EXPO_PUBLIC_REFRESH_TOKEN_KEY",
    "refresh_token"
  ),
  AUTH_REDIRECT_URL: getEnvVar("EXPO_PUBLIC_AUTH_REDIRECT_URL", "myapp://auth"),

  // External Services
  GOOGLE_CLIENT_ID: getEnvVar("EXPO_PUBLIC_GOOGLE_CLIENT_ID"),
  FACEBOOK_APP_ID: getEnvVar("EXPO_PUBLIC_FACEBOOK_APP_ID"),
  SENTRY_DSN: getEnvVar("EXPO_PUBLIC_SENTRY_DSN"),
  ANALYTICS_KEY: getEnvVar("EXPO_PUBLIC_ANALYTICS_KEY"),
  STRIPE_PUBLISHABLE_KEY: getEnvVar("EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY"),

  // Storage
  STORAGE_PREFIX: getEnvVar("EXPO_PUBLIC_STORAGE_PREFIX", "myapp_"),
  CACHE_DURATION: getNumberEnvVar("EXPO_PUBLIC_CACHE_DURATION", 86400000), // 24 hours

  // Feature Flags
  ENABLE_ANALYTICS: getBooleanEnvVar("EXPO_PUBLIC_ENABLE_ANALYTICS", IS_PROD),
  ENABLE_CRASH_REPORTING: getBooleanEnvVar(
    "EXPO_PUBLIC_ENABLE_CRASH_REPORTING",
    IS_PROD
  ),
  ENABLE_DEBUG_MODE: getBooleanEnvVar("EXPO_PUBLIC_ENABLE_DEBUG_MODE", IS_DEV),
  ENABLE_DEV_TOOLS: getBooleanEnvVar("EXPO_PUBLIC_ENABLE_DEV_TOOLS", IS_DEV),

  // Development
  IS_DEV,
  IS_STAGING,
  IS_PROD,

  // Networking
  MAX_RETRY_ATTEMPTS: getNumberEnvVar("EXPO_PUBLIC_MAX_RETRY_ATTEMPTS", 3),
  REQUEST_TIMEOUT: getNumberEnvVar("EXPO_PUBLIC_REQUEST_TIMEOUT", 10000),
} as const;

// Environment-specific configurations
export const envConfig = {
  development: {
    apiUrl: "http://localhost:3000/api",
    logLevel: "debug",
    enableMocking: true,
    enableReduxDevTools: true,
  },
  staging: {
    apiUrl: "https://staging-api.myapp.com",
    logLevel: "info",
    enableMocking: false,
    enableReduxDevTools: true,
  },
  production: {
    apiUrl: "https://api.myapp.com",
    logLevel: "error",
    enableMocking: false,
    enableReduxDevTools: false,
  },
} as const;

// Get current environment config
export const getCurrentEnvConfig = () => envConfig[APP_ENV];

// Utility functions
export const isDevelopment = () => IS_DEV;
export const isStaging = () => IS_STAGING;
export const isProduction = () => IS_PROD;

// Type exports
export type { AppEnvironment, EnvConfig };
