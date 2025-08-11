import BottomNav from "@/components/navigations/Tab";
import { Stack } from "expo-router";
import React from "react";
import { StatusBar, View } from "react-native";

const CommunityLayout = () => {
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
        <Stack.Screen
          name="create-community-startup"
          options={{ headerShown: false }}
        />
      </Stack>

      <BottomNav />
    </View>
  );
};

export default CommunityLayout;
