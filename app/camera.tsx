import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { Buffer } from "buffer";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  CameraPictureOptions,
} from "expo-camera";
import { useRef, useState } from "react";
import { CaptureButton } from "@/components/CameraButton";
import { finalizeUpload, generateUploadUrl } from "@/sdk";
import getHeaders from "happy-headers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [cameraReady, setCameraReady] = useState(false);
  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function takePicture() {
    const authToken = await AsyncStorage.getItem("authToken");
    if (ref.current) {
      const options: CameraPictureOptions = {
        quality: 0.5,
        base64: true,
        exif: false,
      };
      console.log("Taking primary picture");
      const primary = await ref.current.takePictureAsync(options);
      console.log("P: " + primary?.uri);
      toggleCameraFacing();
      await sleep(5000);
      console.log("Taking secondary picture");
      const secondary = await ref.current?.takePictureAsync(options);
      console.log("S: " + secondary?.uri);
      toggleCameraFacing();
      const webpPrimary = await manipulateAsync(primary?.uri ?? "", [], {
        format: SaveFormat.WEBP,
        base64: true,
      });
      const webpSecondary = await manipulateAsync(secondary?.uri ?? "", [], {
        format: SaveFormat.WEBP,
        base64: true,
      });
      console.log("WebP: " + webpPrimary?.uri);
      console.log("WebP: " + webpSecondary?.uri);
      const uploads = await generateUploadUrl();
      const primaryUpload = uploads[0];
      const secondaryUpload = uploads[1];
      const primaryHeaders = primaryUpload.headers;
      const secondaryHeaders = secondaryUpload.headers;
      const primaryUrl = primaryUpload.url;
      const secondaryUrl = secondaryUpload.url;
      const primaryPath = primaryUpload.path;
      const primaryBucket = primaryUpload.bucket;
      const secondaryBucket = secondaryUpload.bucket;
      const secondaryPath = secondaryUpload.path;
      Object.assign(primaryHeaders, {
        Authorization: `Bearer ${authToken}`,
        ...getHeaders(),
      });
      Object.assign(secondaryHeaders, {
        Authorization: `Bearer ${authToken}`,
        ...getHeaders(),
      });
      await fetch(primaryUrl, {
        method: "PUT",
        headers: primaryHeaders,
        body: Buffer.from(primary?.base64 ?? "", "base64"),
      });
      await fetch(secondaryUrl, {
        method: "PUT",
        headers: secondaryHeaders,
        body: Buffer.from(secondary?.base64 ?? "", "base64"),
      });
      console.log("Upload stats: ");
      console.log(
        `Primary: {\n\tBucket: ${primaryBucket}\n\tPath: ${primaryPath}\n}`
      );
      console.log(
        `Secondary: {\n\tBucket: ${secondaryBucket}\n\tPath: ${secondaryPath}\n}`
      );
      const post_data = {
        isLate: false,
        retakeCounter: 0,
        takenAt: new Date().toISOString(),
        visibility: ["friends"],
        backCamera: {
          bucket: primaryBucket,
          height: 2000,
          width: 1500,
          path: primaryPath,
        },
        frontCamera: {
          bucket: secondaryBucket,
          height: 2000,
          width: 1500,
          path: secondaryPath,
        },
      };
      console.log(JSON.stringify(post_data));
      const resp = await finalizeUpload(post_data);
      console.log(resp);
      router.navigate("/");
    } else {
      console.log("Ref is null");
    }
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={ref} style={styles.camera} facing={facing} ratio="4:3">
        <View style={styles.buttonContainer}>
          <CaptureButton
            onPress={() => {
              takePicture().catch((e) => console.log(e));
            }}
          />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    bottom: 0,
    margin: 32,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
