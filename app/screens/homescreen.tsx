import { getHealthCheck } from "@/api/api";
//import { initializeAudioMode } from "@/library/musicPlayer";
import { initializeAudioMode } from "@/library/musicPlayer";
import * as AuthSession from "expo-auth-session";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Loginscreen from "./modals/loginscreen";

export default function HomeScreen() {
  useEffect(() => {
    getHealthCheck();
    initializeAudioMode();
    const redirectUri = AuthSession.makeRedirectUri({
      native: "putmeonapp://redirect",
      path: "redirect",
    });
    console.log("Redirect URI:", redirectUri);
  }, []);
  const [showLogin, setShowLogin] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PutMeOn!</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => setShowLogin(true)}
        >
          <Text style={styles.buttonText}>Log In / Sign Up</Text>
        </TouchableOpacity>
        {showLogin && (
          <Loginscreen
            visible={showLogin}
            onClose={() => setShowLogin(false)}
            onLogin={() => {
              setShowLogin(false); // close modal
              router.push("/actions"); // move to next page
            }}
          />
        )}
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push("/music")}
        >
          <Text style={styles.buttonText}>Use as Guest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7EC8E3",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 80,
  },
  buttonContainer: {
    width: "100%",
    gap: 20,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#0A84FF",
  },
  secondaryButton: {
    backgroundColor: "#003366",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
