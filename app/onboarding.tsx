import { useState, useEffect, useRef, useContext } from "react";
import PushNotification from "react-native-push-notification";
import messaging, {
  firebase,
  FirebaseMessagingTypes,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import { ProfileContext } from "./_layout";
import { Text, View, Pressable, StyleSheet, Platform } from "react-native";
import { router } from "expo-router";
import firebaseConfig from "@/creds";
import { getMyProfile } from "@/sdk";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // Use the existing app if already initialized
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log(remoteMessage);
  if (remoteMessage.data?.type == "moment") {
    console.log("moments");
    PushNotification.localNotification({
      title: "⚠️ Time to be real! ⚠️",
      message:
        "You have two minutes to post and see what your friends are up to!",
      soundName: "notification.wav",
      vibrate: true,
      color: "red",
      channelId: "moments",
    });
  }
});

async function createNotificationChannel() {
  if (Platform.OS === "android") {
    // Create the notification channel with a custom sound
    PushNotification.deleteChannel("moments");
    PushNotification.createChannel(
      {
        channelId: "moments", // Required
        channelName: "ReBeal moments", // Required
        channelDescription: "It's time to post!", // (optional) default: undefined
        soundName: "notification.wav", // Sound file placed in android/app/src/main/res/raw
        importance: 4, // Importance value (0-4)
        vibrate: true, // (optional) default: true
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );
  }
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
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`FCM token retrieval failed: ${e}`);
    }
  } else {
    handleRegistrationError("Permission not granted for FCM");
  }
}

export default function Onboarding() {
  const userContext = useContext(ProfileContext);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    FirebaseMessagingTypes.RemoteMessage | undefined
  >(undefined);

  useEffect(() => {
    // Call this function during your app initialization
    createNotificationChannel();
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

    const body = {
      fcmToken: pushTokenString,
      region: (await getMyProfile(userContext)).region,
    };

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
