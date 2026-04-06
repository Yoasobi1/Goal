import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import GoalCard from "../components/GoalCard";
import { useGoalStore } from "../store/goalStore";

export default function HomeScreen() {
  const goals = useGoalStore((state) => state.goals);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.addButton}
        onPress={() => router.push("/add-goal")}
      >
        <Text style={styles.addButtonText}>+ Add Goal</Text>
      </Pressable>

      {goals.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No saving goals yet.</Text>
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
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f3f4f6",
  },
  addButton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  addButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
  emptyBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
  },
});