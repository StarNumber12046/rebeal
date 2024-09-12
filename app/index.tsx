import React, { useContext, useEffect, useState } from "react";
import { IOScrollView, InView } from "react-native-intersection-observer";
import { View, StyleSheet, Text } from "react-native";
import { TopBar } from "@/components/TopBar";
import { MyPost, ReBeal } from "@/components/ReBeal";
import { CameraButton } from "@/components/CameraButton";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getHeaders from "happy-headers";
import { getFriendsPosts, getMyPosts, UserPost } from "@/sdk";
import { ScrollView } from "react-native-gesture-handler";

export default function App() {
  const [visibleItems, setVisibleItems] = useState<{ [key: string]: boolean }>(
    {}
  );
  // State to check if the component is mounted
  const [isMounted, setIsMounted] = useState(false);
  const [friendsPosts, setFriendsPosts] = useState<any[]>([]);
  const [myPosts, setMyPosts] = useState<UserPost[]>([]);

  async function checkAuth() {
    if (
      !(await AsyncStorage.getItem("authToken")) ||
      !(await AsyncStorage.getItem("refreshToken"))
    ) {
      console.log("Redirecting to login");
      router.push("/login");
    }
  }

  // Use useEffect to check if the component is mounted
  useEffect(() => {
    setIsMounted(true);
    if (isMounted) {
      checkAuth();
      getFriendsPosts().then((p) => setFriendsPosts(p));
      getMyPosts().then((p) => setMyPosts(p));
    }
  }, [isMounted]);

  const handleVisibilityChange = (id: string, isVisible: boolean) => {
    setVisibleItems((prevState) => ({
      ...prevState,
      [id]: isVisible,
    }));
  };

  return (
    <View>
      <TopBar />
      <IOScrollView style={styles.scrollView}>
        <ScrollView
          horizontal
          style={{
            width: "100%",
            flexDirection: "row",
          }}
          contentContainerStyle={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {myPosts.map((value) => (
            <InView
              key={value.id}
              style={{
                flex: 1,
                height: 240,
                marginHorizontal: -10,
              }}
            >
              <MyPost
                primaryHeight={value.primary.height}
                primaryWidth={value.primary.width}
                primaryUrl={value.primary.url}
                secondaryHeight={value.secondary.height}
                secondaryWidth={value.secondary.width}
                secondaryUrl={value.secondary.url}
              />
            </InView>
          ))}
        </ScrollView>
        {friendsPosts.map((value) => (
          <InView
            key={value.id}
            onChange={(inView) => handleVisibilityChange(value.id, inView)}
          >
            <ReBeal
              primaryHeight={value.primary.height}
              primaryWidth={value.primary.width}
              primaryUrl={value.primary.url}
              secondaryHeight={value.secondary.height}
              secondaryWidth={value.secondary.width}
              secondaryUrl={value.secondary.url}
              userName={value.user.username}
              userUrl={value.user.profilePicture.url}
              isLate={value.isLate}
              postedAt={value.postedAt}
              lateInSeconds={value.lateInSeconds}
              isMain={value.isMain}
              visible={visibleItems[value.id]} // Pass visibility state here
              blurred={myPosts.length <= 0}
            />
          </InView>
        ))}
        <View style={{ width: "100%", height: 75 }}></View>
      </IOScrollView>
      <CameraButton />
    </View>
  );
}

const styles = StyleSheet.create({
  miniScrollView: {
    height: 240,
  },
  miniScrollViewContent: {
    flexDirection: "row", // Ensures horizontal arrangement
    alignItems: "center", // Aligns items vertically in the center
  },
  scrollView: {
    position: "static",
    top: -80,
    paddingTop: 80,
    left: 0,
    width: "100%",
    marginBottom: 10,
  },
  container: {
    flex: 1, // Fill the available space
    width: "100%", // Make the container fill the entire width of the screen
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
  },
});
