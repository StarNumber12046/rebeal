import { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Button,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { router } from "expo-router";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      sound: "notification.wav",
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;

      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

export default function Onboarding() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function onClick() {
    const pushTokenString = await registerForPushNotificationsAsync();
    const body = { expoToken: pushTokenString, region: "europe-west" };
    const res = await fetch("https://rebeal-server.vercel.app/register", {
      // @ts-ignore
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    console.log(await res.text());
    console.log(pushTokenString);
    setExpoPushToken(pushTokenString ?? "");
    router.navigate("/");
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 25,
        paddingTop: 50,
      }}
    >
      <Text style={{ fontWeight: "bold", color: "white", fontSize: 28 }}>
        Enable notificaations
      </Text>
      <Text style={{ color: "#ffffff90", fontSize: 18 }}>
        And receive your daily dose of real life
      </Text>
      <Pressable onPress={onClick} style={styles.button}>
        <Text>Enable Notifications</Text>
      </Pressable>
      <Pressable
        onPress={() => router.navigate("/")}
        style={styles.secondaryButton}
      >
        <Text style={{ color: "white" }}>Skip</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    width: "90%",
    color: "black",
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    position: "absolute",
    padding: 15,
    bottom: 100,
    fontSize: 18,
    fontWeight: "bold",
    borderRadius: 10,
    flex: 0.1,
  },
  secondaryButton: {
    borderColor: "white",
    borderWidth: 2,
    width: "90%",
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    position: "absolute",
    padding: 15,
    fontSize: 18,
    fontWeight: "bold",
    borderRadius: 10,
    flex: 0.1,
    bottom: 30,
  },
});
