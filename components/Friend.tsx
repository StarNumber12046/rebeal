import { Friend, User } from "@/sdk";
import { Href, router } from "expo-router";
import { View, Image, Text, StyleSheet, Pressable } from "react-native";
import { FriendsWith } from "./FriendsWith";

export function SuggestedFriend({ friend }: { friend: User }) {
  return (
    <View>
      <Image
        source={{ uri: friend.profilePicture.url, width: 50, height: 50 }}
      />
    </View>
  );
}

export function FriendContainer({ friend }: { friend: Friend }) {
  return (
    <Pressable onPress={() => router.push(("/user/" + friend.id) as Href)}>
      <View style={styles.container}>
        <Image
          source={{
            uri: friend.profilePicture?.url ?? "rebeal://no-profile-pic",
            width: 50,
            height: 50,
          }}
          style={styles.profilePicture}
        />
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.userText}>{friend.username}</Text>
          <Text style={styles.smallText}>{friend.fullname}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profilePicture: {
    borderRadius: 100,
  },
  smallText: {
    fontSize: 15,
    color: "#ffffff90",
    marginBottom: 10,
  },
  userText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});
