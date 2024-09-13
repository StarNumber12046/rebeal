import {
  Button,
  Pressable,
  SectionListComponent,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useContext, useState } from "react";
import { mapPrefixToFlag } from "@/phoneNumber";
import { getCountryFlagEmojiFromCountryCode } from "country-codes-flags-phone-codes";
import { TopBar } from "@/components/TopBar";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProfileContext } from "./_layout";

function s(...objs: any[]) {
  return objs.reduce((a, b) => {
    for (let k in b) {
      if (b.hasOwnProperty(k)) a[k] = (a[k] || 0) + b[k];
    }
    return a;
  }, {});
}

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [flag, setFlag] = useState("🏳️");
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState("");

  const context = useContext(ProfileContext);
  async function trySendOTP() {
    const receiptResponse = await fetch(
      "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyClient?key=AIzaSyCgNTZt6gzPMh-2voYXOvrt_UR_gpGl83Q",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "*/*",
          "x-client-version": "iOS/FirebaseSDK/9.6.0/FirebaseCore-iOS",
          "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
          "accept-language": "en",
          "user-agent":
            "FirebaseAuth.iOS/9.6.0 AlexisBarreyat.BeReal/0.31.0 iPhone/14.7.1 hw/iPhone9_1",
          "x-firebase-locale": "en",
          "x-firebase-gmpid": "1:405768487586:ios:28c4df089ca92b89",
        },
        body: JSON.stringify({
          appToken:
            "54F80A258C35A916B38A3AD83CA5DDD48A44BFE2461F90831E0F97EBA4BB2EC7",
        }),
      }
    );
    if (!receiptResponse.ok) {
      console.log("Error sending OTP");
      setError(
        "Error generating receipt: " +
          JSON.stringify(await receiptResponse.json(), null, 0)
      );
      return;
    }

    const { receipt } = (await receiptResponse.json()) as {
      receipt: string;
    };

    const otpResponse = await fetch(
      "https://www.googleapis.com/identitytoolkit/v3/relyingparty/sendVerificationCode?key=AIzaSyCgNTZt6gzPMh-2voYXOvrt_UR_gpGl83Q",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "*/*",
          "x-client-version": "iOS/FirebaseSDK/9.6.0/FirebaseCore-iOS",
          "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
          "accept-language": "en",
          "user-agent":
            "FirebaseAuth.iOS/9.6.0 AlexisBarreyat.BeReal/0.31.0 iPhone/14.7.1 hw/iPhone9_1",
          "x-firebase-locale": "en",
          "x-firebase-gmpid": "1:405768487586:ios:28c4df089ca92b89",
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          iosReceipt: receipt,
        }),
      }
    );
    if (!otpResponse.ok) {
      console.log("Error generating OTP " + (await otpResponse.text()));
      setError(
        "Error generating OTP: " +
          JSON.stringify(await otpResponse.json(), null, 0)
      );
      return;
    }
    const { sessionInfo } = (await otpResponse.json()) as {
      sessionInfo: string;
    };

    await AsyncStorage.setItem("sessionInfo", sessionInfo);
    await AsyncStorage.setItem("phoneNumber", phoneNumber);
    context.setSessionInfo(sessionInfo);
    router.push("/code");
  }

  function handleChange(event: any) {
    const phoneNumber = event.nativeEvent.text;
    const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber, "IT");
    setPhoneNumber(phoneNumber);
    console.log(parsedPhoneNumber?.country);
    setEnabled(!!parsedPhoneNumber);
    setFlag(
      parsedPhoneNumber?.country
        ? getCountryFlagEmojiFromCountryCode(
            parsedPhoneNumber?.country ?? ""
          ) ?? "🏳️"
        : "🏳️"
    );
  }
  return (
    <View style={styles.mainContainer}>
      <TopBar small />
      <Text style={styles.topText}>
        Login to your account using your phone number
      </Text>
      <View style={styles.container}>
        <Text style={styles.title}>{flag}</Text>
        <TextInput
          style={styles.input}
          placeholder="Your phone"
          placeholderTextColor={"#ffffff50"}
          onChange={handleChange}
        ></TextInput>
      </View>
      <Text style={styles.topText}>
        Not working? Try <Link href="/tokenLogin">Token Login</Link>
      </Text>
      <Text>{error}</Text>
      <Pressable
        style={styles.buttonContainer}
        onPress={trySendOTP}
        disabled={!enabled}
      >
        <Text style={styles.button}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    bottom: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  error: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    position: "absolute",
    bottom: 80,
    backgroundColor: "red",
  },
  topText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    paddingHorizontal: 60,
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
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  input: {
    minWidth: 200,
    fontWeight: "bold",
    color: "white",
    fontSize: 32,
    textAlign: "center",
  },
});
