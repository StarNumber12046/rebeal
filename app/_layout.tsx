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
import { checkToken, Friends, FullUser, User } from "@/sdk";

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
      checkToken().then((out) => {
        SplashScreen.hideAsync();
        if (out && out[0]) router.push("/");
      });
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
            <Stack.Screen name="camera" options={{ headerShown: false }} />
            <Stack.Screen name="user/[user]" options={{ headerShown: false }} />
            <Stack.Screen name="dev" options={{ headerShown: false }} />
            <Stack.Screen name="tokenLogin" options={{ headerShown: false }} />
          </Stack>
        </GestureHandlerRootView>
      </ThemeProvider>
    </ProfileContext.Provider>
  );
}
