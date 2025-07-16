import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Community = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Community</Text>
    </View>
  );
};

export default Community;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // black
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "limegreen",
    fontSize: 24,
    fontWeight: "bold",
  },
});
