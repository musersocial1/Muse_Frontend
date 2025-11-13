import MiniCirclePlayer from "@/components/ExclusiveContent/MiniPlayer";
import AIModal from "@/components/modals/AiModal";
import MediaPlayerModal from "@/components/modals/MediaPlayer";
import FloatingAIButton from "@/components/museai/FloatingAiButton";
import AuthProvider from "@/context/AuthContext";
import { CommunityProvider } from "@/context/CommunityContext";
import { PlayerProvider, usePlayer } from "@/context/PlayerContext";
import { PostsProvider } from "@/context/PostsContext";
import { customFonts } from "@/lib/fonts";
import ScreenLongPressWrapper from "@/wrappers/ScreenLongPress";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BaseToast } from "react-native-toast-message";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import "./globals.css";

import Clarity from "@microsoft/react-native-clarity";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts(customFonts);

  // Initialize Clarity
  useEffect(() => {
    Clarity.initialize("rwsmrf44ep");
  }, []);

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded || error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {/* Mount PlayerProvider */}
            <PlayerProvider>
              <CommunityProvider>
                <PostsProvider>
                  <ScreenLongPressWrapper>
                    <RootApp />
                  </ScreenLongPressWrapper>
                </PostsProvider>

                <Toast
                  config={{
                    success: (props) => (
                      <BaseToast
                        {...props}
                        style={{
                          borderLeftColor: "#18FF037D",
                          backgroundColor: "#F3FFF6",
                        }}
                        text1Style={{ fontWeight: "bold", color: "#121212" }}
                        text2Style={{ color: "#363636" }}
                      />
                    ),
                    error: (props) => (
                      <BaseToast
                        {...props}
                        style={{
                          borderLeftColor: "#FF03037D",
                          backgroundColor: "#FFF3F3",
                        }}
                        text1Style={{ fontWeight: "bold", color: "#121212" }}
                        text2Style={{ color: "#363636" }}
                      />
                    ),
                    warning: (props) => (
                      <BaseToast
                        {...props}
                        style={{
                          borderLeftColor: "#FFA500",
                          backgroundColor: "#FFF8E1",
                        }}
                        text1Style={{ fontWeight: "bold", color: "#121212" }}
                        text2Style={{ color: "#363636" }}
                      />
                    ),
                    info: (props) => (
                      <BaseToast
                        {...props}
                        style={{
                          borderLeftColor: "#0368FF",
                          backgroundColor: "#F3F7FF",
                        }}
                        text1Style={{ fontWeight: "bold", color: "#121212" }}
                        text2Style={{ color: "#363636" }}
                      />
                    ),
                  }}
                />
              </CommunityProvider>
            </PlayerProvider>
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootApp() {
  const [showAIModal, setShowAIModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  const { setShowModalVideo, setShowMini, currentTrack } = usePlayer();

  const openPlayer = () => {
    setShowPlayerModal(true);
    setShowMini(false);
    setShowModalVideo?.(true);
  };

  const closePlayer = () => {
    setShowPlayerModal(false);
    setShowModalVideo?.(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#121212" }}>
      <FloatingAIButton setShowAIModal={setShowAIModal} />
      <AIModal showAIModal={showAIModal} setShowAIModal={setShowAIModal} />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(profile)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="(discover)" options={{ headerShown: false }} /> */}
        <Stack.Screen name="(community)" options={{ headerShown: false }} />
        <Stack.Screen name="(museai)" options={{ headerShown: false }} />
        <Stack.Screen name="(posts)" options={{ headerShown: false }} />
      </Stack>

      <MiniCirclePlayer onPress={openPlayer} />

      <MediaPlayerModal
        isVisible={showPlayerModal}
        onClose={closePlayer}
        title={currentTrack?.title || "Now playing"}
        author={currentTrack?.artist || ""}
        duration={currentTrack?.duration || 0}
        videoUrl={currentTrack?.url}
        thumbnail={undefined}
      />
    </View>
  );
}
