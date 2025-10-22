import { Audio } from "expo-av";

let currentSound: Audio.Sound | null = null;

// Set up audio mode for playback
export async function initializeAudioMode() {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: false,
      playThroughEarpieceAndroid: false,
    });
    console.log(" Audio mode initialized for playback");
  } catch (error) {
    console.error(" Error setting audio mode:", error);
  }
}

// Play preview (30s)
export async function playPreview(url: string) {
  try {
    if (!url) {
      console.warn(" No preview URL provided");
      return;
    }

    // Stop any previous sound
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      currentSound = null;
    }

    // Initialize mode
    await initializeAudioMode();

    // Load and play sound
    console.log("🎵 Playing preview from:", url);
    const { sound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: true }
    );
    currentSound = sound;

    // Automatically release sound after it finishes
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
        currentSound = null;
      }
    });
  } catch (error) {
    console.error("💥 Error playing preview:", error);
  }
}

// Stop playback manually (optional)
export async function stopPreview() {
  try {
    if (currentSound) {
      console.log("⏹Stopping preview");
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      currentSound = null;
    }
  } catch (error) {
    console.error(" Error stopping preview:", error);
  }
}
