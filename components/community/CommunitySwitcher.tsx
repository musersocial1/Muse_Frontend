import { StyleSheet, Text, View } from "react-native";

export default function CommunitySwitcher() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🌍 Community Switcher</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  text: { color: "#fff", fontSize: 22, fontWeight: "600" },
});
