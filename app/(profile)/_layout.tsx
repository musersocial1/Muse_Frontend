import { Stack } from "expo-router";
import React from "react";
import { StatusBar, StyleSheet } from "react-native";

const ProfileLayout = () => {
  return (
    <>
      <StatusBar
        hidden={false}
        barStyle="light-content"
        showHideTransition="fade"
      />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="change-email" options={{ headerShown: false }} />
        <Stack.Screen name="change-username" options={{ headerShown: false }} />
        <Stack.Screen
          name="user-communities"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="change-password" options={{ headerShown: false }} />
        <Stack.Screen name="helpdesk" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="tags" options={{ headerShown: false }} />
        <Stack.Screen name="privacy" options={{ headerShown: false }} />
        <Stack.Screen name="termsofuse" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default ProfileLayout;

const styles = StyleSheet.create({});
