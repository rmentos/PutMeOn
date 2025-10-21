import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function EditProfileModal({ visible, onClose }: any) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [likes, setLikes] = useState(127);
  const [followers, setFollowers] = useState(356);
  const [socialLinks, setSocialLinks] = useState<string[]>([""]);

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const handleSocialChange = (text: string, index: number) => {
    const updated = [...socialLinks];
    updated[index] = text;
    setSocialLinks(updated);
  };

  const addSocialBox = () => {
    setSocialLinks([...socialLinks, ""]);
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <View style={styles.modalBox}>
          <ScrollView>
            <Text style={styles.title}>Edit Profile</Text>

            <Text style={styles.label}>Username:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              placeholderTextColor="#ccc"
            />

            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Ionicons name="heart-outline" size={20} color="#1DB954" />
                <Text style={styles.statText}>{likes} Likes</Text>
              </View>
              <View style={styles.statBox}>
                <Ionicons name="people-outline" size={20} color="#1DB954" />
                <Text style={styles.statText}>{followers} Followers</Text>
              </View>
            </View>

            <Text style={[styles.label, { marginTop: 20 }]}>Social Links:</Text>

            {socialLinks.map((link, index) => (
              <View key={index} style={styles.socialRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter social link"
                  placeholderTextColor="#ccc"
                  value={link}
                  onChangeText={(text) => handleSocialChange(text, index)}
                />
                {link.trim().length > 0 && index === socialLinks.length - 1 && (
                  <TouchableOpacity onPress={addSocialBox}>
                    <Ionicons
                      name="add-circle-outline"
                      size={28}
                      color="#1DB954"
                      style={{ marginLeft: 8 }}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeText}>Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "80%",
  },
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
    maxHeight: "80%",
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    color: "#ccc",
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#333",
    color: "white",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    marginBottom: 15,
  },
  statBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    color: "white",
    fontSize: 16,
    marginLeft: 6,
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  closeBtn: {
    flex: 1,
    marginTop: 25,
    marginHorizontal: 10,
    backgroundColor: "#333",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  closeText: { color: "#fff", fontSize: 16 },
});
