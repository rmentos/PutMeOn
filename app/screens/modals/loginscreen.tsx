// app/screens/loginmodal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
} from "react-native";

export default function LoginModal({ visible, onClose, onLogin }: any) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>
            {isSignUp ? "Create Account" : "Login"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ccc"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ccc"
            secureTextEntry
          />
          {isSignUp && (
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#ccc"
              secureTextEntry
            />
          )}

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {
              onLogin(); // closes modal + goes to next page
            }}
          >
            <Text style={styles.actionText}>
              {isSignUp ? "Sign Up" : "Log In"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsSignUp(!isSignUp)}
            style={styles.switchBtn}
          >
            <Text style={styles.switchText}>
              {isSignUp
                ? "Already have an account? Log In"
                : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#1c1c1c",
    borderRadius: 20,
    padding: 25,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#333",
    color: "white",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },
  actionBtn: {
    backgroundColor: "#1DB954",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  actionText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  switchBtn: { marginTop: 15, alignItems: "center" },
  switchText: { color: "#1DB954", fontSize: 15 },
  closeBtn: {
    marginTop: 25,
    backgroundColor: "#333",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  closeText: { color: "#fff", fontSize: 16 },
});
