import { AuthProvider } from "@/context/AuthContext";
import { customFonts } from "@/lib/fonts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
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
          {/* <StatusBar
            hidden={false}
            barStyle="light-content"
            backgroundColor="#121212" // <-- add this line!
            showHideTransition="fade"
          /> */}
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

          {/* <StatusBar style="auto" /> */}
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
