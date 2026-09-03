export type { Tone } from "~/components/shared/tone";

export interface IncomeExpensePoint {
  expense: number;
  income: number;
  label: string;
  net: number;
}

export interface BalanceSummary {
  avgNet: number;
  bestPoint: IncomeExpensePoint | null;
  expenseBurnRate: number;
  latestPoint: IncomeExpensePoint | null;
  positiveStreak: number;
  recentPoints: IncomeExpensePoint[];
  runwayMonths: number | null;
  savingsRate: number | null;
  totalExpenses: number;
  totalIncome: number;
  trendDelta: number | null;
  trendPercent: number | null;
  worstPoint: IncomeExpensePoint | null;
}
