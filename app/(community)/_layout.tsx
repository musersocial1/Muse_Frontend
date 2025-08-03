import { Stack } from "expo-router";
import React from "react";
import { StatusBar, StyleSheet } from "react-native";

const CommunityLayout = () => {
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
          name="create-community-startup"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  );
};

export default CommunityLayout;

const styles = StyleSheet.create({});
