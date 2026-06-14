import type { AccentTone, BalanceSummary } from "./types";

/** Placeholder shown in place of monetary values when the balance is hidden. */
export const HIDDEN_VALUE = "$••••";

/** Currency used across the balance details surface. */
export const BALANCE_CURRENCY = "MXN";

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

/** Radial accent background applied to balance cards by tone. */
export const ACCENT_CLASS: Record<AccentTone, string> = {
  primary:
    "before:bg-[radial-gradient(circle_at_top_right,var(--primary)/12%,transparent_60%)]",
  destructive:
    "before:bg-[radial-gradient(circle_at_top_right,rgb(239_68_68/14%),transparent_60%)]",
  emerald:
    "before:bg-[radial-gradient(circle_at_top_right,rgb(16_185_129/14%),transparent_60%)]",
  amber:
    "before:bg-[radial-gradient(circle_at_top_right,rgb(245_158_11/14%),transparent_60%)]",
};
