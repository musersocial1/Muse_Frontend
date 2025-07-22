import AuthProvider from "@/context/AuthContext";
import { customFonts } from "@/lib/fonts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BaseToast } from "react-native-toast-message";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import "./globals.css";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts(customFonts);

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded || error) return null;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <View style={{ flex: 1, backgroundColor: "#121212" }}>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(profile)" options={{ headerShown: false }} />
              {/* <Stack.Screen name="modal" options={{ presentation: "modal" }} /> */}
            </Stack>
          </View>
          <Toast
            config={{
              success: (props) => (
                <BaseToast
                  {...props}
                  style={{
                    borderLeftColor: "#18FF037D",
                    backgroundColor: "#F3FFF6",
                  }}
                  text1Style={{
                    fontWeight: "bold",
                    color: "#121212",
                  }}
                  text2Style={{
                    color: "#363636",
                  }}
                />
              ),
              error: (props) => (
                <BaseToast
                  {...props}
                  style={{
                    borderLeftColor: "#FF03037D",
                    backgroundColor: "#FFF3F3",
                  }}
                  text1Style={{
                    fontWeight: "bold",
                    color: "#121212",
                  }}
                  text2Style={{
                    color: "#363636",
                  }}
                />
              ),
              warning: (props) => (
                <BaseToast
                  {...props}
                  style={{
                    borderLeftColor: "#FFA500",
                    backgroundColor: "#FFF8E1",
                  }}
                  text1Style={{
                    fontWeight: "bold",
                    color: "#121212",
                  }}
                  text2Style={{
                    color: "#363636",
                  }}
                />
              ),
              info: (props) => (
                <BaseToast
                  {...props}
                  style={{
                    borderLeftColor: "#0368FF",
                    backgroundColor: "#F3F7FF",
                  }}
                  text1Style={{
                    fontWeight: "bold",
                    color: "#121212",
                  }}
                  text2Style={{
                    color: "#363636",
                  }}
                />
              ),
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
