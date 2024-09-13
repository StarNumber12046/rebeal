import { Href, router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function DeveloperScreen() {
  const [route, setRoute] = React.useState<string>("");
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dev</Text>
      <Text style={styles.h2}>Go to route</Text>
      <TextInput
        value={route}
        onChange={(e) => setRoute(e.nativeEvent.text)}
        placeholder="Route"
        style={styles.smallText}
        placeholderTextColor={"#ffffff85"}
      />
      <Pressable onPress={() => router.push(route as Href<string>)}>
        <Text style={styles.smallText}>Go</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  smallText: {
    fontSize: 12,
    color: "white",
  },
  h2: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
