import { useId, useMemo } from "react";
import { cn } from "~/lib/utils";
import { TransactionWithUser } from "~/types/TransactionWithUser";
import { formatCurrency } from "~/utils/format-currency";
import {
  CircleAlertIcon,
  LightbulbIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";

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

  return {
    height,
    lastPoint,
    padding,
    points,
    width,
  };
}

function getNoteToneClassName(tone: InsightTone) {
  if (tone === "positive") {
    return "border-emerald-500/25 bg-emerald-500/10";
  }
  if (tone === "warning") {
    return "border-amber-500/25 bg-amber-500/10";
  }
  return "border-border/70 bg-background/65";
}

function getDotToneClassName(tone: InsightTone) {
  if (tone === "positive") return "bg-emerald-500";
  if (tone === "warning") return "bg-amber-500";
  return "bg-slate-400";
}

export function TransactionsInsights({
  transactions,
  className,
}: TransactionsInsightsProps) {
  const gradientId = useId().replace(/:/g, "");

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
  const trendColor = isPositiveLast30 ? "hsl(152 76% 40%)" : "hsl(0 72% 51%)";
  const latestDateLabel = insights.latestTimestamp
    ? new Date(insights.latestTimestamp).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "No activity";
  const TrendIcon = isPositiveLast30 ? TrendingUpIcon : TrendingDownIcon;

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
        <span className="finance-chip inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs text-muted-foreground">
          <ShieldCheckIcon className="size-3.5 text-emerald-600" />
          Local-only analysis, no extra requests
        </span>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <article className="finance-soft-chart rounded-[1.5rem] p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Net momentum (last 6 months)
              </p>
              <h4 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                {formatCurrency(netLast30, "USD")} in last 30 days
              </h4>
            </div>
            <span className="finance-chip rounded-full px-2.5 py-1 text-xs text-muted-foreground">
              Updated from your current transactions
            </span>
          </div>

          <div className="mt-4 rounded-[1.2rem] border border-border/70 bg-background/55 p-3">
            {sparkline ? (
              <div>
                <svg
                  viewBox={`0 0 ${sparkline.width} ${sparkline.height}`}
                  className="h-40 w-full"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={trendColor}
                        stopOpacity="0.24"
                      />
                      <stop
                        offset="100%"
                        stopColor={trendColor}
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <polygon
                    points={`${sparkline.padding},${sparkline.height - sparkline.padding} ${sparkline.points} ${sparkline.width - sparkline.padding},${sparkline.height - sparkline.padding}`}
                    fill={`url(#${gradientId})`}
                    stroke="none"
                  />
                  <polyline
                    points={sparkline.points}
                    fill="none"
                    stroke={trendColor}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3.6"
                  />
                  <circle
                    cx={sparkline.lastPoint[0]}
                    cy={sparkline.lastPoint[1]}
                    r="5"
                    fill={trendColor}
                  />
                </svg>

                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{insights.monthlyPoints[0]?.label}</span>
                  <span>{insights.monthlyPoints.at(-1)?.label}</span>
                </div>
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Add more transactions to render momentum insights.
              </p>
            )}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="finance-chip rounded-[1.1rem] p-3">
              <div className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                Income (30d)
              </div>
              <div className="mt-2 text-base font-semibold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(insights.incomeLast30, "USD")}
              </div>
            </div>
            <div className="finance-chip rounded-[1.1rem] p-3">
              <div className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                Expenses (30d)
              </div>
              <div className="mt-2 text-base font-semibold text-rose-600 dark:text-rose-400">
                {formatCurrency(insights.expenseLast30, "USD")}
              </div>
            </div>
          </div>
        </article>

        <article className="finance-chip rounded-[1.5rem] border border-border/70 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <SparklesIcon className="size-4.5 text-primary" />
            <h4 className="text-base font-semibold tracking-tight text-foreground">
              Smart notes
            </h4>
          </div>

          <div className="mt-3 space-y-2.5">
            {insights.notes.map((note) => (
              <div
                key={note.id}
                className={cn(
                  "rounded-[1rem] border px-3 py-2.5",
                  getNoteToneClassName(note.tone)
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      getDotToneClassName(note.tone)
                    )}
                    aria-hidden="true"
                  />
                  <p className="text-sm font-medium text-foreground">
                    {note.title}
                  </p>
                </div>
                <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
                  {note.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-[1rem] border border-border/70 bg-background/60 px-3 py-2.5 text-xs text-muted-foreground">
            Last activity on {latestDateLabel}:{" "}
            {safeText(insights.latestDescription, 64)}
          </div>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="finance-chip rounded-[1.5rem] border border-border/70 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <TrendIcon
              className={cn(
                "size-4.5",
                isPositiveLast30 ? "text-emerald-600" : "text-rose-600"
              )}
            />
            <h4 className="text-base font-semibold tracking-tight text-foreground">
              Expense concentration
            </h4>
          </div>

          <div className="mt-4 space-y-3">
            {insights.topCategories.length ? (
              insights.topCategories.map((category) => (
                <div key={category.category} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate text-foreground">
                      {category.category}
                    </span>
                    <span className="text-muted-foreground">
                      {Math.round(category.share * 100)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary/80"
                      style={{
                        width: `${Math.max(8, Math.round(category.share * 100))}%`,
                      }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatCurrency(category.amount, "USD")}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No expense categories yet to analyze.
              </p>
            )}
          </div>

          <div className="mt-4 border-t border-border/60 pt-3 text-xs text-muted-foreground">
            Total tracked: {formatCurrency(insights.totalIncome, "USD")} in •{" "}
            {formatCurrency(insights.totalExpense, "USD")} out
          </div>
        </article>

        <article className="finance-chip rounded-[1.5rem] border border-border/70 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <LightbulbIcon className="size-4.5 text-amber-600" />
            <h4 className="text-base font-semibold tracking-tight text-foreground">
              Improvement ideas
            </h4>
          </div>

          <ul className="mt-3 space-y-2.5" aria-label="Improvement ideas list">
            {insights.ideas.map((idea) => (
              <li
                key={idea}
                className="flex items-start gap-2 rounded-[0.95rem] border border-border/70 bg-background/60 px-3 py-2.5 text-sm text-muted-foreground"
              >
                <CircleAlertIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{idea}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
