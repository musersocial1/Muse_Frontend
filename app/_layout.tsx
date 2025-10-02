import AIModal from "@/components/modals/AiModal";
import FloatingAIButton from "@/components/museai/FloatingAiButton";
import AuthProvider from "@/context/AuthContext";
import { customFonts } from "@/lib/fonts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { View } from "react-native";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BaseToast } from "react-native-toast-message";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import "./globals.css";
import { registerRootComponent } from "expo";
import TrackPlayer from "react-native-track-player";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts(customFonts);

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  const [showAIModal, setShowAIModal] = useState(false);
  const [fontError] = useFonts(customFonts);

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);
  if (!fontsLoaded || error) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <View style={{ flex: 1, backgroundColor: "#121212" }}>
              <FloatingAIButton setShowAIModal={setShowAIModal} />
              <AIModal
                showAIModal={showAIModal}
                setShowAIModal={setShowAIModal}
              />
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="(profile)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="(discover)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="(community)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="(museai)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="(posts)" options={{ headerShown: false }} />
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
    </GestureHandlerRootView>
  );
}
