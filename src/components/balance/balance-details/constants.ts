import type { BalanceSummary } from "./types";

export const EMPTY_SUMMARY: BalanceSummary = {
  avgNet: 0,
  bestPoint: null,
  expenseBurnRate: 0,
  latestPoint: null,
  positiveStreak: 0,
  recentPoints: [],
  runwayMonths: null,
  savingsRate: null,
  totalExpenses: 0,
  totalIncome: 0,
  trendDelta: null,
  trendPercent: null,
  worstPoint: null,
};
