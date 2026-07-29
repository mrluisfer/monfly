import type { BalanceSummary } from "./types";

/** Placeholder shown in place of monetary values when the balance is hidden. */
export const HIDDEN_VALUE = "$••••";

export const EMPTY_SUMMARY: BalanceSummary = {
  latestPoint: null,
  recentPoints: [],
  totalExpenses: 0,
  totalIncome: 0,
  trendDelta: null,
  trendPercent: null,
  avgNet: 0,
  savingsRate: null,
  bestPoint: null,
  worstPoint: null,
  positiveStreak: 0,
  runwayMonths: null,
  expenseBurnRate: 0,
};
