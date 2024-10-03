import { useEffect, useState } from "react";
import * as Haptics from "expo-haptics";
import * as Buffer from "buffer";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Dimensions,
  Pressable,
  Touchable,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Href, router } from "expo-router";
import { FriendsPostPost, User } from "@/sdk";

function formatRelativeDate(date: number) {
  const now = new Date();
  const dateToFormat = new Date(date);

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  );
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const isToday = dateToFormat >= today;
  const isYesterday = dateToFormat >= yesterday && dateToFormat < today;

  // Format the time part (e.g., "12:00:03")
  const time = dateToFormat.toLocaleTimeString("it-IT", { hour12: false });

  if (isToday) {
    return time; // If it's today, just return the time
  } else if (isYesterday) {
    return `Yesterday at ${time}`;
  } else {
    // Format the date for days older than yesterday (e.g., "MM/DD/YYYY at HH:MM:SS")
    const datePart = dateToFormat.toLocaleDateString("en-US");
    return `${datePart} at ${time}`;
  }
}

function formatLateSeconds(lateInSeconds: number) {
  if (lateInSeconds === 0) return null;
  if (lateInSeconds < 60) return `${lateInSeconds} seconds late`;
  const minutes = Math.floor(lateInSeconds / 60);
  if (minutes < 60) return `${minutes} minutes late`;
  const hours = Math.floor(minutes / 60);
  return `${hours} hours late`;
}

function getCorrectUrl(
  big: boolean,
  currentBig: "primary" | "secondary",
  primaryUrl: string,
  secondaryUrl: string
) {
  if (currentBig === "primary") return big ? secondaryUrl : primaryUrl;
  else return big ? primaryUrl : secondaryUrl;
}

export function MyPost({
  primaryUrl,
  secondaryUrl,
  primaryWidth,
  primaryHeight,
  secondaryWidth,
  secondaryHeight,
}: {
  primaryUrl: string;
  secondaryUrl: string;
  primaryWidth: number;
  primaryHeight: number;
  secondaryWidth: number;
  secondaryHeight: number;
}) {
  const primaryAspectRatio = primaryWidth / primaryHeight;
  const secondaryAspectRatio = secondaryWidth / secondaryHeight;
  return (
    <View style={styles.myContainer}>
      <Image
        style={styles.topPost}
        source={{
          uri: secondaryUrl,
          height: 45 / secondaryAspectRatio,
          width: 45,
        }}
      />
      <Image
        style={styles.mypost}
        source={{
          uri: primaryUrl,
          height: 120 / primaryAspectRatio,
          width: 120,
        }}
      />
    </View>
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function SmallPost({
  post,
  width,
  user,
}: {
  post: FriendsPostPost & { i: number };
  width: number;
  user: User;
}) {
  const primaryAspectRatio = 3 / 4;
  const secondaryAspectRatio = 3 / 4;

  const [primaryImage, setPrimaryImage] = useState<string>("");
  const [secondaryImage, setSecondaryImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const loadImages = async () => {
      try {
        // Prefetch the images and handle retries

        await Image.prefetch(post.primary.url);

        await Image.prefetch(post.secondary.url);
        setPrimaryImage(post.primary.url);

        setSecondaryImage(post.secondary.url);
        setLoading(false);
      } catch (error) {
        console.error("Image prefetch failed, retrying...", error);
        if (retry < 3) {
          setRetry(retry + 1); // Retry up to 3 times if an image fails to load
        } else {
          setLoading(false); // If retries exceed limit, stop
        }
      }
    };

    loadImages();
  }, [post, retry]);

  if (loading) {
    return (
      <View
        style={[
          styles.smallPostContainer,
          { height: width / primaryAspectRatio },
        ]}
      >
        <ActivityIndicator size="small" color="#fff" />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={() =>
        router.push(
          ("/post/" +
            Buffer.Buffer.from(JSON.stringify(post)).toString(
              "base64"
            )) as Href<string>
        )
      }
      style={[
        styles.smallPostContainer,
        { height: width / primaryAspectRatio },
      ]}
    >
      {secondaryImage && (
        <Image
          style={styles.smallPostSecondary}
          source={{
            uri: secondaryImage,
            height: width / 2.5 / secondaryAspectRatio,
            width: width / 2.5,
          }}
          onLoad={() => console.log("Secondary image loaded")}
          onError={(e) => {
            console.error("Error loading secondary image", e.nativeEvent.error);
            setSecondaryImage(""); // Remove broken image
          }}
        />
      )}
      {primaryImage && (
        <Image
          style={styles.smallPostPrimary}
          source={{
            uri: primaryImage,
            height: width / primaryAspectRatio,
            width: width,
          }}
          onLoad={() => console.log("Primary image loaded")}
          onError={(e) => {
            console.error("Error loading primary image", e.nativeEvent.error);
            setPrimaryImage(""); // Remove broken image
          }}
        />
      )}
      <Text
        style={{
          fontSize: 12,
          color: "white",
          position: "absolute",
          fontWeight: "bold",
          bottom: 10,
          left: 10,
        }}
      >
        {user.username}
      </Text>
    </TouchableOpacity>
  );
}

export function ReBeal({
  primaryUrl,
  secondaryUrl,
  primaryWidth,
  secondaryWidth,
  primaryHeight,
  secondaryHeight,
  userName,
  userUrl,
  isLate,
  postedAt,
  lateInSeconds,
  isMain,
  visible,
  blurred,
  userId,
  postData,
}: {
  primaryUrl: string;
  secondaryUrl: string;
  userName: string;
  userUrl: string;
  primaryWidth: number;
  secondaryWidth: number;
  primaryHeight: number;
  secondaryHeight: number;
  isLate: boolean;
  postedAt: string;
  lateInSeconds: number;
  isMain: boolean;
  visible: boolean;
  blurred: boolean;
  userId: string;
  postData: FriendsPostPost & { user: User };
}) {
  console.log(blurred);
  const [bigImage, setBigImage] = useState<"primary" | "secondary">("primary");
  const [bigUrl, setBigUrl] = useState<string>(primaryUrl);
  const [smallUrl, setSmallUrl] = useState<string>(secondaryUrl);
  useEffect(() => {
    setBigUrl(bigImage === "primary" ? primaryUrl : secondaryUrl);
    setSmallUrl(bigImage === "primary" ? secondaryUrl : primaryUrl);
  }, [bigImage]);
  const windowWidth = Dimensions.get("window").width;
  const primaryAspectRatio = primaryWidth / primaryHeight;
  const secondaryAspectRatio = secondaryWidth / secondaryHeight;
  const postedAtDate = Date.parse(postedAt);
  const topText =
    isLate && isMain
      ? formatLateSeconds(lateInSeconds)
      : formatRelativeDate(postedAtDate);
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.userView}>
          <Image
            source={{ uri: userUrl, width: 100, height: 100 }}
            style={styles.profileIcon}
          />
          <View style={styles.userInfoView}>
            <Pressable
              onPress={() => {
                router.push(("/user/" + userId) as Href<string>);
              }}
            >
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.bottomText}>{topText}</Text>
            </Pressable>
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={{
              width: 160 * secondaryAspectRatio,
              height: 160,
              zIndex: 99,
              position: "absolute",
              backfaceVisibility: "hidden",
              backgroundColor: "transparent",
            }}
            onPress={() => {
              setBigImage(bigImage === "primary" ? "secondary" : "primary");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
            }}
          >
            <Image
              style={styles.topImage}
              blurRadius={blurred ? 200 : 0}
              source={{
                uri: visible ? smallUrl : "rebeal://react-logo.png",
                height: 160,
                width: 160 * secondaryAspectRatio,
              }}
            />
          </TouchableOpacity>
          <Pressable
            onPress={() =>
              router.push(
                ("/post/" +
                  Buffer.Buffer.from(JSON.stringify(postData)).toString(
                    "base64"
                  )) as Href<string>
              )
            }
          >
            <Image
              style={styles.image}
              blurRadius={blurred ? 200 : 0}
              source={{
                uri: visible ? bigUrl : "rebeal://react-logo.png",
                height: windowWidth / primaryAspectRatio,
                width: windowWidth,
              }}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export function Pin({
  primaryUrl,
  secondaryUrl,
  primaryWidth,
  primaryHeight,
  secondaryWidth,
  secondaryHeight,
  date,
}: {
  primaryUrl: string;
  secondaryUrl: string;
  primaryWidth: number;
  primaryHeight: number;
  secondaryWidth: number;
  secondaryHeight: number;
  date: string;
}) {
  const pinDate = new Date(
    parseInt(date.split("-")[0]),
    parseInt(date.split("-")[1]) - 1,
    parseInt(date.split("-")[2])
  );
  const firstLine = pinDate.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
  });
  const secondLine = pinDate.toLocaleDateString("it-IT", {
    year: "numeric",
  });
  const primaryAspectRatio = primaryWidth / primaryHeight;
  const secondaryAspectRatio = secondaryWidth / secondaryHeight;
  return (
    <View style={styles.container}>
      <Image
        style={styles.topPin}
        source={{
          uri: secondaryUrl,
          height: 45 / secondaryAspectRatio,
          width: 45,
        }}
      />
      <Image
        style={styles.pin}
        source={{
          uri: primaryUrl,
          height: 120 / primaryAspectRatio,
          width: 120,
        }}
      />
      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          color: "white",
          position: "absolute",
          bottom: 40,
          left: 10,
        }}
      >
        {firstLine}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: "white",
          position: "absolute",
          bottom: 25,
          left: 10,
        }}
      >
        {secondLine}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfoView: {
    flex: 1,
    flexDirection: "column",
  },
  userView: {
    left: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
    alignContent: "center",
  },
  userName: {
    gap: 8,
    color: "white",
    fontWeight: "bold",
  },
  bottomText: {
    color: "gray",
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    alignSelf: "center", // Center each text element vertically
    color: "white",
  },
  image: {
    marginTop: 8,
    borderRadius: 15,
  },
  pin: {
    borderRadius: 10,
    marginTop: 8,
  },
  topImage: {
    borderRadius: 15,
    borderColor: "black",
    borderWidth: 2,
    zIndex: 200,
    top: 20,
    marginLeft: 15,
    position: "absolute",
  },
  topPin: {
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    zIndex: 200,
    top: 33,
    left: 10,
    position: "absolute",
  },
  mypost: {
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    position: "absolute",
    top: 0,
    zIndex: 20,
  },
  topPost: {
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    top: -85,
    left: -32,
    zIndex: 99, // Ensures topPost is underneath pin
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 50,
  },
  myContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  smallPostPrimary: {
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
  },
  smallPostSecondary: {
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    position: "absolute",
    top: 5,
    left: 5,
    zIndex: 20,
  },
  smallPostContainer: {
    margin: 2,
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
