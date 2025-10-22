import { searchSong } from "@/api/api";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type SpotifyTrack = {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
  external_urls: { spotify: string };
};

export default function SuggestionsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [selectedSong, setSelectedSong] = useState<SpotifyTrack | null>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        const data = await searchSong(searchQuery);
        setResults(data?.tracks?.items || []);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const openInSpotify = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert("Cannot open Spotify link");
      }
    } catch (error) {
      console.error("Error opening Spotify link:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search for a song or artist..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Show selected song or search results */}
      {selectedSong ? (
        <View style={styles.previewContainer}>
          <Text style={styles.recommender}>Your Selection</Text>

          <Image
            source={{ uri: selectedSong.album.images[0]?.url }}
            style={styles.coverImage}
          />

          <Text style={styles.songTitle}>{selectedSong.name}</Text>
          <Text style={styles.artistText}>
            {selectedSong.artists.map((a) => a.name).join(", ")}
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.spotifyButton]}
            onPress={() => openInSpotify(selectedSong.external_urls.spotify)}
          >
            <Text style={styles.spotifyButtonText}>Listen on Spotify</Text>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.changeButton]}
              onPress={() => setSelectedSong(null)}
            >
              <Text style={styles.buttonText}>Change Song</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={() => console.log("Submitted:", selectedSong)}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedSong(item)}
              style={styles.resultItem}
            >
              <View>
                <Text style={styles.resultText}>{item.name}</Text>
                <Text style={styles.resultText}>
                  {item.artists.map((a) => a.name).join(", ")}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            searchQuery.length > 0 ? (
              <Text style={styles.noResults}>No results found</Text>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  searchBar: {
    backgroundColor: "#1e1e1e",
    color: "white",
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    borderColor: "#333",
    borderWidth: 1,
  },
  resultItem: {
    borderBottomColor: "#333",
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  resultText: {
    color: "#ccc",
    fontSize: 16,
  },
  noResults: {
    color: "#666",
    fontSize: 15,
    textAlign: "center",
    marginTop: 30,
  },
  previewContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
    paddingBottom: 40,
  },
  recommender: {
    color: "#bbb",
    fontSize: 16,
    marginBottom: 15,
  },
  coverImage: {
    width: 300,
    height: 300,
    borderRadius: 15,
    marginBottom: 20,
  },
  songTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  artistText: {
    color: "#bbb",
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 15,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  changeButton: {
    backgroundColor: "#333",
  },
  submitButton: {
    backgroundColor: "#1DB954",
  },
  spotifyButton: {
    backgroundColor: "#1DB954",
    marginHorizontal: 8,
    paddingVertical: 16, // ⬅️ normal button height
    borderRadius: 10,
    textAlign: "center",
  },
  spotifyButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
});
