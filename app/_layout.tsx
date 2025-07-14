import { AuthProvider } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

// import { customFonts } from "@/lib/fonts";
import { StatusBar } from "react-native";
import "./globals.css";

const queryClient = new QueryClient();

export default function RootLayout() {
  // const [fontsLoaded] = useFonts(customFonts);

  // if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar hidden={true} />
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          </Stack>
          {/* <StatusBar style="auto" /> */}
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
