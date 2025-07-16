import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Search = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Muse Search</Text>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "limegreen",
    fontSize: 24,
    fontWeight: "bold",
  },
});
