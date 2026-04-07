import { create } from "zustand";
import { Goal } from "../types/goal";

type GoalStore = {
  goals: Goal[];
  monthlyRevenue: number;
  monthlyExpense: number;
  setBudget: (revenue: number, expense: number) => void;
  setGoals: (goals: Goal[]) => void;
  setAllData: (data: {
    goals: Goal[];
    monthlyRevenue: number;
    monthlyExpense: number;
  }) => void;
  addGoal: (goal: Omit<Goal, "id" | "created_at" | "transactions" | "lastCalculatedAt">) => void;
  addDeposit: (goalId: string, amount: number, note?: string) => void;
  deleteGoal: (goalId: string) => void;
  runMonthlySettlement: () => void;
};

function getFullMonthsPassed(fromDate: Date, toDate: Date) {
  let months =
    (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
    (toDate.getMonth() - fromDate.getMonth());

  if (toDate.getDate() < fromDate.getDate()) {
    months -= 1;
  }

  return Math.max(0, months);
}

function addMonths(date: Date, months: number) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export const useGoalStore = create<GoalStore>((set, get) => ({
  goals: [],
  monthlyRevenue: 0,
  monthlyExpense: 0,

  setBudget: (revenue, expense) =>
    set({
      monthlyRevenue: revenue,
      monthlyExpense: expense,
    }),

  setGoals: (goals) => set({ goals }),

  setAllData: ({ goals, monthlyRevenue, monthlyExpense }) =>
    set({
      goals,
      monthlyRevenue,
      monthlyExpense,
    }),

  addGoal: (goal) =>
    set((state) => ({
      goals: [
        ...state.goals,
        {
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          lastCalculatedAt: new Date().toISOString(),
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

  runMonthlySettlement: () => {
    const { monthlyRevenue, monthlyExpense, goals } = get();
    const monthlySaving = monthlyRevenue - monthlyExpense;

    if (monthlySaving <= 0) return;

    const now = new Date();

    const updatedGoals = goals.map((goal) => {
      const lastCalculated = new Date(goal.lastCalculatedAt);
      const passedMonths = getFullMonthsPassed(lastCalculated, now);

      if (passedMonths <= 0) return goal;

      const addedAmount = passedMonths * monthlySaving;
      const newCurrentAmount = Math.min(
        goal.target_amount,
        goal.current_amount + addedAmount
      );

      const newLastCalculatedAt = addMonths(lastCalculated, passedMonths);

      return {
        ...goal,
        current_amount: newCurrentAmount,
        lastCalculatedAt: newLastCalculatedAt.toISOString(),
        transactions: [
          {
            id: `${Date.now()}-${goal.id}`,
            amount: addedAmount,
            note: `Automatic monthly settlement (${passedMonths} month${
              passedMonths > 1 ? "s" : ""
            })`,
            created_at: now.toISOString(),
          },
          ...goal.transactions,
        ],
      };
    });

    set({ goals: updatedGoals });
  },
}));