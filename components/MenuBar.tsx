import { AntDesign } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
export function MenuBar({
  arrowLocation,
  title,
}: {
  arrowLocation: "left" | "right";
  title?: string | React.ReactNode;
}) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={arrowLocation === "left" ? () => router.back() : undefined}
      >
        <AntDesign
          name="arrowleft"
          size={24}
          style={{
            color: arrowLocation === "left" ? "white" : "transparent",
          }}
        />
      </Pressable>

      <View style={styles.textContainer}>
        {!title && <Text style={styles.text}>ReBeal.</Text>}
        {title && typeof title === "string" && (
          <Text style={styles.text}>{title}</Text>
        )}
        {title && typeof title !== "string" && title}
      </View>

      <Pressable
        onPress={
          arrowLocation === "right" ? () => router.navigate("/") : undefined
        }
      >
        <AntDesign
          name="arrowright"
          size={24}
          style={{
            color: arrowLocation === "right" ? "white" : "transparent",
          }}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "flex-start",
    position: "absolute",
    marginTop: 30,
    zIndex: 99,
    marginHorizontal: 0,
    paddingHorizontal: 20,
    backgroundColor: "#00000000",
  },
  textContainer: {
    flex: 1, // Make the title's container take up available space
    alignItems: "center", // Center the title within the container
  },

  cameraButton: {
    backgroundColor: "#00000000",
    width: 75,
    height: 75,
    borderRadius: 50,
    alignContent: "center",
    borderWidth: 5,
    borderColor: "white",
    zIndex: 99,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center", // Center each text element vertically
    color: "white",
  },
});
