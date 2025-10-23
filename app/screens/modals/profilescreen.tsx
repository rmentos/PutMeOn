import { User } from "@/api/api";
import { db } from "@/src/firebase";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditProfileModal({ visible, onClose }: any) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [user, setUser] = useState<User | null>(null);
  const [socialLinks, setSocialLinks] = useState<string[]>([""]);
  const [followers, setFollowers] = useState(356);

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      loadUserData();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const loadUserData = async () => {
    try {
      const json = await AsyncStorage.getItem("user");
      if (json) {
        const storedUser: User = JSON.parse(json);
        setUser(storedUser);
        const loadedSocials =
          storedUser.socials?.map((s) => s.url).filter(Boolean) || [];
        setSocialLinks(loadedSocials.length > 0 ? loadedSocials : [""]);
      }
    } catch (err) {
      console.error("Error loading user:", err);
      setSocialLinks([""]);
    }
  };

  const handleSocialChange = (text: string, index: number) => {
    const updated = [...socialLinks];
    updated[index] = text;
    setSocialLinks(updated);
  };

  const addSocialBox = () => {
    if (socialLinks.length >= 3) return;
    setSocialLinks([...socialLinks, ""]);
  };

  const handleSave = async () => {
    if (!user) return;

    // Prepare updated socials array
    const updatedSocials = socialLinks
      .filter((link) => link.trim().length > 0)
      .map((link) => ({ platform: "other" as const, url: link }));

    const updatedUser = { ...user, socials: updatedSocials };

    try {
      const q = query(
        collection(db, "users"),
        where("userName", "==", user.userName)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        const userRef = doc(db, "users", userDoc.id);
        await updateDoc(userRef, {
          socials: updatedSocials,
        });
        console.log("Firestore updated successfully!");
      } else {
        console.warn("User not found in Firestore");
      }

      // Save locally as well (for instant UI update)
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      onClose();
    } catch (err) {
      console.error("Error updating Firestore:", err);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <View style={styles.modalBox}>
          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.title}>View Profile</Text>

            <Text style={styles.label}>{user?.userName || "Loading..."}</Text>

            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Ionicons name="heart-outline" size={20} color="#1DB954" />
                <Text style={styles.statText}>{user?.likes ?? 0} Likes</Text>
              </View>
              <View style={styles.statBox}>
                <Ionicons name="people-outline" size={20} color="#1DB954" />
                <Text style={styles.statText}>{followers} Followers</Text>
              </View>
            </View>

            <Text style={[styles.label, { marginTop: 15 }]}>Social Links:</Text>
            {socialLinks.map((link, index) => (
              <TextInput
                key={index}
                style={styles.input}
                placeholder="Enter social link"
                placeholderTextColor="#ccc"
                value={link}
                onChangeText={(text) => handleSocialChange(text, index)}
              />
            ))}

            {/* Buttons Row */}
            <View style={styles.bottomRow}>
              <TouchableOpacity
                style={[styles.actionBtn, { flex: 1 }]}
                onPress={onClose}
              >
                <Text style={styles.actionText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.addBtn, { flex: 1.4 }]}
                onPress={addSocialBox}
              >
                <Text style={styles.addText}>Add Social Link</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { flex: 1 }]}
                onPress={handleSave}
              >
                <Text style={styles.actionText}>Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    width: "90%",
    backgroundColor: "#1c1c1c",
    borderRadius: 20,
    padding: 20,
    maxHeight: "85%",
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
    fontSize: 14,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#333",
    color: "white",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
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
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  actionBtn: {
    backgroundColor: "#333",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 4,
  },
  actionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#262626",
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  addText: {
    color: "#1DB954",
    fontSize: 13,
    marginLeft: 6,
    fontWeight: "500",
  },
});
