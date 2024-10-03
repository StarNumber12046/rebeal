import { ProfileContext, ProfileContextType } from "@/app/_layout";
import { getMyProfile } from "@/sdk";
import { MaterialIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import getHeaders from "happy-headers";
import { useContext, useEffect, useState } from "react";
import { View, Pressable, Text, Image, StyleSheet } from "react-native";
import React from "react";
export const TopBar = ({
  small = false,
  action = () => {
    router.navigate("/");
  },
}: {
  small?: boolean;
  action?: () => void;
}) => {
  const userContext = useContext(ProfileContext);
  const [profilePicture, setProfilePicture] =
    useState<string>("rebeal://profile");
  useEffect(() => {
    console.log("Getting profile picture");
    getMyProfile(userContext)
      .then((profilePicture) => {
        console.log("Profile picture fetched");
        setProfilePicture(
          profilePicture.profilePicture.url ?? "rebeal://profile"
        );
      })
      .catch((e) => console.log(e));
  }, [userContext]);
  return (
    <View style={small ? styles.smallTopbar : styles.topbar}>
      {!small && (
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            width: 80,
          }}
        >
          <Link href="/friends" asChild>
            <MaterialIcons name="people" size={24} color="white" />
          </Link>
          <Link href="/gridView" asChild>
            <MaterialIcons name="grid-view" size={24} color="white" />
          </Link>
        </View>
      )}
      <Pressable onPress={() => action()}>
        <Text style={styles.text}>ReBeal.</Text>
      </Pressable>
      {!small && (
        <Link
          href="/profile"
          style={{ width: 80, flexDirection: "row-reverse" }}
          asChild
        >
          <Pressable>
            <Text style={styles.streakText}>🔥</Text>
            <Image
              source={{
                uri: profilePicture ?? "rebeal://profile",
                width: 32,
                height: 32,
              }}
              style={styles.profileIcon}
            />
          </Pressable>
        </Link>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  topbar: {
    backgroundColor: "#00000000",
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingHorizontal: 15,
    position: "static",
    zIndex: 99,
    color: "white",
    height: 60, // Set a fixed height for the top bar
    width: "100%", // Make the top bar fill the entire width of the screen
  },
  smallTopbar: {
    backgroundColor: "#00000000",
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 20,
    paddingHorizontal: 15,
    position: "static",
    zIndex: 99,
    color: "white",
    height: 60, // Set a fixed height for the top bar
    width: "100%", // Make the top bar fill the entire width of the screen
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    alignSelf: "center", // Center each text element vertically
    color: "white",
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 50,
  },
  streakText: {
    fontSize: 12,
    color: "white",
    alignSelf: "center",
    position: "absolute",
    top: -10,
    right: -10,
    padding: 3,
    backgroundColor: "black",
    borderRadius: 50,
    zIndex: 99,
  },
});
