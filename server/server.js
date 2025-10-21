// server/index.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/spotify/token", async (req, res) => {
  const authOptions = {
    method: "post",
    url: "https://accounts.spotify.com/api/token",
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
    data: new URLSearchParams({
      grant_type: "client_credentials",
    }).toString(),
  };

  try {
    const response = await axios(authOptions);
    res.json(response.data); // contains access_token and expires_in
  } catch (err) {
    console.error("Error fetching Spotify token:", err.response?.data || err);
    res.status(500).json({ error: "Failed to fetch token" });
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
