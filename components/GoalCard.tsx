import { View, Text, StyleSheet, Pressable } from "react-native";
import { Goal } from "../types/goal";

type Props = {
  goal: Goal;
  monthlySaving: number;
  onPress: () => void;
};

export default function GoalCard({ goal, monthlySaving, onPress }: Props) {
  const percent =
    goal.target_amount > 0
      ? Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100))
      : 0;

  const remaining = Math.max(0, goal.target_amount - goal.current_amount);

  const estimatedMonths =
    monthlySaving > 0 ? Math.ceil(remaining / monthlySaving) : null;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{goal.name}</Text>
          <Text style={styles.subtitle}>Deadline: {goal.deadline}</Text>
        </View>

        <View style={styles.percentBadge}>
          <Text style={styles.percentBadgeText}>{percent}%</Text>
        </View>
      </View>

      <View style={styles.amountRow}>
        <View>
          <Text style={styles.label}>Saved</Text>
          <Text style={styles.amount}>${goal.current_amount}</Text>
        </View>

        <View style={styles.rightAmountBox}>
          <Text style={styles.label}>Target</Text>
          <Text style={styles.amount}>${goal.target_amount}</Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percent}%` }]} />
      </View>

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.smallLabel}>Remaining</Text>
          <Text style={styles.remainingValue}>${remaining}</Text>
        </View>

        <View style={styles.etaBox}>
          <Text style={styles.smallLabel}>Estimated</Text>
          <Text style={styles.etaValue}>
            {estimatedMonths !== null
              ? `${estimatedMonths} month(s)`
              : "Not reachable yet"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748b",
  },
  percentBadge: {
    backgroundColor: "#eef2ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginLeft: 12,
  },
  percentBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#4f46e5",
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  rightAmountBox: {
    alignItems: "flex-end",
  },
  label: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  amount: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
    marginBottom: 16,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4f46e5",
    borderRadius: 999,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  smallLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  remainingValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  etaBox: {
    alignItems: "flex-end",
  },
  etaValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#16a34a",
  },
});