import { MenuBar } from "@/components/MenuBar";
import { getPins, getUserProfile, PinnedMemories, Profile, User } from "@/sdk";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, Image, Dimensions, Text, StyleSheet } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FriendsWith } from "@/components/FriendsWith";
import { Pin } from "@/components/ReBeal";

dayjs.extend(relativeTime);

interface Params {
  user: string;
}

function formatRelativeTimeFromDate(date: string | number | Date): string {
  const targetDate = dayjs(date);
  return `since ${targetDate.fromNow()}`;
}

export default function UserScreen() {
  const [user, setUser] = useState<Profile | null>(null);
  const [pins, setPins] = useState<PinnedMemories | null>(null);
  const params = useRoute().params as Params | undefined;
  useEffect(() => {
    console.log("Getting user");
    getUserProfile(params?.user ?? "").then((user) => {
      console.log("User fetched");
      setUser(user);
    });
    getPins(params?.user ?? "").then((pins) => {
      console.log("Pins fetched");
      console.log(pins);
      setPins(pins);
    });
  }, []);
  const friendedAt = Date.parse(user?.relationship.friendedAt ?? "");
  const relativeTime = formatRelativeTimeFromDate(friendedAt);

  const screenWidth = Dimensions.get("window").width;
  const profilePictureAspectRatio =
    (user?.profilePicture?.width ?? 1) / (user?.profilePicture?.height ?? 1);
  return (
    <View>
      <MenuBar arrowLocation="left" title={user?.username} />
      <Image
        source={{
          uri: user?.profilePicture?.url ?? "rebeal://profile.png",
          height: screenWidth / profilePictureAspectRatio,
          width: screenWidth,
        }}
      />
      <Text style={styles.text}>{user?.fullname}</Text>
      {user?.biography && <Text style={styles.bio}>{user?.biography}</Text>}
      {user?.location && <Text style={styles.smallText}>{user?.location}</Text>}
      <Text
        style={
          user?.biography || user?.location
            ? styles.smallText
            : styles.smallTextAlt
        }
      >
        Friends {relativeTime}
      </Text>
      <FriendsWith sample={user?.relationship.commonFriends.sample ?? []} />
      {pins?.pinnedMemories.length != 0 && (
        <Text style={styles.nonOverflowText}>Pins</Text>
      )}
      <View
        style={{
          marginTop: -20,
          marginHorizontal: 10,
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 30,
  },
  text: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    fontWeight: "bold",
    color: "white",
    marginTop: -50,
    marginHorizontal: 20,
  },
  nonOverflowText: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
    marginHorizontal: 20,
  },
  smallText: {
    fontSize: 16,
    color: "#99999c",
    marginHorizontal: 0,
  },
  bio: {
    fontWeight: "bold",
    marginHorizontal: 10,
    marginTop: 10,
    fontSize: 16,
    color: "white",
  },
  smallTextAlt: {
    fontSize: 16,
    color: "#99999c",
    marginHorizontal: 20,
  },
});
