/**
 * Simple environment configuration
 */

// Environment types
type AppEnvironment = "development" | "staging" | "production";

interface ServiceConfig {
  readonly baseURL: string;
  readonly timeout: number;
}

interface ServicesConfig {
  readonly user: ServiceConfig;
  readonly posts: ServiceConfig;
}

interface EnvConfig {
  // App Info
  readonly APP_NAME: string;
  readonly APP_VERSION: string;
  readonly APP_ENV: AppEnvironment;
  readonly APP_SCHEME: string;
  readonly BUNDLE_ID: string;

  // API Configuration
  readonly API_VERSION: string;
  readonly API_TIMEOUT: number;

  // Services Configuration
  readonly SERVICES: ServicesConfig;

  // Authentication
  readonly AUTH_TOKEN_KEY: string;
  readonly REFRESH_TOKEN_KEY: string;
  readonly AUTH_REDIRECT_URL: string;

  // Storage
  readonly STORAGE_PREFIX: string;

  // Feature Flags
  readonly ENABLE_CRASH_REPORTING: boolean;
  readonly ENABLE_DEBUG_MODE: boolean;

  // Development
  readonly IS_DEV: boolean;
  readonly IS_STAGING: boolean;
  readonly IS_PROD: boolean;

  // Networking
  readonly MAX_RETRY_ATTEMPTS: number;
  readonly REQUEST_TIMEOUT: number;
}

function getEnvVar(key: string, fallback: string = ""): string {
  return process.env[key] || fallback;
}

function getBooleanEnvVar(key: string, fallback: boolean = false): boolean {
  const value = process.env[key];
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true";
}

function getNumberEnvVar(key: string, fallback: number): number {
  const value = process.env[key];
  if (value === undefined) return fallback;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}

const APP_ENV = getEnvVar(
  "EXPO_PUBLIC_APP_ENV",
  "development"
) as AppEnvironment;
const IS_DEV = APP_ENV === "development";
const IS_STAGING = APP_ENV === "staging";
const IS_PROD = APP_ENV === "production";

const createServicesConfig = (): ServicesConfig => {
  const defaultTimeout = getNumberEnvVar("EXPO_PUBLIC_API_TIMEOUT", 20000);

  return {
    user: {
      baseURL: process.env.EXPO_PUBLIC_USER_API_URL || "",
      timeout: defaultTimeout,
    },
    posts: {
      baseURL: process.env.EXPO_PUBLIC_POST_API_URL || "",
      timeout: defaultTimeout,
    },
  };
};

export const env: EnvConfig = {
  // App Info
  APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || "MUSE",
  APP_VERSION: process.env.EXPO_PUBLIC_APP_VERSION || "1.0.0",
  APP_ENV,
  APP_SCHEME: process.env.EXPO_PUBLIC_APP_SCHEME || "muse",
  BUNDLE_ID: process.env.EXPO_PUBLIC_BUNDLE_ID || "com.moseleydev.muse",

  // API Configuration
  API_VERSION: process.env.EXPO_PUBLIC_API_VERSION || "v1",
  API_TIMEOUT: getNumberEnvVar("EXPO_PUBLIC_API_TIMEOUT", 20000),

  // Services Configuration
  SERVICES: createServicesConfig(),

  // Authentication
  AUTH_TOKEN_KEY: process.env.EXPO_PUBLIC_AUTH_TOKEN_KEY || "auth_token",
  REFRESH_TOKEN_KEY:
    process.env.EXPO_PUBLIC_REFRESH_TOKEN_KEY || "refresh_token",
  AUTH_REDIRECT_URL: process.env.EXPO_PUBLIC_AUTH_REDIRECT_URL || "muse://auth",

  // Storage
  STORAGE_PREFIX: process.env.EXPO_PUBLIC_STORAGE_PREFIX || "muse_",

  // Feature Flags
  ENABLE_CRASH_REPORTING: getBooleanEnvVar(
    "EXPO_PUBLIC_ENABLE_CRASH_REPORTING",
    false
  ),
  ENABLE_DEBUG_MODE: getBooleanEnvVar("EXPO_PUBLIC_ENABLE_DEBUG_MODE", true),

  // Development
  IS_DEV: getBooleanEnvVar("EXPO_PUBLIC_IS_DEV", IS_DEV),
  IS_STAGING: getBooleanEnvVar("EXPO_PUBLIC_IS_STAGING", IS_STAGING),
  IS_PROD: getBooleanEnvVar("EXPO_PUBLIC_IS_PROD", IS_PROD),

  // Networking
  MAX_RETRY_ATTEMPTS: getNumberEnvVar("EXPO_PUBLIC_MAX_RETRY_ATTEMPTS", 5),
  REQUEST_TIMEOUT: getNumberEnvVar("EXPO_PUBLIC_REQUEST_TIMEOUT", 10000),
} as const;

// Export services config for easy access
export const SERVICES_CONFIG = env.SERVICES;

// Type exports
export type { AppEnvironment, EnvConfig, ServiceConfig, ServicesConfig };
