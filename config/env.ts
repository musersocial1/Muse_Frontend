import Constants from "expo-constants";

/**
 * Simple environment configuration using Expo Constants
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
  readonly community: ServiceConfig;
  readonly discover: ServiceConfig;
  readonly ai: ServiceConfig;
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

/**
 * Get environment variable from Expo Constants
 * Falls back to process.env for development, then to fallback
 */
function getEnvVar(key: string, fallback: string = ""): string {
  return (
    Constants.expoConfig?.extra?.[key] ||
    Constants.expoConfig?.extra?.[key] ||
    process.env[key] ||
    fallback
  );
}

/**
 * Get boolean environment variable from Expo Constants
 */
function getBooleanEnvVar(key: string, fallback: boolean = false): boolean {
  const value =
    Constants.expoConfig?.extra?.[key] ||
    Constants.expoConfig?.extra?.[key] ||
    process.env[key];

  if (value === undefined) return fallback;

  // Handle both boolean and string values
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";

  return fallback;
}

/**
 * Get number environment variable from Expo Constants
 */
function getNumberEnvVar(key: string, fallback: number): number {
  const value =
    Constants.expoConfig?.extra?.[key] ||
    Constants.expoConfig?.extra?.[key] ||
    process.env[key];

  if (value === undefined) return fallback;

  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? fallback : parsed;
  }

  return fallback;
}

const APP_ENV = getEnvVar(
  "EXPO_PUBLIC_APP_ENV",
  "development"
) as AppEnvironment;
const IS_DEV = APP_ENV === "development";
const IS_STAGING = APP_ENV === "staging";
const IS_PROD = APP_ENV === "production";

/**
 * Create services configuration using Expo Constants
 */
const createServicesConfig = (): ServicesConfig => {
  const defaultTimeout = getNumberEnvVar("EXPO_PUBLIC_API_TIMEOUT", 20000);

  return {
    user: {
      // baseURL: getEnvVar("EXPO_PUBLIC_USER_API_URL", ""),
      // baseURL: "https://user.muuse.app",
      baseURL:
        "http://muse-user-env.eba-bhi9vaxq.us-east-1.elasticbeanstalk.com",
      timeout: defaultTimeout,
    },
    posts: {
      // baseURL: getEnvVar("EXPO_PUBLIC_POST_API_URL", ""),
      // baseURL: "https://post.muuse.app",
      baseURL:
        "http://muse-post-env.eba-xq7rpcia.us-east-1.elasticbeanstalk.com",
      timeout: defaultTimeout,
    },
    community: {
      // baseURL: getEnvVar("EXPO_PUBLIC_COMMUNITY_API_URL", ""),
      // baseURL: " https://community.muuse.app",
      baseURL:
        "http://muse-community-env.eba-2233emrd.us-east-1.elasticbeanstalk.com",
      timeout: defaultTimeout,
    },
    discover: {
      // baseURL: getEnvVar("EXPO_PUBLIC_DISCOVER_API_URL", ""),
      // baseURL: "https://discover.muuse.app",
      baseURL:
        "http://muse-discover-env.eba-cs9wiefg.us-east-1.elasticbeanstalk.com",
      timeout: defaultTimeout,
    },
    ai: {
      // baseURL: getEnvVar("EXPO_PUBLIC_AI_API_URL", ""),
      // baseURL: "https://ai.muuse.app",
      baseURL: "http://muse-ai-env.eba-tt7y3tjd.us-east-1.elasticbeanstalk.com",
      timeout: defaultTimeout,
    },
  };
};

/**
 * Main environment configuration object
 * All values are now sourced from Expo Constants
 */
export const env: EnvConfig = {
  // App Info
  APP_NAME: "MUSE",
  APP_VERSION: "1.0.6",
  APP_ENV,
  APP_SCHEME: "MUSE",
  BUNDLE_ID: "com.moseleydev.muse",

  // API Configuration
  API_VERSION: "v1",
  API_TIMEOUT: 20000,

  // Services Configuration
  SERVICES: createServicesConfig(),

  // Authentication
  AUTH_TOKEN_KEY: "auth_token",
  REFRESH_TOKEN_KEY: "refresh_token",
  AUTH_REDIRECT_URL: "muse://auth",

  // Storage
  STORAGE_PREFIX: "muse_",

  // Feature Flags
  ENABLE_CRASH_REPORTING: false,
  ENABLE_DEBUG_MODE: getBooleanEnvVar("EXPO_PUBLIC_ENABLE_DEBUG_MODE", true),

  // Development flags
  IS_DEV: false,
  IS_STAGING: false,
  IS_PROD: true,

  // Networking
  MAX_RETRY_ATTEMPTS: 5,
  REQUEST_TIMEOUT: 20000,
} as const;

// Export services config
export const SERVICES_CONFIG = env.SERVICES;

// Type exports
export type { AppEnvironment, EnvConfig, ServiceConfig, ServicesConfig };

// Debug helper - not included in production
if (__DEV__) {
  console.log("Environment Configuration Loaded:", {
    APP_ENV: env.APP_ENV,
    IS_PROD: env.IS_PROD,
    USER_API_URL: env.SERVICES.user.baseURL,
    AVAILABLE_CONSTANTS: Object.keys(Constants.expoConfig?.extra || {}),
  });
}
