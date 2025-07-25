// app.config.ts
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
  },
  android: {
    package: "com.moseley.muse", // This is the Play Store package name
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
  },
});
