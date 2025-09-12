import { Stack } from "expo-router";
import React from "react";
import { StatusBar, View } from "react-native";

const PostLayout = () => {
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
        <Stack.Screen name="video-reply" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
};

export default PostLayout;
