import type { BalanceSummary } from "./types";

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
