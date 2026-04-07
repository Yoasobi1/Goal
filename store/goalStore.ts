import { create } from "zustand";
import { Goal } from "../types/goal";

type GoalStore = {
  goals: Goal[];
  monthlyRevenue: number;
  monthlyExpense: number;
  setBudget: (revenue: number, expense: number) => void;
  addGoal: (goal: Omit<Goal, "id" | "created_at" | "transactions">) => void;
  addDeposit: (goalId: string, amount: number, note?: string) => void;
  deleteGoal: (goalId: string) => void;
};

export const useGoalStore = create<GoalStore>((set) => ({
  goals: [],
  monthlyRevenue: 0,
  monthlyExpense: 0,

  setBudget: (revenue, expense) =>
    set(() => ({
      monthlyRevenue: revenue,
      monthlyExpense: expense,
    })),

  addGoal: (goal) =>
    set((state) => ({
      goals: [
        ...state.goals,
        {
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          transactions: [],
          ...goal,
        },
      ],
    })),

  addDeposit: (goalId, amount, note) =>
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              current_amount: goal.current_amount + amount,
              transactions: [
                {
                  id: Date.now().toString(),
                  amount,
                  note,
                  created_at: new Date().toISOString(),
                },
                ...goal.transactions,
              ],
            }
          : goal
      ),
    })),

  deleteGoal: (goalId) =>
    set((state) => ({
      goals: state.goals.filter((goal) => goal.id !== goalId),
    })),
}));