import { EMPTY_SUMMARY } from "./constants";
import type { BalanceSummary, IncomeExpensePoint } from "./types";

/** Number of most recent periods considered for the summary. */
const RECENT_PERIODS = 6;

interface RawPoint {
  expense?: unknown;
  income?: unknown;
  month?: unknown;
}

function toFiniteNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toIncomeExpensePoint(item: RawPoint): IncomeExpensePoint {
  const income = toFiniteNumber(item.income);
  const expense = toFiniteNumber(item.expense);
  return {
    expense,
    income,
    label: String(item.month ?? "Period"),
    net: income - expense,
  };
}

/**
 * Derives the balance summary (totals, trend, savings rate, runway, etc.) from
 * the raw income/expense series. Pure and side-effect free so it can be unit
 * tested in isolation.
 */
export function deriveBalanceSummary(
  rawPoints: unknown,
  balanceValue: number,
): BalanceSummary {
  if (!Array.isArray(rawPoints) || rawPoints.length === 0) {
    return EMPTY_SUMMARY;
  }

  const recentPoints = rawPoints
    .slice(-RECENT_PERIODS)
    .map((item: RawPoint) => toIncomeExpensePoint(item));

  let totalIncome = 0;
  let totalExpenses = 0;
  let bestPoint: IncomeExpensePoint | null = null;
  let worstPoint: IncomeExpensePoint | null = null;
  for (const point of recentPoints) {
    totalIncome += point.income;
    totalExpenses += point.expense;
    if (!bestPoint || point.net > bestPoint.net) {
      bestPoint = point;
    }
    if (!worstPoint || point.net < worstPoint.net) {
      worstPoint = point;
    }
  }

  const latestPoint = recentPoints.at(-1) ?? null;
  const previousPoint = recentPoints.at(-2) ?? null;
  const trendDelta =
    latestPoint && previousPoint ? latestPoint.net - previousPoint.net : null;
  const trendPercent =
    latestPoint && previousPoint && previousPoint.net !== 0
      ? ((latestPoint.net - previousPoint.net) / Math.abs(previousPoint.net)) *
        100
      : null;

  const avgNet =
    recentPoints.length > 0
      ? (totalIncome - totalExpenses) / recentPoints.length
      : 0;
  const expenseBurnRate =
    recentPoints.length > 0 ? totalExpenses / recentPoints.length : 0;

  const savingsRate =
    totalIncome > 0 ? (totalIncome - totalExpenses) / totalIncome : null;

  let positiveStreak = 0;
  for (let i = recentPoints.length - 1; i >= 0; i -= 1) {
    if (recentPoints[i].net >= 0) {
      positiveStreak += 1;
    } else {
      break;
    }
  }

  const runwayMonths =
    avgNet < 0 && balanceValue > 0 ? balanceValue / Math.abs(avgNet) : null;

  return {
    avgNet,
    bestPoint,
    expenseBurnRate,
    latestPoint,
    positiveStreak,
    recentPoints,
    runwayMonths,
    savingsRate,
    totalExpenses,
    totalIncome,
    trendDelta,
    trendPercent,
    worstPoint,
  };
}
