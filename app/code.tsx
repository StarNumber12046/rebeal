import { TopBar } from "@/components/TopBar";
import { Link, router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";
import { ProfileContext } from "./_layout";
import getHeaders from "happy-headers";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OTPScreen() {
  const [otp, setOTP] = useState("");
  const context = useContext(ProfileContext);
  const [error, setError] = useState("");
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (otp.length === 6) {
      setEnabled(true);
    }
  }, [otp]);

  async function verify() {
    const fireResponse = await fetch(
      "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPhoneNumber?key=AIzaSyCgNTZt6gzPMh-2voYXOvrt_UR_gpGl83Q",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-firebase-client":
            "apple-platform/ios apple-sdk/19F64 appstore/true deploy/cocoapods device/iPhone9,1 fire-abt/8.15.0 fire-analytics/8.15.0 fire-auth/8.15.0 fire-db/8.15.0 fire-dl/8.15.0 fire-fcm/8.15.0 fire-fiam/8.15.0 fire-fst/8.15.0 fire-fun/8.15.0 fire-install/8.15.0 fire-ios/8.15.0 fire-perf/8.15.0 fire-rc/8.15.0 fire-str/8.15.0 firebase-crashlytics/8.15.0 os-version/14.7.1 xcode/13F100",
          accept: "*/*",
          "x-client-version": "iOS/FirebaseSDK/8.15.0/FirebaseCore-iOS",
          "x-firebase-client-log-type": "0",
          "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
          "accept-language": "en",
          "user-agent":
            "FirebaseAuth.iOS/8.15.0 AlexisBarreyat.BeReal/0.22.4 iPhone/14.7.1 hw/iPhone9_1",
          "x-firebase-locale": "en",
        },
        body: JSON.stringify({
          code: otp,
          sessionInfo: context.sessionInfo,
          operation: "SIGN_UP_OR_IN",
        }),
      }
    );
    if (!fireResponse.ok) {
      setError(
        "Error verifying OTP: " +
          JSON.stringify(await fireResponse.json(), null, 0)
      );
      return;
    }

    const { refreshToken, isNewUser, localId } =
      (await fireResponse.json()) as {
        refreshToken?: string;
        isNewUser?: boolean;
        localId?: string;
      };
    if (!refreshToken || !localId) {
      return new Response(
        JSON.stringify({
          error: "Missing refreshToken or localId",
        }),
        { status: 400 }
      );
    }

    const tokenResponse = await fetch(
      "https://securetoken.googleapis.com/v1/token?key=AIzaSyCgNTZt6gzPMh-2voYXOvrt_UR_gpGl83Q",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "*/*",
          "x-client-version": "iOS/FirebaseSDK/8.15.0/FirebaseCore-iOS",
          "x-firebase-client-log-type": "0",
          "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
          "accept-language": "en",
          "user-agent":
            "FirebaseAuth.iOS/8.15.0 AlexisBarreyat.BeReal/0.22.4 iPhone/14.7.1 hw/iPhone9_1",
          "x-firebase-locale": "en",
        },
        body: JSON.stringify({
          refreshToken,
          grantType: "refresh_token",
        }),
      }
    );

    if (!tokenResponse.ok) {
      setError(
        "Error refreshing token: " +
          JSON.stringify(await tokenResponse.json(), null, 0)
      );
      return;
    }
    const { id_token: idToken } = (await tokenResponse.json()) as {
      id_token?: string;
    };
    if (!idToken) {
      setError("Error refreshing token: Missing id_token");
      return;
    }
    const grantResponse = await fetch(
      "https://auth.bereal.team/token?grant_type=firebase",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "*/*",
          "x-client-version": "iOS/FirebaseSDK/8.15.0/FirebaseCore-iOS",
          "x-firebase-client-log-type": "0",
          "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
          "accept-language": "en",
          "user-agent":
            "FirebaseAuth.iOS/8.15.0 AlexisBarreyat.BeReal/0.22.4 iPhone/14.7.1 hw/iPhone9_1",
          "x-firebase-locale": "en",
          ...getHeaders(),
        },
        body: JSON.stringify({
          grant_type: "firebase",
          client_id: "ios",
          client_secret: "962D357B-B134-4AB6-8F53-BEA2B7255420",
          token: idToken,
        }),
      }
    );
    if (!grantResponse.ok) {
      setError(
        "Error refreshing token: " +
          JSON.stringify(await grantResponse.json(), null, 0)
      );
      return;
    }

    const { access_token, refresh_token, token_type, expires_in } =
      (await grantResponse.json()) as {
        access_token: string;
        refresh_token: string;
        token_type: string;
        expires_in: number;
      };
    if (!access_token || !refresh_token || !token_type || !expires_in) {
      setError("Error refreshing token: Missing access_token");
      return;
    }

    await AsyncStorage.setItem("authToken", access_token);
    await AsyncStorage.setItem("refreshToken", refresh_token);
    await AsyncStorage.setItem("expirationDate", expires_in.toString());
    router.push("/onboarding");
  }

  return (
    <View style={styles.mainContainer}>
      <TopBar small />
      <Text style={styles.topText}>
        A OTP has been sent to your phone number. Please enter it below to
        verify
      </Text>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="OTP"
          placeholderTextColor={"#ffffff50"}
          onChange={(e) => {
            setOTP(e.nativeEvent.text);
          }}
        ></TextInput>
      </View>
      <Text>
        Not working? Try <Link href="/tokenLogin">Token Login</Link>
      </Text>
      <Text style={styles.error}>{error}</Text>
      <Pressable
        disabled={!enabled}
        style={styles.buttonContainer}
        onPress={verify}
      >
        <Text style={styles.button}>Verify</Text>
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
  topText: {
    fontSize: 18,
    color: "#ffffff",
    textAlign: "center",
    paddingHorizontal: 60,
    fontFamily: "Inter_500Medium",
  },
  error: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    bottom: 80,
    fontFamily: "Inter_500Medium",
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
    fontFamily: "Inter_700Medium",
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "black",
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
    fontFamily: "Inter_700Medium",
  },
  input: {
    minWidth: 200,
    fontWeight: "bold",
    color: "white",
    fontSize: 32,
    textAlign: "center",
    fontFamily: "Inter_700Medium",
  },
});
