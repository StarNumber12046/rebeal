import { MenuBar } from "@/components/MenuBar";
import { TopBar } from "@/components/TopBar";
import { Text, View, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ProfileContext } from "./_layout";
import { useContext, useEffect, useState } from "react";
import { Friend, Friends, User, getFriends, getSuggestedFriends } from "@/sdk";
import { FriendContainer, SuggestedFriend } from "../components/Friend";

export default function FriendsSuggestionsScreen() {
  const userContext = useContext(ProfileContext);
  const [friends, setFriends] = useState<Friend[] | null>(null);
  useEffect(() => {
    if (!userContext.setSuggestedFriends) {
      return;
    }
    getFriends(userContext).then((friends) => {
      setFriends(friends.data);
    });
  }, [userContext]);

  return (
    <View style={{ top: 10 }}>
      <MenuBar arrowLocation="right" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Friends ({friends?.length ?? 0})</Text>
        {friends?.map((friend) => (
          <FriendContainer key={friend.id} friend={friend} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 20,
    marginTop: 10,
    fontFamily: "Inter_500Medium",
    gap: 10,
  },
  title: {
    fontSize: 14,
    color: "#ffffff95",
    textTransform: "uppercase",
    fontFamily: "Inter_600SemiBold",
  },
});
