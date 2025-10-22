import { searchSong } from "@/api/api";
import { playPreview, stopPreview } from "@/library/musicPlayer";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
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
  preview_url?: string;
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
  useEffect(() => {
    if (selectedSong?.preview_url) {
      playPreview(selectedSong.preview_url!);

      return () => {
        stopPreview();
      };
    } else {
      stopPreview();
    }
  }, [selectedSong]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar (always visible) */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search for a song or artist..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {/* Show selected song or results */}
      {selectedSong ? (
        <View style={styles.previewContainer}>
          <Text style={styles.recommender}>Your Selection</Text>

          <Image
            source={{ uri: selectedSong.album.images[0]?.url }}
            style={styles.coverImage}
          />

          <Text style={styles.songTitle}>{selectedSong.name}</Text>

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
    marginBottom: 20,
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
    justifyContent: "center",
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
    marginBottom: 25,
  },
  songTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
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
});
