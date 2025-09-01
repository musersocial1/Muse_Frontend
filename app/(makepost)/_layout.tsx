import { Stack } from "expo-router";
import React from "react";
import { StatusBar, StyleSheet } from "react-native";

const DiscoverLayout = () => {
  return (
    <>
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
          name="create-post-startup"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  );
};

export default DiscoverLayout;

const styles = StyleSheet.create({});
