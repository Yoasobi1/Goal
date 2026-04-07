import { router } from "expo-router";
import { useEffect, useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import GoalCard from "../components/GoalCard";
import { useGoalStore } from "../store/goalStore";
import { supabase } from "../lib/supabase";

export default function HomeScreen() {
  const goals = useGoalStore((state) => state.goals);
  const monthlyRevenue = useGoalStore((state) => state.monthlyRevenue);
  const monthlyExpense = useGoalStore((state) => state.monthlyExpense);
  const runMonthlySettlement = useGoalStore((state) => state.runMonthlySettlement);

  useEffect(() => {
    runMonthlySettlement();
  }, []);

  const monthlySaving = monthlyRevenue - monthlyExpense;
  const totalSaved = goals.reduce((sum, goal) => sum + goal.current_amount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target_amount, 0);

  const goalStats = useMemo(() => {
    return goals.map((goal) => {
      const remaining = Math.max(0, goal.target_amount - goal.current_amount);
      const estimatedMonths =
        monthlySaving > 0 ? Math.ceil(remaining / monthlySaving) : null;

      return {
        ...goal,
        remaining,
        estimatedMonths,
      };
    });
  }, [goals, monthlySaving]);

  const closestGoal = useMemo(() => {
    const validGoals = goalStats.filter(
      (goal) => goal.estimatedMonths !== null && goal.remaining > 0
    );

    if (validGoals.length === 0) return null;

    return validGoals.reduce((prev, current) =>
      (current.estimatedMonths ?? Infinity) < (prev.estimatedMonths ?? Infinity)
        ? current
        : prev
    );
  }, [goalStats]);

  const atRiskGoal = useMemo(() => {
    const validGoals = goalStats.filter(
      (goal) => goal.estimatedMonths !== null && goal.remaining > 0
    );

    if (validGoals.length === 0) return null;

    return validGoals.reduce((prev, current) =>
      (current.estimatedMonths ?? -1) > (prev.estimatedMonths ?? -1)
        ? current
        : prev
    );
  }, [goalStats]);

  const completedGoals = goals.filter(
    (goal) => goal.current_amount >= goal.target_amount
  ).length;

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert("Logout failed: " + error.message);
      return;
    }

    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerTextWrap}>
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.title}>Savings Dashboard</Text>
            <Text style={styles.subtitle}>
              Track your goals, budget, and estimated completion time.
            </Text>
          </View>

          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </Pressable>
        </View>

        <View style={styles.headerButtons}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push("/add-goal")}
          >
            <Text style={styles.primaryButtonText}>+ Add Goal</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push("/budget-settings")}
          >
            <Text style={styles.secondaryButtonText}>Budget Settings</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Goals</Text>
          <Text style={styles.statValue}>{goals.length}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Saved</Text>
          <Text style={styles.statValue}>${totalSaved}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Completed</Text>
          <Text style={styles.statValue}>{completedGoals}</Text>
        </View>
      </View>

      <View style={styles.budgetCard}>
        <View style={styles.budgetLeft}>
          <Text style={styles.budgetTitle}>Monthly Budget</Text>
          <Text style={styles.budgetText}>Revenue: ${monthlyRevenue}</Text>
          <Text style={styles.budgetText}>Expense: ${monthlyExpense}</Text>
        </View>

        <View
          style={[
            styles.netBadge,
            monthlySaving >= 0 ? styles.netPositive : styles.netNegative,
          ]}
        >
          <Text
            style={[
              styles.netBadgeLabel,
              monthlySaving >= 0 ? styles.netPositiveText : styles.netNegativeText,
            ]}
          >
            Net Saving
          </Text>
          <Text
            style={[
              styles.netBadgeValue,
              monthlySaving >= 0 ? styles.netPositiveText : styles.netNegativeText,
            ]}
          >
            ${monthlySaving}
          </Text>
        </View>
      </View>

      <View style={styles.insightsRow}>
        <View style={styles.insightCard}>
          <Text style={styles.insightLabel}>Closest Goal</Text>
          <Text style={styles.insightTitle}>
            {closestGoal ? closestGoal.name : "No active goal"}
          </Text>
          <Text style={styles.insightText}>
            {closestGoal?.estimatedMonths !== null && closestGoal
              ? `${closestGoal.estimatedMonths} month(s) left`
              : "Set budget to estimate"}
          </Text>
        </View>

        <View style={styles.insightCard}>
          <Text style={styles.insightLabel}>Needs Attention</Text>
          <Text style={styles.insightTitle}>
            {atRiskGoal ? atRiskGoal.name : "All good"}
          </Text>
          <Text style={styles.insightText}>
            {atRiskGoal?.estimatedMonths !== null && atRiskGoal
              ? `${atRiskGoal.estimatedMonths} month(s) needed`
              : "No delayed goal"}
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Goals</Text>
        <Text style={styles.sectionSubText}>Total Target: ${totalTarget}</Text>
      </View>

      {goals.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>🎯</Text>
          <Text style={styles.emptyTitle}>No saving goals yet</Text>
          <Text style={styles.emptyText}>
            Create your first goal and start tracking your savings progress.
          </Text>

          <Pressable
            style={styles.emptyButton}
            onPress={() => router.push("/add-goal")}
          >
            <Text style={styles.emptyButtonText}>Create First Goal</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={goals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GoalCard
              goal={item}
              monthlySaving={monthlySaving}
              onPress={() =>
                router.push({
                  pathname: "/goal-detail",
                  params: { id: item.id },
                })
              }
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerCard: {
    backgroundColor: "#4f46e5",
    borderRadius: 28,
    padding: 20,
    marginBottom: 18,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  greeting: {
    color: "#c7d2fe",
    fontSize: 14,
    marginBottom: 6,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    color: "#e0e7ff",
    fontSize: 14,
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: "rgba(255,255,255,0.16)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#4f46e5",
    fontWeight: "800",
    fontSize: 15,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#6366f1",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#c7d2fe",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statLabel: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
  budgetCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  budgetLeft: {
    flex: 1,
    paddingRight: 12,
  },
  budgetTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 8,
  },
  budgetText: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 4,
  },
  netBadge: {
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    minWidth: 120,
  },
  netPositive: {
    backgroundColor: "#ecfdf5",
  },
  netNegative: {
    backgroundColor: "#fef2f2",
  },
  netBadgeLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  netBadgeValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  netPositiveText: {
    color: "#16a34a",
  },
  netNegativeText: {
    color: "#dc2626",
  },
  insightsRow: {
    flexDirection: "row",
    marginBottom: 18,
    gap: 10,
  },
  insightCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  insightLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 6,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 6,
  },
  insightText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },
  sectionHeader: {
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
  },
  sectionSubText: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 42,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 18,
  },
  emptyButton: {
    backgroundColor: "#4f46e5",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
  },
  emptyButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});