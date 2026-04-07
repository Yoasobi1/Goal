export type Transaction = {
  id: string;
  amount: number;
  note?: string;
  created_at: string;
};

export type Goal = {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  note?: string;
  created_at: string;
  lastCalculatedAt: string;
  transactions: Transaction[];
};