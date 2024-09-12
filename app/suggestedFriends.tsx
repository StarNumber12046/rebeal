import { MenuBar } from "@/components/MenuBar";
import { TopBar } from "@/components/TopBar";
import { Text, View, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ProfileContext } from "./_layout";
import { useContext, useEffect, useState } from "react";
import { User, getFriends, getSuggestedFriends } from "@/sdk";
import { SuggestedFriend } from "../components/Friend";

export default function FriendsSuggestionsScreen() {
  const userContext = useContext(ProfileContext);
  const [suggestedFriends, setSuggestedFriends] = useState<User[] | null>(null);
  useEffect(() => {
    if (!userContext.setSuggestedFriends) {
      return;
    }
    getSuggestedFriends(userContext).then((friends) => {
      setSuggestedFriends(friends);
    });
  }, [userContext]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MenuBar arrowLocation="right" />
      <Text style={styles.title}>Friends suggestions</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 20,
    marginTop: 30,
    fontFamily: "Inter_500Medium",
  },
  title: {
    fontSize: 14,
    color: "#ffffff95",
    textTransform: "uppercase",
    fontFamily: "Inter_600SemiBold",
  },
});
