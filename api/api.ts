// api/api.ts
const API_URL = "http://192.168.1.149:3001";
import { SpotifyTrack } from "@/app/screens/suggestionscreen";
import { db } from "@/src/firebase";
import { addDoc, collection } from "firebase/firestore";

export async function saveSuggestion(track: SpotifyTrack, userId?: string) {
  try {
    const docRef = await addDoc(collection(db, "suggestions"), {
      title: track.name,
      userId: userId || "guest",
      artists: track.artists.map((a) => a.name),
      recommender: userId || "guest",
      previewUrl: track.previewUrls[0] || null,
      spotifyLinkUrl: track.external_urls.spotify,
      songCoverUrl: track.album.images[0]?.url || "",
    });

    console.log("Suggestion saved with ID:", docRef.id);
  } catch (error) {
    console.error("Error saving suggestion:", error);
  }
}

export const searchSong = async (song: string) => {
  try {
    const response = await fetch(
      `${API_URL}/spotify/search?q=${encodeURIComponent(song)}`
    );
    const data = await response.json();
    console.log("Got response:", data);
    return data;
  } catch (error) {
    console.error("Backend connection failed:", error);
    return null;
  }
};
export const getHealthCheck = async () => {
  try {
    const response = await fetch(`${API_URL}/spotify/token`);
    const data = await response.json();
    console.log("Got response:", data);
    return data;
  } catch (error) {
    console.error("Backend connection failed:", error);
    return null;
  }
};
