import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";

export default function musicscreen() {
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
    <View style={styles.container}>
      <View style={styles.topButtons}>
        <TouchableOpacity style={[styles.topButton, styles.exploreButton]}>
          <Text style={styles.topButtonText}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.topButton, styles.genreButton]}>
          <Text style={styles.topButtonText}>Genres</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.recommender}>Recommended by {track.recommender}</Text>

      <Image source={{ uri: track.coverUrl }} style={styles.coverImage} />

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
    backgroundColor: "#1DB954", // Spotify green
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
