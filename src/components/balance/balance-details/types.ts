export type AccentTone = "primary" | "destructive" | "emerald" | "amber";

export type FlowTone = "emerald" | "amber";

export type RingTone = "emerald" | "amber" | "destructive";

export type IncomeExpensePoint = {
  expense: number;
  income: number;
  label: string;
  net: number;
};

export type BalanceSummary = {
  latestPoint: IncomeExpensePoint | null;
  recentPoints: IncomeExpensePoint[];
  totalExpenses: number;
  totalIncome: number;
  trendDelta: number | null;
  trendPercent: number | null;
  avgNet: number;
  savingsRate: number | null;
  bestPoint: IncomeExpensePoint | null;
  worstPoint: IncomeExpensePoint | null;
  positiveStreak: number;
  runwayMonths: number | null;
  expenseBurnRate: number;
};
