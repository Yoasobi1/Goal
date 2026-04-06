import { router, useLocalSearchParams } from "expo-router";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useGoalStore } from "../store/goalStore";

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const goals = useGoalStore((state) => state.goals);
  const deleteGoal = useGoalStore((state) => state.deleteGoal);

  const goal = goals.find((item) => item.id === id);

  if (!goal) {
    return (
      <View style={styles.center}>
        <Text>Goal not found.</Text>
      </View>
    );
  }

  const percent = Math.min(
    100,
    Math.round((goal.current_amount / goal.target_amount) * 100)
  );

  const remaining = goal.target_amount - goal.current_amount;

  const handleDelete = () => {
    Alert.alert("Delete Goal", "Are you sure you want to delete this goal?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteGoal(goal.id);
          router.replace("/home");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{goal.name}</Text>
        <Text style={styles.text}>Target: ${goal.target_amount}</Text>
        <Text style={styles.text}>Saved: ${goal.current_amount}</Text>
        <Text style={styles.text}>Remaining: ${remaining}</Text>
        <Text style={styles.text}>Deadline: {goal.deadline}</Text>

        <View style={styles.barBackground}>
          <View style={[styles.barFill, { width: `${percent}%` }]} />
        </View>

        <Text style={styles.percent}>{percent}% completed</Text>

        {goal.note ? <Text style={styles.note}>Note: {goal.note}</Text> : null}
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={() =>
          router.push({
            pathname: "/add-deposit",
            params: { id: goal.id },
          })
        }
      >
        <Text style={styles.primaryButtonText}>+ Add Deposit</Text>
      </Pressable>

      <Pressable style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Goal</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Transactions</Text>

      <FlatList
        data={goal.transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionCard}>
            <Text style={styles.transactionAmount}>+ ${item.amount}</Text>
            <Text style={styles.transactionDate}>
              {new Date(item.created_at).toLocaleString()}
            </Text>
            {item.note ? <Text style={styles.transactionNote}>{item.note}</Text> : null}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions yet.</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f3f4f6",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    marginBottom: 6,
    color: "#444",
  },
  barBackground: {
    height: 10,
    backgroundColor: "#e5e7eb",
    borderRadius: 999,
    marginTop: 12,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#4f46e5",
  },
  percent: {
    marginTop: 8,
    fontWeight: "600",
    color: "#4f46e5",
  },
  note: {
    marginTop: 10,
    color: "#555",
  },
  primaryButton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
  deleteButton: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#ef4444",
  },
  deleteButtonText: {
    color: "#ef4444",
    textAlign: "center",
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  transactionCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#16a34a",
  },
  transactionDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  transactionNote: {
    marginTop: 6,
    color: "#444",
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});