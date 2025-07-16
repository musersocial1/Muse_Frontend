import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Group = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Group</Text>
    </View>
  );
};

export default Group;

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
