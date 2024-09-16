import { useState, useEffect, useRef } from "react";
import messaging, {
  firebase,
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { Text, View, Pressable, StyleSheet } from "react-native";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import firebaseConfig from "@/creds";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // Use the existing app if already initialized
}
// Initialize Firebase only if it's not initialized

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

// Request user permission and get FCM token
async function registerForPushNotificationsAsync() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);

    try {
      const pushTokenString = await messaging().getToken();
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`FCM token retrieval failed: ${e}`);
    }
  } else {
    handleRegistrationError("Permission not granted for FCM");
  }
}

export default function Onboarding() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    FirebaseMessagingTypes.RemoteMessage | undefined
  >(undefined);

  useEffect(() => {
    const unsubscribeOnMessage = messaging().onMessage(
      async (remoteMessage) => {
        setNotification(remoteMessage);
        console.log(
          "A new FCM message arrived!",
          JSON.stringify(remoteMessage)
        );
      }
    );

    const unsubscribeOnNotificationOpenedApp =
      messaging().onNotificationOpenedApp((remoteMessage) => {
        console.log(
          "Notification caused app to open from background state:",
          remoteMessage
        );
      });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage
          );
        }
      });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpenedApp();
    };
  }, []);

  async function onClick() {
    const pushTokenString = await registerForPushNotificationsAsync();
    const body = { fcmToken: pushTokenString, region: "europe-west" };

    const res = await fetch("https://rebeal-server.vercel.app/register", {
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    console.log(await res.text());
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
        Enable notifications
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
    justifyContent: "center",
    alignItems: "center",
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
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    padding: 15,
    fontSize: 18,
    fontWeight: "bold",
    borderRadius: 10,
    flex: 0.1,
    bottom: 30,
  },
});
