import { useMemo } from "react";
import { cn } from "~/lib/utils";
import { TransactionWithUser } from "~/types/TransactionWithUser";
import { formatCurrency } from "~/utils/format-currency";
import { ShieldCheckIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { ExpenseConcentrationCard } from "./insights/ExpenseConcentrationCard";
import { ImprovementIdeasCard } from "./insights/ImprovementIdeasCard";
import { InsightErrorBoundary } from "./insights/InsightErrorBoundary";
import { NetMomentumCard } from "./insights/NetMomentumCard";

type TransactionsInsightsProps = {
  transactions: TransactionWithUser[];
  className?: string;
};

type InsightTone = "positive" | "warning" | "neutral";

type InsightNote = {
  id: string;
  detail: string;
  title: string;
  tone: InsightTone;
};

type NormalizedTransaction = {
  amount: number;
  category: string;
  description: string;
  timestamp: number;
  type: "expense" | "income";
};

type MonthlyPoint = {
  count: number;
  expense: number;
  income: number;
  label: string;
  net: number;
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function safeText(input: string | null | undefined, maxLength = 56): string {
  if (!input) return "Unlabeled";
  const normalized = input
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return "Unlabeled";
  return normalized.length > maxLength
    ? `${normalized.slice(0, maxLength).trim()}...`
    : normalized;
}

function buildSparklinePoints(values: number[]) {
  if (!values.length) return null;

  const width = 430;
  const height = 150;
  const padding = 12;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values
    .map((value, index) => {
      const x =
        padding +
        (index * (width - padding * 2)) / Math.max(values.length - 1, 1);
      const y =
        height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const lastPoint = points.split(" ").at(-1)?.split(",") ?? ["0", "0"];

  return { height, lastPoint, padding, points, width };
}

export function TransactionsInsights({
  transactions,
  className,
}: TransactionsInsightsProps) {
  const insights = useMemo(() => {
    const now = Date.now();
    const last30Start = now - 30 * ONE_DAY_MS;

    const normalized: NormalizedTransaction[] = transactions
      .map((transaction) => {
        const timestamp = new Date(transaction.date).getTime();
        const rawType = String(transaction.type || "").toLowerCase();

        if (!Number.isFinite(timestamp)) {
          return null;
        }

        return {
          amount: Number.isFinite(transaction.amount)
            ? Math.max(0, transaction.amount)
            : 0,
          category: safeText(transaction.category || "Uncategorized", 28),
          description: safeText(transaction.description, 72),
          timestamp,
          type: rawType === "income" ? "income" : "expense",
        } satisfies NormalizedTransaction;
      })
      .filter((item): item is NormalizedTransaction => Boolean(item));

    if (!normalized.length) {
      return null;
    }

    const monthlyMap = new Map<
      string,
      {
        count: number;
        expense: number;
        income: number;
        label: string;
        monthStart: number;
      }
    >();

    const monthAnchor = new Date(now);
    monthAnchor.setDate(1);
    monthAnchor.setHours(0, 0, 0, 0);

    for (let index = 5; index >= 0; index -= 1) {
      const pointDate = new Date(monthAnchor);
      pointDate.setMonth(monthAnchor.getMonth() - index);
      const key = `${pointDate.getFullYear()}-${pointDate.getMonth() + 1}`;

      monthlyMap.set(key, {
        count: 0,
        expense: 0,
        income: 0,
        label: pointDate.toLocaleDateString("en-US", {
          month: "short",
        }),
        monthStart: pointDate.getTime(),
      });
    }

    const expenseByCategory = new Map<string, number>();
    const descriptionFrequency = new Map<string, number>();

    let latestTimestamp = 0;
    let latestDescription = "No description";
    let missingDescriptionCount = 0;

    let totalIncome = 0;
    let totalExpense = 0;
    let incomeLast30 = 0;
    let expenseLast30 = 0;

    for (const transaction of normalized) {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      } else {
        totalExpense += transaction.amount;
        expenseByCategory.set(
          transaction.category,
          (expenseByCategory.get(transaction.category) ?? 0) +
            transaction.amount
        );
      }

      if (transaction.timestamp >= last30Start) {
        if (transaction.type === "income") {
          incomeLast30 += transaction.amount;
        } else {
          expenseLast30 += transaction.amount;
        }
      }

      if (transaction.timestamp > latestTimestamp) {
        latestTimestamp = transaction.timestamp;
        latestDescription = transaction.description || "No description";
      }

      if (
        !transaction.description ||
        transaction.description.toLowerCase() === "unlabeled" ||
        transaction.description.toLowerCase() === "no description"
      ) {
        missingDescriptionCount += 1;
      }

      const cleanedDescription = transaction.description.toLowerCase();
      if (
        cleanedDescription !== "unlabeled" &&
        cleanedDescription.length >= 4
      ) {
        descriptionFrequency.set(
          cleanedDescription,
          (descriptionFrequency.get(cleanedDescription) ?? 0) + 1
        );
      }

      const monthDate = new Date(transaction.timestamp);
      monthDate.setDate(1);
      monthDate.setHours(0, 0, 0, 0);
      const monthKey = `${monthDate.getFullYear()}-${monthDate.getMonth() + 1}`;
      const bucket = monthlyMap.get(monthKey);

      if (!bucket) continue;

      if (transaction.type === "income") {
        bucket.income += transaction.amount;
      } else {
        bucket.expense += transaction.amount;
      }
      bucket.count += 1;
    }

    const monthlyPoints: MonthlyPoint[] = Array.from(monthlyMap.values())
      .sort((left, right) => left.monthStart - right.monthStart)
      .map((item) => ({
        count: item.count,
        expense: item.expense,
        income: item.income,
        label: item.label,
        net: item.income - item.expense,
      }));

    const topCategories = Array.from(expenseByCategory.entries())
      .sort((left, right) => right[1] - left[1])
      .slice(0, 4)
      .map(([category, amount]) => ({
        amount,
        category,
        share: totalExpense > 0 ? amount / totalExpense : 0,
      }));

    const repeatedDescription = Array.from(descriptionFrequency.entries())
      .sort((left, right) => right[1] - left[1])
      .find(([, count]) => count >= 3);

    const savingsRate =
      totalIncome > 0 ? (totalIncome - totalExpense) / totalIncome : null;
    const missingDescriptionRate = missingDescriptionCount / normalized.length;
    const topCategory = topCategories[0];
    const netLast30 = incomeLast30 - expenseLast30;

    const notes: InsightNote[] = [];

    if (savingsRate === null && totalExpense > 0) {
      notes.push({
        id: "no-income",
        detail:
          "You have expenses recorded but no income yet. Consider registering your income streams for better planning.",
        title: "Missing income baseline",
        tone: "warning",
      });
    } else if (savingsRate !== null) {
      if (savingsRate < 0) {
        notes.push({
          id: "negative-savings",
          detail: `Expenses are above income by ${formatCurrency(Math.abs(totalIncome - totalExpense), "USD")}.`,
          title: "Negative savings trend",
          tone: "warning",
        });
      } else if (savingsRate < 0.15) {
        notes.push({
          id: "low-savings",
          detail: `Savings rate is ${Math.round(savingsRate * 100)}%. You could target 20%+ for better buffer.`,
          title: "Low savings buffer",
          tone: "neutral",
        });
      } else {
        notes.push({
          id: "healthy-savings",
          detail: `Savings rate is ${Math.round(savingsRate * 100)}%, which is a healthy range.`,
          title: "Solid savings behavior",
          tone: "positive",
        });
      }
    }

    if (topCategory && topCategory.share >= 0.4) {
      notes.push({
        id: "category-concentration",
        detail: `${topCategory.category} represents ${Math.round(topCategory.share * 100)}% of total expenses.`,
        title: "High category concentration",
        tone: "neutral",
      });
    }

    if (missingDescriptionRate >= 0.35) {
      notes.push({
        id: "data-quality",
        detail: `${Math.round(missingDescriptionRate * 100)}% of transactions have generic or missing descriptions.`,
        title: "Improve data quality",
        tone: "neutral",
      });
    }

    if (repeatedDescription) {
      notes.push({
        id: "recurring-clue",
        detail: `"${safeText(repeatedDescription[0], 42)}" appears ${repeatedDescription[1]} times. This may be recurring.`,
        title: "Recurring payment clue",
        tone: "neutral",
      });
    }

    if (!notes.length) {
      notes.push({
        id: "stable-default",
        detail:
          "Your data is balanced and clean enough to continue with deeper tracking goals.",
        title: "Stable baseline",
        tone: "positive",
      });
    }

    const ideas = new Set<string>();

    if (netLast30 < 0) {
      ideas.add(
        "Set a weekly expense cap for the next 30 days and compare variance against this baseline."
      );
    }

    if (topCategory && topCategory.share >= 0.35) {
      ideas.add(
        `Split "${topCategory.category}" into sub-categories to identify specific cost drivers.`
      );
    }

    if (missingDescriptionRate >= 0.2) {
      ideas.add(
        "Add short, consistent descriptions to improve search precision and anomaly detection."
      );
    }

    if (incomeLast30 > 0 && expenseLast30 > 0) {
      ideas.add(
        "Create a monthly alert when expenses exceed 80% of income for faster intervention."
      );
    }

    ideas.add(
      "Review this section weekly; small adjustments are safer and more effective than large late changes."
    );

    return {
      expenseLast30,
      ideas: Array.from(ideas).slice(0, 4),
      incomeLast30,
      latestDescription,
      latestTimestamp,
      monthlyPoints,
      notes: notes.slice(0, 4),
      topCategories,
      totalExpense,
      totalIncome,
    };
  }, [transactions]);

  if (!insights) {
    return null;
  }

  const netLast30 = insights.incomeLast30 - insights.expenseLast30;
  const monthlyValues = insights.monthlyPoints.map((point) => point.net);
  const sparkline = buildSparklinePoints(monthlyValues);
  const isPositiveLast30 = netLast30 >= 0;

  return (
    <section
      className={cn("space-y-4 pt-1", className)}
      aria-label="Additional transaction insights"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Extra Insights
          </p>
          <h3 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
            Useful context while you scroll
          </h3>
        </div>
        <Badge>
          <ShieldCheckIcon />
          Local-only analysis, no extra requests
        </Badge>
      </div>

      <InsightErrorBoundary label="Net Momentum">
        <NetMomentumCard
          netLast30={netLast30}
          incomeLast30={insights.incomeLast30}
          expenseLast30={insights.expenseLast30}
          monthlyPoints={insights.monthlyPoints}
          sparkline={sparkline}
        />
      </InsightErrorBoundary>

      <div className="grid gap-4 lg:grid-cols-2">
        <InsightErrorBoundary label="Expense Concentration">
          <ExpenseConcentrationCard
            isPositiveLast30={isPositiveLast30}
            topCategories={insights.topCategories}
            totalIncome={insights.totalIncome}
            totalExpense={insights.totalExpense}
          />
        </InsightErrorBoundary>

        <InsightErrorBoundary label="Improvement Ideas">
          <ImprovementIdeasCard ideas={insights.ideas} />
        </InsightErrorBoundary>
      </div>
    </section>
  );
}
