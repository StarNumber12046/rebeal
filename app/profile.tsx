import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import { TopBar } from "@/components/TopBar";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { MenuBar } from "@/components/MenuBar";
import {
  FullUser,
  getMyProfile,
  getMemories,
  getMyPins,
  PinnedMemories,
} from "@/sdk";
import { ProfileContext } from "./_layout";
import { MaterialIcons } from "@expo/vector-icons";
import { Pin } from "@/components/ReBeal";

export default function ProfileScreen() {
  const aTokenStorage = useAsyncStorage("authToken");
  const rTokenStorage = useAsyncStorage("refreshToken");
  const userContext = useContext(ProfileContext);
  const [userProfile, setUserProfile] = useState<FullUser | null>(null);
  const [pins, setPins] = useState<PinnedMemories | null>(null);
  useEffect(() => {
    console.log("Getting profile picture");

    getMyPins(userContext)
      .then((pins) => {
        console.log("Pins fetched");
        console.log(pins);
        setPins(pins);
      })
      .catch((e) => console.log(e));

    getMyProfile(userContext)
      .then((userProfile) => {
        console.log("Profile picture fetched");
        setUserProfile(userProfile);
      })
      .catch((e) => console.log(e));
  }, [userContext]);

  return (
    <View style={{ flex: 1 }}>
      <Pressable
        onPress={() => router.push("/dev")}
        style={{
          zIndex: 99,
          right: 20,
          top: 50,
          position: "absolute",
          padding: 10,
        }}
      >
        <Text style={{ color: "white", fontSize: 24 }}>
          <MaterialIcons name="developer-mode" size={24} color="white" />
        </Text>
      </Pressable>
      <View style={styles.container}>
        <MenuBar arrowLocation={"left" as "left"} title={"Profile"} />
        <Image
          source={{
            uri: userProfile?.profilePicture.url ?? "rebeal://profile.png",
            width: 130,
            height: 130,
          }}
          style={styles.profilePicture}
        />
        <Text style={styles.userName}>{userProfile?.fullname}</Text>
        <Text style={styles.userHandle}>{userProfile?.username}</Text>
        <Text style={styles.smallText}>{userProfile?.biography}</Text>
        <Text style={styles.smallText}>{userProfile?.location}</Text>
        <Text
          style={{
            fontWeight: 500,
            color: "white",
            fontSize: 18,
            marginTop: 10,
          }}
        >
          {(userProfile?.streakLength ?? 0) > 0 &&
            "🔥 " + userProfile?.streakLength}
        </Text>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontWeight: 500, color: "white", fontSize: 24 }}>
            Pins
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <MaterialIcons name="people" size={18} color="#ffffff90" />
            <Text style={styles.smallerText}>Visible to your friends</Text>
          </View>
        </View>
        <View
          style={{
            marginTop: -20,
            marginHorizontal: -10,
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-evenly",
          }}
        >
          {pins?.pinnedMemories.map((pin) => (
            <Pin
              key={pin.id}
              primaryUrl={pin.primary.url}
              secondaryUrl={pin.secondary.url}
              primaryWidth={pin.primary.width}
              primaryHeight={pin.primary.height}
              secondaryWidth={pin.secondary.width}
              secondaryHeight={pin.secondary.height}
              date={pin.memoryDay}
            />
          ))}
        </View>
        <Pressable
          onPress={() => {
            rTokenStorage
              .removeItem()
              .then(() =>
                aTokenStorage.removeItem().then(() => router.push("/login"))
              );
          }}
        >
          <Text style={styles.text}>Sign out</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    marginTop: 30,
    paddingTop: 60,
  },
  text: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
  profilePicture: {
    borderRadius: 100,
  },
  userName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  userHandle: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  smallText: {
    fontSize: 14,
    color: "#ffffff90",
  },
  smallerText: {
    fontSize: 12,
    color: "#ffffff90",
  },
});
