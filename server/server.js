// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// basic test route
app.get("/", (req, res) => {
  res.json({ message: "Backend working" });
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
