import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
export function MenuBar({
  arrowLocation,
  title,
}: {
  arrowLocation: "left" | "right";
  title?: string;
}) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={
          arrowLocation === "left"
            ? () => {
                router.back();
              }
            : () => {}
        }
      >
        <AntDesign
          name="arrowleft"
          size={24}
          style={{
            color: arrowLocation === "left" ? "white" : "transparent",
          }}
          color="white"
        />
      </Pressable>
      <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
        {title ?? <Text style={styles.text}>ReBeal.</Text>}
      </Text>
      <Pressable
        onPress={
          arrowLocation === "right"
            ? () => {
                router.navigate("/");
              }
            : () => {}
        }
      >
        <AntDesign
          name="arrowright"
          size={24}
          style={{
            color: arrowLocation === "right" ? "white" : "transparent",
          }}
          color="white"
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
    fontSize: 28,
    fontWeight: "bold",
    alignSelf: "center", // Center each text element vertically
    color: "white",
  },
});
