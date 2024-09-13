import { TopBar } from "@/components/TopBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { TextInput } from "react-native-gesture-handler";
export default function TokenLogin() {
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  async function login() {
    AsyncStorage.setItem("authToken", accessToken);
    AsyncStorage.setItem("refreshToken", refreshToken);
    router.push("/");
  }
  const [error, setError] = useState<string>("");
  return (
    <View style={styles.container}>
      <TopBar small />
      <Text style={styles.text}>Token login</Text>
      <TextInput
        value={accessToken}
        onChange={(e) => setAccessToken(e.nativeEvent.text)}
        placeholder="Access Token"
        style={styles.text}
        placeholderTextColor={"#ffffff85"}
      />
      <TextInput
        value={refreshToken}
        onChange={(e) => setRefreshToken(e.nativeEvent.text)}
        placeholder="Refresh Token"
        style={styles.text}
        placeholderTextColor={"#ffffff85"}
      />
      <Text style={styles.error}>{error}</Text>
      <Pressable onPress={login} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
  },
  buttonText: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "bold",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  error: {
    fontSize: 12,
    color: "red",
  },
  button: {
    backgroundColor: "white",
    width: "90%",
    color: "black",
    textAlign: "center",
    position: "absolute",
    padding: 15,
    fontSize: 18,
    fontWeight: "bold",
    borderRadius: 10,
    flex: 0.1,
    bottom: 30,
    alignItems: "center",
  },
});
