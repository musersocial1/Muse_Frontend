import "dotenv/config";
import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: "muse",
  slug: "muse",
  version: "1.0.6",
  orientation: "portrait",
  icon: "./assets/images/muse-logo.png",
  scheme: "muse",
  userInterfaceStyle: "dark",
  newArchEnabled: true,

  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.moseleydev.muse",
    buildNumber: "20",
  },
  android: {
    package: "com.moseley.muse",
    versionCode: 11,
    adaptiveIcon: {
      foregroundImage: "./assets/images/muse-logo.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
    // If you need Google services, add googleServicesFile here
    // googleServicesFile: "./google-services.json",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/muse-logo.png",
  },
  plugins: [
    "expo-router",
    "expo-localization",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/muse-logo.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    "expo-font",
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: "f50076b3-5599-4012-8781-3975a632a12b",
    },
    EXPO_PUBLIC_APP_NAME: process.env.EXPO_PUBLIC_APP_NAME,
    EXPO_PUBLIC_APP_VERSION: process.env.EXPO_PUBLIC_APP_VERSION,
    EXPO_PUBLIC_APP_ENV: process.env.EXPO_PUBLIC_APP_ENV,
    EXPO_PUBLIC_APP_SCHEME: process.env.EXPO_PUBLIC_APP_SCHEME,
    EXPO_PUBLIC_BUNDLE_ID: process.env.EXPO_PUBLIC_BUNDLE_ID,

    EXPO_PUBLIC_USER_API_URL: process.env.EXPO_PUBLIC_USER_API_URL,
    EXPO_PUBLIC_POST_API_URL: process.env.EXPO_PUBLIC_POST_API_URL,
    EXPO_PUBLIC_API_VERSION: process.env.EXPO_PUBLIC_API_VERSION,
    EXPO_PUBLIC_API_TIMEOUT: Number(process.env.EXPO_PUBLIC_API_TIMEOUT),
    EXPO_PUBLIC_MAX_RETRY_ATTEMPTS: Number(
      process.env.EXPO_PUBLIC_MAX_RETRY_ATTEMPTS
    ),

    EXPO_PUBLIC_STORAGE_PREFIX: process.env.EXPO_PUBLIC_STORAGE_PREFIX,

    EXPO_PUBLIC_ENABLE_ANALYTICS:
      process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === "true",
    EXPO_PUBLIC_ENABLE_CRASH_REPORTING:
      process.env.EXPO_PUBLIC_ENABLE_CRASH_REPORTING === "true",
    EXPO_PUBLIC_ENABLE_DEBUG_MODE:
      process.env.EXPO_PUBLIC_ENABLE_DEBUG_MODE === "true",

    EXPO_PUBLIC_IS_DEV: process.env.EXPO_PUBLIC_IS_DEV === "true",
    EXPO_PUBLIC_IS_PROD: process.env.EXPO_PUBLIC_IS_PROD === "true",
    EXPO_PUBLIC_IS_STAGING: process.env.EXPO_PUBLIC_IS_STAGING === "true",

    EXPO_PUBLIC_EMAIL_LINK: process.env.EXPO_PUBLIC_EMAIL_LINK,
  },
});
