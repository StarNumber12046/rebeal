import { SmallPost } from "@/components/ReBeal";
import { FriendsPost, FriendsPostPost, getFriendsPosts } from "@/sdk";
import { useEffect, useState } from "react";
import { FlatList, View, Text, StyleSheet, Dimensions } from "react-native";

export default function GridView() {
  const screenWidth = Dimensions.get("window").width; // Get the screen width
  const itemWidth = screenWidth / 3 - 5; // Calculate item width with some margin
  const [friendsPosts, setFriendsPosts] = useState<any[]>([]);
  let last = 0;
  useEffect(() => {
    getFriendsPosts().then((posts) =>
      setFriendsPosts(posts.map((item) => ({ ...item, i: last++ })))
    );
  }, []);
  return (
    <View>
      <FlatList
        style={styles.container}
        numColumns={3}
        data={friendsPosts}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        keyExtractor={(item) => item.i.toString()}
        renderItem={({ item }) => (
          <SmallPost post={item} user={item.user} width={itemWidth} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    width: "100%",
    height: "100%",
  },
  item: {
    color: "white",
    fontSize: 24,
    margin: 10,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
  },
});
