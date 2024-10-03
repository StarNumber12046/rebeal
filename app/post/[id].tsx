import { MenuBar } from "@/components/MenuBar";
import { FriendsPost, FriendsPostPost, User } from "@/sdk";
import { useRoute } from "@react-navigation/native";
import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import { Buffer } from "buffer";
import { useEffect, useState } from "react";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
interface Params {
  id: string;
}

function formatLateSeconds(lateInSeconds: number) {
  if (lateInSeconds === 0) return null;
  if (lateInSeconds < 60) return `${lateInSeconds} seconds late`;
  const minutes = Math.floor(lateInSeconds / 60);
  if (minutes < 60) return `${minutes} minutes late`;
  const hours = Math.floor(minutes / 60);
  return `${hours} hours late`;
}

export default function Post() {
  const params = useRoute().params as Params | undefined;
  if (!params) return null;
  const postData: FriendsPostPost & { user: User } = JSON.parse(
    Buffer.from(params.id, "base64").toString()
  );

  console.log(postData);
  Image.prefetch(postData.primary.url);
  Image.prefetch(postData.secondary.url);
  const [bigImage, setBigImage] = useState<"primary" | "secondary">("primary");

  const title = (
    <View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#ffffff",
          textAlign: "center",
        }}
      >
        {postData.user.username}
      </Text>
      <Text style={{ fontSize: 15, color: "#ffffff65" }}>
        {
          new Date(postData.postedAt as unknown as number)
            .toTimeString()
            .split(" ")[0]
        }
        {postData.lateInSeconds &&
          " - " + formatLateSeconds(postData.lateInSeconds)}
      </Text>
    </View>
  );
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "column",
        flex: 1,
        paddingVertical: 20,
      }}
    >
      <View style={{ height: 100 }}>
        <MenuBar arrowLocation="left" title={title} />
      </View>
      <View style={{ flex: 1, marginLeft: 20 }}>
        <Image
          source={{
            uri:
              bigImage === "primary"
                ? postData.primary.url
                : postData.secondary.url,
            width: Dimensions.get("window").width - 40,
            height: (Dimensions.get("window").width - 40) / (3 / 4),
          }}
          style={{ borderRadius: 10 }}
        />
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 99,
            width: 100,
            height: 100 / (3 / 4),
          }}
          onPress={() => {
            console.log("Switching images");
            setBigImage(bigImage === "primary" ? "secondary" : "primary");
          }}
        >
          <Image
            source={{
              uri:
                bigImage === "primary"
                  ? postData.secondary.url
                  : postData.primary.url,
              width: 100,
              height: 100 / (3 / 4),
            }}
            style={{
              borderRadius: 10,
              position: "absolute",
              zIndex: 99,
              borderColor: "black",
              borderWidth: 2,
            }}
          />
        </TouchableOpacity>
        <Text
          style={{
            alignItems: "center",
            alignSelf: "center",
            marginTop: 10,
            backgroundColor: "#303030",
            borderRadius: 50,
            width: 86,
            fontWeight: "bold",
            paddingVertical: 5,
            fontSize: 12,
            paddingHorizontal: 5,
            textAlign: "center",
            color: "#ffffff",
          }}
        >
          <FontAwesome name="repeat" size={12} color="#ffffff" />
          {"  "}
          {postData.retakeCounter}{" "}
          {postData.retakeCounter === 1 ? "retake" : "retakes"}
        </Text>
      </View>
    </View>
  );
}
