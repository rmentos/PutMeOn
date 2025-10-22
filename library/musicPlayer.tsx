import { createAudioPlayer, setAudioModeAsync } from "expo-audio";

// Keep a reference to the currently active player
let currentAudioPlayer: ReturnType<typeof createAudioPlayer> | null = null;

export async function initializeAudioMode() {
  try {
    await setAudioModeAsync({
      allowsRecording: false,
      playsInSilentMode: true, // plays even if iPhone is on silent
    });
    console.log(" Audio mode initialized");
  } catch (error) {
    console.error(" Error setting audio mode:", error);
  }
}

export async function playPreview(url: string) {
  try {
    if (!url) {
      console.warn("⚠️ No preview URL provided");
      return;
    }
    const player = createAudioPlayer({ uri: url });
    currentAudioPlayer = player;
    await player.play();
  } catch (error) {
    console.error("Error playing preview:", error);
    // Clean up if there’s an error
    if (currentAudioPlayer) {
      currentAudioPlayer.release();
      currentAudioPlayer = null;
    }
  }
}

/**
 * Stop any currently playing preview
 */
export async function stopPreview() {
  try {
    if (currentAudioPlayer) {
      console.log("⏹️ Stopping current preview");
      currentAudioPlayer.release();
      currentAudioPlayer = null;
    }
  } catch (error) {
    console.error("❌ Error stopping preview:", error);
  }
}
