import React from "react";
import {
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function musicscreen() {
  const { width } = Dimensions.get("window");
  const SWIPE_THRESHOLD = width * 0.25;
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        // Animate off-screen
        translateX.value = withSpring(
          event.translationX > 0 ? width : -width,
          {},
          () => {
            translateX.value = 0;
          }
        );
      } else {
        // Snap back to center
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${translateX.value / 20}deg` },
    ],
  }));

  // Placeholder data
  const track = {
    title: "Midnight City",
    artist: "M83",
    recommender: "user123",
    spotifyUrl: "https://open.spotify.com/track/3sNVsP50132BTNlImLx70i",
    coverUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYprxUcIQ1gSLCA_gBXTENCkCPTcGPIBZpEw&s",
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.topButtons}>
          <TouchableOpacity style={[styles.topButton, styles.exploreButton]}>
            <Text style={styles.topButtonText}>Explore</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.topButton, styles.genreButton]}>
            <Text style={styles.topButtonText}>Genres</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.recommender}>
          Recommended by {track.recommender}
        </Text>

        <View style={styles.container}>
          <GestureDetector gesture={panGesture}>
            <Animated.View style={animatedStyle}>
              <Image
                source={{ uri: track.coverUrl }}
                style={styles.coverImage}
              />
            </Animated.View>
          </GestureDetector>
        </View>

        <View style={styles.songInfo}>
          <Text style={styles.songTitle}>{track.title}</Text>
          <Text style={styles.artist}>{track.artist}</Text>

          <TouchableOpacity onPress={() => Linking.openURL(track.spotifyUrl)}>
            <Text style={styles.spotifyLink}>Listen on Spotify</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.skipButton]}
            onPress={() => console.log("Skip")}
          >
            <Text style={styles.buttonText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.likeButton]}
            onPress={() => console.log("Like")}
          >
            <Text style={styles.buttonText}>Like 👍</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  topButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 60,
    marginBottom: 20,
  },
  topButton: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  exploreButton: {
    backgroundColor: "#1DB954",
  },
  genreButton: {
    backgroundColor: "#333",
  },
  topButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  recommender: {
    color: "#bbb",
    fontSize: 16,
    marginBottom: 10,
  },
  coverImage: {
    width: 300,
    height: 300,
    borderRadius: 12,
    marginVertical: 20,
  },
  songInfo: {
    alignItems: "center",
    marginBottom: 40,
  },
  songTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  artist: {
    color: "#aaa",
    fontSize: 18,
    marginTop: 4,
  },
  spotifyLink: {
    marginTop: 10,
    color: "#1DB954",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  skipButton: {
    backgroundColor: "#333",
  },
  likeButton: {
    backgroundColor: "#1DB954",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
