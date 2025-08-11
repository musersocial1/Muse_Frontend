import { Stack } from "expo-router";
import React from "react";
import { StatusBar, View } from "react-native";

const MuseaiLayout = () => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        hidden={false}
        barStyle="light-content"
        backgroundColor="#121212"
        showHideTransition="fade"
      />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="community-chat" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
};

export default MuseaiLayout;
