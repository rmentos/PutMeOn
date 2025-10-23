// app/screens/loginmodal.tsx
import { logIn, signUp } from "@/api/api";
import { saveUser } from "@/src/storage";

import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginModal({ visible, onClose, onLogin }: any) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleAction = async () => {
    if (isSignUp) {
      if (password !== confirm) {
        Alert.alert("Passwords do not match!");
        return;
      }
      const result = await signUp(userName, password);
      if (result.success) {
        Alert.alert("Account created successfully!");
        await saveUser(result.user);
        onLogin();
      } else {
        Alert.alert(result.message || "Error creating account");
      }
    } else {
      const result = await logIn(userName, password);
      if (result.success) {
        Alert.alert("Welcome back!");
        await saveUser(result.user);
        onLogin();
      } else {
        Alert.alert(result.message || "Invalid credentials");
      }
    }
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>
            {isSignUp ? "Create Account" : "Login"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#ccc"
            value={userName}
            onChangeText={setUserName}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ccc"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {isSignUp && (
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#ccc"
              secureTextEntry
              value={confirm}
              onChangeText={setConfirm}
            />
          )}

          <TouchableOpacity style={styles.actionBtn} onPress={handleAction}>
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
