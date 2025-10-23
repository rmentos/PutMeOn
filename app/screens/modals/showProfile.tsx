import { db } from "@/src/firebase";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  userName: string; // recommender’s username
};

type UserData = {
  userName: string;
  likes: number;
  socials?: { platform: string; url: string }[];
};

export default function RecommenderProfileModal({
  visible,
  onClose,
  userName,
}: Props) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      fetchRecommenderData();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const fetchRecommenderData = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("userName", "==", userName)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0].data() as UserData;
        setUser(userDoc);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error fetching recommender profile:", err);
    }
  };

  if (!user) {
    return (
      <Modal transparent visible={visible} animationType="none">
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <View style={styles.modalBox}>
            <Text style={styles.title}>User not found</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    );
  }

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <View style={styles.modalBox}>
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <Text style={styles.title}>{user.userName}'s Profile</Text>

            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Ionicons name="heart-outline" size={20} color="#1DB954" />
                <Text style={styles.statText}>{user.likes ?? 0} Likes</Text>
              </View>
            </View>

            <Text style={[styles.label, { marginTop: 10 }]}>Socials:</Text>

            {user.socials && user.socials.length > 0 ? (
              user.socials.map((s, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.socialLink}
                  onPress={() => Linking.openURL(s.url)}
                >
                  <Text style={styles.socialText}>
                    {s.platform}: {s.url}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ color: "#888", marginTop: 8 }}>
                No social links shared.
              </Text>
            )}

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
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
    width: "85%",
    backgroundColor: "#1c1c1c",
    borderRadius: 20,
    padding: 25,
    maxHeight: "80%",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    color: "#ccc",
    fontSize: 16,
  },
  statBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  statText: {
    color: "white",
    fontSize: 16,
    marginLeft: 6,
  },
  statsContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  socialLink: {
    marginVertical: 5,
  },
  socialText: {
    color: "#1DB954",
    textDecorationLine: "underline",
  },
  closeBtn: {
    marginTop: 25,
    backgroundColor: "#333",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
  },
});
