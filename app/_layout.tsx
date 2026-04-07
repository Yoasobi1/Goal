import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="home" options={{ title: "My Saving Goals" }} />
      <Stack.Screen name="add-goal" options={{ title: "Add Goal" }} />
      <Stack.Screen name="goal-detail" options={{ title: "Goal Detail" }} />
      <Stack.Screen name="add-deposit" options={{ title: "Add Deposit" }} />
      <Stack.Screen
        name="budget-settings"
        options={{ title: "Budget Settings" }}
      />
    </Stack>
  );
}