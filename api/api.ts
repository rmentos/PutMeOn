// api/api.ts
const API_URL = "http://localhost:3001";
import { SpotifyTrack } from "@/app/screens/suggestionscreen";
import { db } from "@/src/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
type Social = {
  platform:
    | "instagram"
    | "twitter"
    | "tiktok"
    | "youtube"
    | "spotify"
    | "other"
    | string;
  url: string;
};

export type User = {
  userName: string;
  password: string;
  likes: number;
  socials: Social[]; // up to 3 entries
};

export async function signUp(userName: string, password: string) {
  try {
    // Check if username already exists
    const q = query(collection(db, "users"), where("userName", "==", userName));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      console.warn("Username already exists!");
      return { success: false, message: "Username already exists" };
    }

    // Create a new User object following your type
    const newUser: User = {
      userName,
      password,
      likes: 0,
      socials: [], // empty on signup, user can add later
    };

    const docRef = await addDoc(collection(db, "users"), newUser);
    console.log("Signed up:", docRef.id);

    return { success: true, user: newUser };
  } catch (error) {
    console.error("Error signing up:", error);
    return { success: false, message: "Sign up failed" };
  }
}

// LOG IN FUNCTION
export async function logIn(userName: string, password: string) {
  try {
    const q = query(
      collection(db, "users"),
      where("userName", "==", userName),
      where("password", "==", password)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // Extract the user document
      const userDoc = snapshot.docs[0];
      const userData = userDoc.data() as User;

      console.log("Logged in as:", userData.userName);
      return { success: true, user: userData };
    } else {
      console.warn("Invalid username or password");
      return { success: false, message: "Invalid credentials" };
    }
  } catch (error) {
    console.error("Error logging in:", error);
    return { success: false, message: "Login failed" };
  }
}

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
