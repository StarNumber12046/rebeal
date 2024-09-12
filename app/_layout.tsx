import { LogBox } from "react-native";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { createContext, useEffect, useState } from "react";
import "react-native-reanimated";

import Home from ".";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getHeaders from "happy-headers";
import { Friends, FullUser, User } from "@/sdk";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export type ProfileContextType = {
  user: FullUser | null;
  setUser: (user: FullUser | null) => void;
  sessionInfo: string | null;
  setSessionInfo: (sessionInfo: string | null) => void;
  suggestedFriends: User[] | null;
  setSuggestedFriends: (suggestedFriends: User[] | null) => void;
  friends: Friends | null;
  setFriends: (friends: Friends | null) => void;
};

export const ProfileContext = createContext<ProfileContextType>({
  user: null,
  setUser: (user: FullUser | null) => {},
  sessionInfo: null,
  setSessionInfo: (sessionInfo: string | null) => {},
  suggestedFriends: null,
  setSuggestedFriends: (suggestedFriends: User[] | null) => {},
  friends: null,
  setFriends: (friends: Friends | null) => {},
});

async function checkToken() {
  const authToken = await AsyncStorage.getItem("authToken");
  const refreshToken = await AsyncStorage.getItem("refreshToken");
  const userResponse = await fetch(
    "https://mobile.bereal.com/api/feeds/friends-v1",
    {
      headers: {
        ...getHeaders(),
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  if (!userResponse.ok || (await userResponse.json())["_h"] == 0) {
    console.log("User seems broken");
    const data = await fetch(
      "https://auth.bereal.team/token?grant_type=refresh_token",
      {
        method: "POST",
        headers: {
          ...getHeaders(),
          "content-type": "application/json",
          accept: "*/*",
          "x-client-version": "iOS/FirebaseSDK/8.15.0/FirebaseCore-iOS",
          "x-firebase-client-log-type": "0",
          "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
          "accept-language": "en",
          "user-agent":
            "FirebaseAuth.iOS/8.15.0 AlexisBarreyat.BeReal/0.22.4 iPhone/14.7.1 hw/iPhone9_1",
        },
        body: JSON.stringify({
          client_id: "ios",
          client_secret: "962D357B-B134-4AB6-8F53-BEA2B7255420",
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
      }
    );
    const tokenResponse = await data.json();
    console.log(data);
    if (!data.ok) {
      console.log("Token seems broken");
      return null;
    }
    console.log("Token has been refreshed successfully");
    await AsyncStorage.setItem("authToken", tokenResponse.access_token);
    await AsyncStorage.setItem("refreshToken", tokenResponse.refresh_token);
    router.navigate("/profile");
    return [tokenResponse.access_token, tokenResponse.refresh_token];
  }
  return [authToken, refreshToken];
}

export default function RootLayout() {
  const [user, setUser] = useState<FullUser | null>(null);
  const [sessionInfo, setSessionInfo] = useState<string | null>(null);
  const [suggestedFriends, setSuggestedFriends] = useState<User[] | null>(null);
  const [friends, setFriends] = useState<Friends | null>(null);

  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      checkToken().then(() => SplashScreen.hideAsync());
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ProfileContext.Provider
      value={{
        user,
        setUser,
        sessionInfo,
        setSessionInfo,
        suggestedFriends,
        setSuggestedFriends,
        friends,
        setFriends,
      }}
    >
      <ThemeProvider value={DarkTheme}>
        <GestureHandlerRootView>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="profile" options={{ headerShown: false }} />
            <Stack.Screen name="friends" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="code" options={{ headerShown: false }} />
            <Stack.Screen
              name="suggestedFriends"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="user/[user]" options={{ headerShown: false }} />
          </Stack>
        </GestureHandlerRootView>
      </ThemeProvider>
    </ProfileContext.Provider>
  );
}
