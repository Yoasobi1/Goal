import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useGoalStore } from "../store/goalStore";
import { supabase } from "../lib/supabase";

export default function BudgetSettingsScreen() {
  const monthlyRevenue = useGoalStore((state) => state.monthlyRevenue);
  const monthlyExpense = useGoalStore((state) => state.monthlyExpense);
  const setBudget = useGoalStore((state) => state.setBudget);

  const [revenue, setRevenue] = useState(String(monthlyRevenue || ""));
  const [expense, setExpense] = useState(String(monthlyExpense || ""));

  const handleSave = async () => {
    if (!revenue || !expense) {
      Alert.alert("Error", "Please fill in revenue and expense.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert("Error", "No logged in user.");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        monthly_revenue: Number(revenue),
        monthly_expense: Number(expense),
      })
      .eq("id", user.id);

    if (error) {
      Alert.alert("Save failed", error.message);
      return;
    }

    setBudget(Number(revenue), Number(expense));
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Budget Settings</Text>
      <Text style={styles.subtitle}>
        Set your monthly income and spending.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Monthly Revenue"
        value={revenue}
        onChangeText={setRevenue}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Monthly Expense"
        value={expense}
        onChangeText={setExpense}
        keyboardType="numeric"
      />

      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Budget</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 24,
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