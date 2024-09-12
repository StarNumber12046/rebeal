import { Sample } from "@/sdk";
import { View, Text, StyleSheet, Image } from "react-native";

function getShownCount(samples: Sample[]): number {
  if (samples.length === 0) return 0;
  if (samples.length === 1) return 1;
  if (samples.length === 2) return 2;
  return 3;
}

const formatSample = (samples: Sample[]): JSX.Element => {
  const count = samples.length;

  if (count === 0) return <Text style={styles.text}>No friends</Text>;

  if (count === 1) {
    return (
      <Text style={styles.text}>
        Friends with <Text style={styles.username}>{samples[0].username}</Text>
      </Text>
    );
  }

  if (count === 2) {
    return (
      <Text style={styles.text}>
        Friends with <Text style={styles.username}>{samples[0].username}</Text>{" "}
        and <Text style={styles.username}>{samples[1].username}</Text>
      </Text>
    );
  }

  return (
    <Text style={styles.text}>
      Friends with <Text style={styles.username}>{samples[0].username}</Text>,{" "}
      <Text style={styles.username}>{samples[1].username}</Text> and {count - 2}{" "}
      others
    </Text>
  );
};

const FriendsImage = ({ samples }: { samples: Sample[] }) => {
  const count = samples.length;

  // Determine the images to display and the remaining count
  const [firstImage, secondImage, ...remainingImages] = samples.map(
    (s) => s.profilePicture
  );
  const remainingCount = remainingImages.length;

  return (
    <View style={styles.container}>
      {firstImage && (
        <Image
          source={{ uri: firstImage.url }}
          style={[styles.image, styles.image1]}
        />
      )}
      {secondImage && (
        <Image
          source={{ uri: secondImage.url }}
          style={[styles.image, styles.image2]}
        />
      )}
      {remainingCount > 0 && (
        <View style={styles.remainingContainer}>
          <Text style={styles.remainingText}>+{remainingCount}</Text>
        </View>
      )}
    </View>
  );
};

export function FriendsWith({ sample }: { sample: Sample[] }) {
  console.log(sample);
  return (
    <View style={styles.container}>
      <FriendsImage samples={sample} />
      <Text style={{ marginLeft: -30 * (4 - getShownCount(sample)) }}>
        {formatSample(sample)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    width: "60%",
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: "absolute",
  },
  text: {
    flexWrap: "wrap",
    fontSize: 14,
    color: "white",
  },
  username: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },
  image1: {
    marginLeft: 15,
  },
  image2: {
    borderWidth: 2,
    borderColor: "black",
    marginLeft: 45, // Adjust as needed for overlap
  },
  remainingContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1f1f1f",
    borderWidth: 2,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 75, // Adjust spacing as needed
  },
  remainingText: {
    color: "white",
    fontWeight: "bold",
  },
});
