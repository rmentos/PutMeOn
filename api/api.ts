// api/api.ts
const API_URL = "http://192.168.1.149:3001";

export const submitSuggestion = async (
  song: string,
  artist: string,
  user: string
) => {
  try {
    const response = await fetch(`${API_URL}/suggestions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ song, artist, user }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error submitting suggestion:", error);
    return { success: false, message: "Network error" };
  }
};

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
