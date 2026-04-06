import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import GoalCard from "../components/GoalCard";
import { useGoalStore } from "../store/goalStore";

export default function HomeScreen() {
  const goals = useGoalStore((state) => state.goals);

  const totalSaved = goals.reduce((sum, goal) => sum + goal.current_amount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target_amount, 0);

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.smallTitle}>Welcome back</Text>
        <Text style={styles.mainTitle}>My Saving Goals</Text>
        <Text style={styles.subTitle}>
          Track your goals and grow your savings step by step.
        </Text>

        <Pressable
          style={styles.addButton}
          onPress={() => router.push("/add-goal")}
        >
          <Text style={styles.addButtonText}>+ Add New Goal</Text>
        </Pressable>
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
          <Text style={styles.statLabel}>Target</Text>
          <Text style={styles.statValue}>${totalTarget}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Your Goals</Text>

      {goals.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>🎯</Text>
          <Text style={styles.emptyTitle}>No saving goals yet</Text>
          <Text style={styles.emptyText}>
            Start by creating your first saving goal.
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
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
  },
  smallTitle: {
    color: "#c7d2fe",
    fontSize: 14,
    marginBottom: 6,
  },
  mainTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  subTitle: {
    color: "#e0e7ff",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  addButton: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
  },
  addButtonText: {
    color: "#4f46e5",
    fontWeight: "700",
    fontSize: 15,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 12,
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