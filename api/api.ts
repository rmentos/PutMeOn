// api/api.ts
const API_URL = "10.40.115.117:8081";

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

export const getHealthCheck = async () => {
  try {
    const response = await fetch(`${API_URL}/`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Backend connection failed:", error);
    return null;
  }
};
