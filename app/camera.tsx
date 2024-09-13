import {
  ActivityIndicator,
  ActivityIndicatorBase,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { Buffer } from "buffer";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  CameraPictureOptions,
} from "expo-camera";
import { useContext, useRef, useState } from "react";
import { CaptureButton } from "@/components/CameraButton";
import { finalizeUpload, generateUploadUrl } from "@/sdk";
import getHeaders from "happy-headers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ProfileContext } from "./_layout";

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [workInProgress, setWorkInProgress] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function takePicture() {
    const authToken = await AsyncStorage.getItem("authToken");
    console.log("async takePicture() -> Promise<void>");
    if (ref.current) {
      console.log("Taking picture");
      const options: CameraPictureOptions = {
        quality: 0.5,
        base64: true,
        exif: false,
      };
      setWorkInProgress(true);
      setStatus("Taking primary picture");
      const primary = await ref.current.takePictureAsync(options);
      console.log("P: " + primary?.uri);
      toggleCameraFacing();
      await sleep(500);
      setStatus("Taking secondary picture");
      const secondary = await ref.current?.takePictureAsync(options);
      console.log("S: " + secondary?.uri);
      setStatus("Converting images");
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
      setStatus("Generating upload urls");
      const uploads = await generateUploadUrl().catch((e) => {
        setError(e.message);
        return;
      });
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
      setStatus("Uploading images 1/2");
      await fetch(primaryUrl, {
        method: "PUT",
        headers: primaryHeaders,
        body: Buffer.from(primary?.base64 ?? "", "base64"),
      }).catch((e) => {
        setError(e.message);
        return;
      });
      setStatus("Uploading images 2/2");
      await fetch(secondaryUrl, {
        method: "PUT",
        headers: secondaryHeaders,
        body: Buffer.from(secondary?.base64 ?? "", "base64"),
      }).catch((e) => {
        setError(e.message);
        return;
      });
      console.log("Upload stats: ");
      console.log(
        `Primary: {\n\tBucket: ${primaryBucket}\n\tPath: ${primaryPath}\n}`
      );
      console.log(
        `Secondary: {\n\tBucket: ${secondaryBucket}\n\tPath: ${secondaryPath}\n}`
      );
      setStatus("Finalizing upload");
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
      if (!resp.ok) {
        console.log("Error finalizing upload");
        setError(resp.statusText);
      }
      setWorkInProgress(false);
      setStatus("");
      setError("");
      router.navigate("/");
    } else {
      setError("Ref is null");
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
      <View
        style={[
          styles.statusContainer,
          { opacity: workInProgress ? 1 : 0, zIndex: workInProgress ? 100 : 0 },
        ]}
      >
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.status}>{status}</Text>
        <Text style={styles.error}>{error}</Text>
      </View>
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
  statusContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    flexDirection: "column",
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  status: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  error: {
    fontSize: 24,
    fontWeight: "bold",
    color: "red",
  },
});
