import RecommenderProfileModal from "@/app/screens/modals/showProfile";
import { playPreview, stopPreview } from "@/library/musicPlayer";

import { db } from "@/src/firebase";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
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
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Suggestion = {
  id?: string;
  title: string;
  artists: string[];
  recommender: string;
  previewUrl?: string | null;
  spotifyLinkUrl: string;
  songCoverUrl: string;
};

export default function musicscreen() {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { width } = Dimensions.get("window");
  const SWIPE_THRESHOLD = width * 0.25;
  const translateX = useSharedValue(0);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔥 Fetch suggestions from Firestore
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const snapshot = await getDocs(collection(db, "suggestions"));
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();

          return {
            id: doc.id,
            title: docData.title || "Untitled",
            artists: docData.artists || ["Unknown Artist"],
            recommender:
              docData.recommender ||
              docData.Recommender ||
              docData.recommenderName ||
              "guest",
            previewUrl: docData.previewUrl ?? null,
            spotifyLinkUrl: docData.spotifyLinkUrl || "",
            songCoverUrl:
              docData.songCoverUrl ||
              "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
          };
        }) as Suggestion[];

        // Shuffle order for variety
        const shuffled = data
          .map((s) => ({ s, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ s }) => s);

        setSuggestions(shuffled);
      } catch (error) {
        console.error("Error fetching Firestore suggestions:", error);
      }
    };

    fetchSuggestions();
  }, []);

  // 🎵 Auto-play preview when switching tracks
  useEffect(() => {
    if (suggestions.length === 0) return;

    const track = suggestions[currentIndex];
    if (track.previewUrl) playPreview(track.previewUrl);

    return () => {
      stopPreview(); // stop audio on unmount or index change
    };
  }, [currentIndex, suggestions]);

  const handleNextTrack = async () => {
    translateX.value = 0;
    await stopPreview();
    setCurrentIndex((prev) => (prev + 1) % suggestions.length);
  };

  // Swipe gesture to skip track
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const direction = event.translationX > 0 ? 1 : -1;
        translateX.value = withSpring(direction * width, {}, () =>
          runOnJS(handleNextTrack)()
        );
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${translateX.value / 20}deg` },
    ],
  }));

  if (suggestions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading songs...</Text>
      </View>
    );
  }

  const current = suggestions[currentIndex];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* 👤 Recommender */}
        <TouchableOpacity onPress={() => setShowProfileModal(true)}>
          <Text
            style={[
              styles.recommender,
              { color: "#1DB954", textDecorationLine: "underline" },
            ]}
          >
            Recommended by {current.recommender || "guest"}
          </Text>
        </TouchableOpacity>
        <RecommenderProfileModal
          visible={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          userName={current.recommender || "guest"}
        />

        {/* 🎵 Album cover with swipe */}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[animatedStyle]}>
            <Image
              source={{ uri: current.songCoverUrl }}
              style={styles.coverImage}
              resizeMode="cover"
            />
          </Animated.View>
        </GestureDetector>

        {/* 🎧 Song info */}
        <View style={styles.songInfo}>
          <Text style={styles.songTitle}>{current.title}</Text>
          <Text style={styles.artist}>{current.artists.join(", ")}</Text>

          <TouchableOpacity
            style={styles.spotifyButton}
            onPress={() => Linking.openURL(current.spotifyLinkUrl)}
          >
            <Text style={styles.spotifyText}> Listen on Spotify</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.skipButton]}
            onPress={handleNextTrack}
          >
            <Text style={styles.buttonText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.likeButton]}
            onPress={() =>
              console.log("Liked:", current.title, "by", current.artists)
            }
          >
            <Text style={styles.buttonText}>Like 👍</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
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
    textAlign: "center",
    width: "100%",
    paddingHorizontal: 10,
    flexWrap: "wrap",
  },
  coverImage: {
    width: 320,
    height: 320,
    borderRadius: 16,
    marginVertical: 20,
  },
  songInfo: {
    alignItems: "center",
    marginBottom: 50,
  },
  songTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  artist: {
    color: "#aaa",
    fontSize: 15,
    marginTop: 6,
    textAlign: "center",
    width: "100%",
    paddingHorizontal: 10,
    flexWrap: "wrap",
  },
  spotifyButton: {
    marginTop: 15,
    backgroundColor: "#1DB954",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 50,
  },
  spotifyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
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
  loadingText: {
    color: "#ccc",
    fontSize: 18,
  },
});
