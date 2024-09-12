import { Link } from "expo-router";
import { Pressable, View, StyleSheet, TouchableOpacity } from "react-native";

export function CameraButton({ shown }: { shown: boolean }) {
  return (
    <View style={[styles.container, { opacity: shown ? 1 : 0 }]}>
      <Link href="/camera">
        <View style={styles.cameraButton} />
      </Link>
    </View>
  );
}

export function CaptureButton({ onPress }: { onPress: () => void }) {
  return (
    <View
      style={{
        bottom: 20,
        alignSelf: "flex-end",
        flex: 1,
        width: "100%",
        justifyContent: "center",
      }}
    >
      <TouchableOpacity
        style={{ justifyContent: "center", flexDirection: "row" }}
        onPress={() => {
          console.log("Called");
          onPress();
        }}
      >
        <View style={styles.cameraButton} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    bottom: 100,
    alignContent: "center",
    alignSelf: "center",
    position: "absolute",
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
});
