import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { router } from "expo-router";

export default function ChooseActionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back 👋</Text>
      <Text style={styles.subtitle}>What would you like to do today?</Text>

      {/* Buttons section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.listenButton]}
          onPress={() => router.push("/music")}
        >
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/727/727245.png",
            }}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Discover Music</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.addButton]}
          onPress={() => router.push("/suggestion")}
        >
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/992/992651.png",
            }}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Add a Suggestion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 40,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    gap: 25,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 14,
  },
  listenButton: {
    backgroundColor: "#1DB954",
  },
  addButton: {
    backgroundColor: "#333",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  icon: {
    width: 28,
    height: 28,
    marginRight: 10,
    tintColor: "white",
  },
});
