import { Stack } from "expo-router";
import React from "react";
import { StatusBar, StyleSheet } from "react-native";

const AuthLayout = () => {
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
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default AuthLayout;

const styles = StyleSheet.create({});
