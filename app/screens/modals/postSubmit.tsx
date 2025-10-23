import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onGoHome: () => void;
  onAddMore: () => void;
};

export default function SuccessModal({
  visible,
  onClose,
  onGoHome,
  onAddMore,
}: Props) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>✅ Suggestion Added!</Text>
          <Text style={styles.message}>What would you like to do next?</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.homeButton]}
              onPress={onGoHome}
            >
              <Text style={styles.buttonText}>Go Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={onAddMore}
            >
              <Text style={styles.buttonText}>Add More</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#1e1e1e",
    width: "80%",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    elevation: 8,
  },
  title: {
    color: "#1DB954",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 25,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 6,
  },
  homeButton: {
    backgroundColor: "#333",
  },
  addButton: {
    backgroundColor: "#1DB954",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
