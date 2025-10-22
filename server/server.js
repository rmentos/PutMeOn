// server/index.js
const axios = require("axios");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// In-memory cache
let spotifyToken = null;
let tokenExpiry = 0;

// Helper function to get or refresh the Spotify token
async function getSpotifyAccessToken() {
  // If we already have a valid token, return it
  if (spotifyToken && Date.now() < tokenExpiry) {
    console.log("Using cached Spotify token");
    return spotifyToken;
  }

  console.log("Fetching new Spotify token...");
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({ grant_type: "client_credentials" }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.SPOTIFY_CLIENT_ID +
                ":" +
                process.env.SPOTIFY_CLIENT_SECRET
            ).toString("base64"),
        },
      }
    );
    spotifyToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000;

    console.log(
      "Spotify token cached for",
      response.data.expires_in,
      "seconds"
    );
    return spotifyToken;
  } catch (error) {
    console.error(
      "Error fetching Spotify token:",
      error.response?.data || error
    );
    throw new Error("Failed to fetch Spotify token");
  }
}

// Your /spotify/token route
app.get("/spotify/token", async (req, res) => {
  try {
    const token = await getSpotifyAccessToken();
    res.json({
      access_token: token,
      expires_in: Math.floor((tokenExpiry - Date.now()) / 1000),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch token" });
  }
});

app.get("/spotify/search", async (req, res) => {
  const { q } = req.query; // user's search term

  try {
    const token = await getSpotifyAccessToken();
    // Search Spotify API
    const searchResponse = await axios.get(
      "https://api.spotify.com/v1/search",
      {
        headers: { Authorization: `Bearer ${spotifyToken}` },
        params: { q, type: "track", limit: 40 },
      }
    );

    res.json(searchResponse.data);
  } catch (error) {
    console.error("Error searching Spotify:", error.response?.data || error);
    res.status(500).json({ error: "Failed to fetch from Spotify" });
  }
});

// placeholder for song suggestions
app.post("/suggestions", (req, res) => {
  const { song, artist, user } = req.body;
  console.log("Received suggestion:", song, artist, user);
  res.json({ success: true, message: "Suggestion received!" });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
