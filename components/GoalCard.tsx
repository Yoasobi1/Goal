import { Pressable, StyleSheet, Text, View } from "react-native";
import { Goal } from "../types/goal";

type Props = {
  goal: Goal;
  onPress: () => void;
};

export default function GoalCard({ goal, onPress }: Props) {
  const percent = Math.min(
    100,
    Math.round((goal.current_amount / goal.target_amount) * 100)
  );

  const remaining = goal.target_amount - goal.current_amount;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{goal.name}</Text>
      <Text style={styles.text}>
        ${goal.current_amount} / ${goal.target_amount}
      </Text>
      <Text style={styles.text}>Remaining: ${remaining}</Text>
      <Text style={styles.text}>Deadline: {goal.deadline}</Text>

      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${percent}%` }]} />
      </View>

      <Text style={styles.percent}>{percent}%</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
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
    borderRadius: 999,
  },
  percent: {
    marginTop: 8,
    fontWeight: "600",
    color: "#4f46e5",
  },
});