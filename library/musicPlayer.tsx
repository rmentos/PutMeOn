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
      console.warn("No preview URL provided");
      return;
    }

    // stop & unload any previously playing audio FIRST
    if (currentSound) {
      try {
        await currentSound.stopAsync();
      } catch (e) {
        console.log(" Sound already stopped");
      }
      try {
        await currentSound.unloadAsync();
      } catch (e) {
        console.log("Sound already unloaded");
      }
      currentSound = null;
    }

    // ensure audio mode is active before playing
    await initializeAudioMode();

    console.log("Playing preview from:", url);

    // load new audio
    const { sound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: true }
    );
    currentSound = sound;

    // auto-release when finished
    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.isLoaded && status.didJustFinish) {
        try {
          await sound.unloadAsync();
        } catch (err) {
          console.warn("⚠️ Error unloading finished sound:", err);
        }
        if (currentSound === sound) {
          currentSound = null;
        }
      }
    });
  } catch (error) {
    console.error("Error playing preview:", error);
    // graceful cleanup if something breaks mid-load
    if (currentSound) {
      try {
        await currentSound.unloadAsync();
      } catch {}
      currentSound = null;
    }
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
