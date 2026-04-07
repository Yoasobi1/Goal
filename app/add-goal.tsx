import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function AddGoalScreen() {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [note, setNote] = useState("");

  const handleSave = async () => {
    if (!name || !targetAmount || !currentAmount || !deadline) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert("Error", "No logged in user.");
      return;
    }

    const { error } = await supabase.from("goals").insert({
      user_id: user.id,
      name,
      target_amount: Number(targetAmount),
      current_amount: Number(currentAmount),
      deadline,
      note,
    });

    if (error) {
      Alert.alert("Save failed", error.message);
      return;
    }

    router.replace("/home");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Goal Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Target Amount"
        value={targetAmount}
        onChangeText={setTargetAmount}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Current Amount"
        value={currentAmount}
        onChangeText={setCurrentAmount}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Deadline (e.g. 2026-12-31)"
        value={deadline}
        onChangeText={setDeadline}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Note (optional)"
        value={note}
        onChangeText={setNote}
        multiline
      />

      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Goal</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9fafb",
    flexGrow: 1,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#4f46e5",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});