import { memo, ReactNode, useMemo } from "react";
import { hideBalanceAtom } from "@/state";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "~/components/ui/skeleton";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getIncomeExpenseDataServer } from "~/lib/api/chart/get-income-expense-chart";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email";
import { cn } from "~/lib/utils";
import { queryDictionary } from "~/queries/dictionary";
import { formatCurrency } from "~/utils/format-currency";
import { useAtomValue } from "jotai";
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  CalendarRangeIcon,
  FlameIcon,
  GaugeIcon,
  PiggyBankIcon,
  TimerIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  TrophyIcon,
} from "lucide-react";

export type BalanceTone = "positive" | "negative";

type IncomeExpensePoint = {
  expense: number;
  income: number;
  label: string;
  net: number;
};

type Summary = {
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

const EMPTY_SUMMARY: Summary = {
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

const HIDDEN = "$••••";

function BalanceDetailsComponent() {
  const userEmail = useRouteUser();
  const isBalanceHidden = useAtomValue(hideBalanceAtom);

  const { data: userData, isPending: isUserPending } = useQuery({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    retryDelay: 1000,
  });

  const {
    data: incomeExpenseData,
    isPending: isIncomeExpensePending,
    error,
  } = useQuery({
    queryKey: [queryDictionary.incomeExpenseData, userEmail],
    queryFn: () => getIncomeExpenseDataServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
  });

  const balanceValue = Number(userData?.data?.totalBalance ?? 0);

  const summary = useMemo<Summary>(() => {
    const rawPoints = incomeExpenseData?.data;
    if (!Array.isArray(rawPoints) || rawPoints.length === 0) {
      return EMPTY_SUMMARY;
    }

    const recentPoints: IncomeExpensePoint[] = rawPoints
      .slice(-6)
      .map((item: { month?: unknown; income?: unknown; expense?: unknown }) => {
        const income = Number.isFinite(Number(item.income))
          ? Number(item.income)
          : 0;
        const expense = Number.isFinite(Number(item.expense))
          ? Number(item.expense)
          : 0;
        return {
          label: String(item.month ?? "Period"),
          income,
          expense,
          net: income - expense,
        };
      });

    let totalIncome = 0;
    let totalExpenses = 0;
    let bestPoint: IncomeExpensePoint | null = null;
    let worstPoint: IncomeExpensePoint | null = null;
    for (const point of recentPoints) {
      totalIncome += point.income;
      totalExpenses += point.expense;
      if (!bestPoint || point.net > bestPoint.net) bestPoint = point;
      if (!worstPoint || point.net < worstPoint.net) worstPoint = point;
    }

    const latestPoint = recentPoints.at(-1) ?? null;
    const previousPoint = recentPoints.at(-2) ?? null;
    const trendDelta =
      latestPoint && previousPoint ? latestPoint.net - previousPoint.net : null;
    const trendPercent =
      latestPoint && previousPoint && previousPoint.net !== 0
        ? ((latestPoint.net - previousPoint.net) /
            Math.abs(previousPoint.net)) *
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
    for (let i = recentPoints.length - 1; i >= 0; i--) {
      if (recentPoints[i].net >= 0) positiveStreak++;
      else break;
    }

    const runwayMonths =
      avgNet < 0 && balanceValue > 0 ? balanceValue / Math.abs(avgNet) : null;

    return {
      latestPoint,
      recentPoints,
      totalIncome,
      totalExpenses,
      trendDelta,
      trendPercent,
      avgNet,
      savingsRate,
      bestPoint,
      worstPoint,
      positiveStreak,
      runwayMonths,
      expenseBurnRate,
    };
  }, [incomeExpenseData?.data, balanceValue]);

  if (error) {
    return (
      <p className="text-destructive text-sm font-medium" role="alert">
        Failed to load balance details
      </p>
    );
  }

  if (isUserPending || isIncomeExpensePending) {
    return (
      <div className="space-y-3" aria-busy="true" aria-live="polite">
        <dl className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-32 rounded-2xl" />
          ))}
        </dl>
        <DlContainer>
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-24 rounded-2xl" />
          ))}
        </DlContainer>
      </div>
    );
  }

  const hasData = summary.recentPoints.length > 0;
  const isLatestPositive = (summary.latestPoint?.net ?? 0) >= 0;
  const TrendIcon = isLatestPositive ? ArrowUpRightIcon : ArrowDownRightIcon;
  const balanceToneClass = isLatestPositive
    ? "text-primary"
    : "text-destructive";

  const totalFlow = summary.totalIncome + summary.totalExpenses;
  const incomeRatio = totalFlow > 0 ? summary.totalIncome / totalFlow : 0;
  const expenseRatio = totalFlow > 0 ? summary.totalExpenses / totalFlow : 0;

  const sparkMax = summary.recentPoints.reduce(
    (max, point) => Math.max(max, Math.abs(point.net)),
    0,
  );

  return (
    <section className="space-y-3" aria-label="Balance details and insights">
      <dl className="grid gap-3 sm:grid-cols-3">
        <BalanceCard
          accent={isLatestPositive ? "primary" : "destructive"}
          label="Latest net"
          value={
            isBalanceHidden
              ? HIDDEN
              : formatCurrency(summary.latestPoint?.net ?? 0, "MXN")
          }
          valueClassName={cn("tabular-nums", balanceToneClass)}
          leadingIcon={<TrendIcon className={cn("size-4", balanceToneClass)} />}
          footer={
            <div className="flex items-end justify-between gap-3">
              <p className="text-muted-foreground text-xs">
                {summary.latestPoint?.label ?? "Latest period"}
              </p>
              {summary.trendPercent !== null && !isBalanceHidden ? (
                <TrendBadge percent={summary.trendPercent} />
              ) : null}
            </div>
          }
          tail={
            summary.recentPoints.length > 1 && !isBalanceHidden ? (
              <Sparkline points={summary.recentPoints} max={sparkMax} />
            ) : null
          }
        />

        <BalanceCard
          accent="emerald"
          label="Income tracked"
          value={
            isBalanceHidden
              ? HIDDEN
              : formatCurrency(summary.totalIncome, "MXN")
          }
          leadingIcon={
            <TrendingUpIcon className="size-4 text-emerald-600 dark:text-emerald-300" />
          }
          footer={
            <div className="space-y-1.5">
              <p className="text-muted-foreground flex items-center justify-between gap-2 text-xs">
                <span>
                  {hasData
                    ? `${summary.recentPoints.length} recorded periods`
                    : "Recent recorded periods"}
                </span>
                {hasData && !isBalanceHidden ? (
                  <span className="font-medium text-emerald-700 tabular-nums dark:text-emerald-300">
                    {(incomeRatio * 100).toFixed(0)}%
                  </span>
                ) : null}
              </p>
              <FlowBar
                ratio={incomeRatio}
                tone="emerald"
                ariaLabel="Income share of total flow"
              />
            </div>
          }
        />

        <BalanceCard
          accent="amber"
          label="Expenses tracked"
          value={
            isBalanceHidden
              ? HIDDEN
              : formatCurrency(summary.totalExpenses, "MXN")
          }
          leadingIcon={
            <TrendingDownIcon className="size-4 text-amber-600 dark:text-amber-300" />
          }
          footer={
            <div className="space-y-1.5">
              <p className="text-muted-foreground flex items-center justify-between gap-2 text-xs">
                <span>
                  {hasData
                    ? `~ ${
                        isBalanceHidden
                          ? HIDDEN
                          : formatCurrency(summary.expenseBurnRate, "MXN")
                      } / period`
                    : "Recent recorded periods"}
                </span>
                {hasData && !isBalanceHidden ? (
                  <span className="font-medium text-amber-700 tabular-nums dark:text-amber-300">
                    {(expenseRatio * 100).toFixed(0)}%
                  </span>
                ) : null}
              </p>
              <FlowBar
                ratio={expenseRatio}
                tone="amber"
                ariaLabel="Expense share of total flow"
              />
            </div>
          }
        />
      </dl>

      {hasData ? (
        <DlContainer>
          <SavingsRateCard
            rate={summary.savingsRate}
            hidden={isBalanceHidden}
          />
          <InsightCard
            icon={GaugeIcon}
            iconTone="text-sky-600 dark:text-sky-300"
            label="Avg net / period"
            value={
              isBalanceHidden ? HIDDEN : formatCurrency(summary.avgNet, "MXN")
            }
            valueTone={
              summary.avgNet >= 0 ? "text-primary" : "text-destructive"
            }
            hint={`across ${summary.recentPoints.length} period${
              summary.recentPoints.length === 1 ? "" : "s"
            }`}
          />
          <InsightCard
            icon={TrophyIcon}
            iconTone="text-amber-600 dark:text-amber-300"
            label="Best period"
            value={
              isBalanceHidden
                ? HIDDEN
                : summary.bestPoint
                  ? formatCurrency(summary.bestPoint.net, "MXN")
                  : "—"
            }
            valueTone={
              summary.bestPoint && summary.bestPoint.net >= 0
                ? "text-primary"
                : "text-foreground"
            }
            hint={summary.bestPoint?.label ?? "—"}
          />
          {summary.runwayMonths !== null ? (
            <InsightCard
              icon={TimerIcon}
              iconTone="text-destructive"
              label="Estimated runway"
              value={`${summary.runwayMonths.toFixed(1)} mo`}
              valueTone="text-destructive"
              hint="at current burn rate"
            />
          ) : (
            <InsightCard
              icon={FlameIcon}
              iconTone="text-emerald-600 dark:text-emerald-300"
              label="Positive streak"
              value={`${summary.positiveStreak} ${
                summary.positiveStreak === 1 ? "month" : "months"
              }`}
              valueTone={
                summary.positiveStreak > 0
                  ? "text-primary"
                  : "text-muted-foreground"
              }
              hint={
                summary.positiveStreak > 0
                  ? "consecutive positive net"
                  : "no streak yet"
              }
            />
          )}
        </DlContainer>
      ) : (
        <EmptyInsights />
      )}

      {hasData &&
      summary.worstPoint &&
      summary.bestPoint &&
      !isBalanceHidden ? (
        <RangeStrip best={summary.bestPoint} worst={summary.worstPoint} />
      ) : null}
    </section>
  );
}

export const BalanceDetails = memo(BalanceDetailsComponent);

type AccentTone = "primary" | "destructive" | "emerald" | "amber";

const accentClass: Record<AccentTone, string> = {
  primary:
    "before:bg-[radial-gradient(circle_at_top_right,var(--primary)/12%,transparent_60%)]",
  destructive:
    "before:bg-[radial-gradient(circle_at_top_right,rgb(239_68_68/14%),transparent_60%)]",
  emerald:
    "before:bg-[radial-gradient(circle_at_top_right,rgb(16_185_129/14%),transparent_60%)]",
  amber:
    "before:bg-[radial-gradient(circle_at_top_right,rgb(245_158_11/14%),transparent_60%)]",
};

type BalanceCardProps = {
  accent: AccentTone;
  label: string;
  value: string;
  valueClassName?: string;
  leadingIcon: React.ReactNode;
  footer: React.ReactNode;
  tail?: React.ReactNode;
};

function BalanceCard({
  accent,
  label,
  value,
  valueClassName,
  leadingIcon,
  footer,
  tail,
}: BalanceCardProps) {
  return (
    <div
      className={cn(
        "group/balance-card bg-muted ring-foreground/5 relative overflow-hidden rounded-2xl p-4 ring-1 transition-all duration-300",
        "hover:ring-foreground/10 hover:shadow-sm",
        "before:pointer-events-none before:absolute before:inset-0 before:opacity-60 before:transition-opacity before:duration-300 group-hover/balance-card:before:opacity-100",
        accentClass[accent],
      )}
    >
      <div className="relative flex flex-col gap-2.5">
        <dt className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
          <span className="bg-background/70 ring-foreground/5 inline-flex size-6 items-center justify-center rounded-full ring-1">
            {leadingIcon}
          </span>
          {label}
        </dt>
        <dd
          className={cn(
            "text-foreground text-lg font-semibold tracking-tight tabular-nums sm:text-xl",
            valueClassName,
          )}
        >
          {value}
        </dd>
        {tail}
        {footer}
      </div>
    </div>
  );
}

type SparklineProps = {
  points: IncomeExpensePoint[];
  max: number;
};

function Sparkline({ points, max }: SparklineProps) {
  if (max <= 0) return null;
  return (
    <div
      className="flex h-8 items-end gap-1"
      role="img"
      aria-label={`Recent net trend across ${points.length} periods`}
    >
      {points.map((point, index) => {
        const ratio = Math.abs(point.net) / max;
        const heightPct = Math.max(ratio * 100, 6);
        const isPositive = point.net >= 0;
        return (
          <span
            key={`${point.label}-${index}`}
            className={cn(
              "flex-1 rounded-sm transition-all duration-300",
              isPositive
                ? "bg-primary/30 group-hover/balance-card:bg-primary/60"
                : "bg-destructive/30 group-hover/balance-card:bg-destructive/60",
            )}
            style={{ height: `${heightPct}%` }}
            title={`${point.label}: ${point.net}`}
            aria-label={`${point.label} net ${point.net}`}
          />
        );
      })}
    </div>
  );
}

type FlowBarProps = {
  ratio: number;
  tone: "emerald" | "amber";
  ariaLabel: string;
};

function FlowBar({ ratio, tone, ariaLabel }: FlowBarProps) {
  const pct = Math.max(0, Math.min(1, ratio)) * 100;
  return (
    <div
      className="bg-foreground/5 h-1.5 overflow-hidden rounded-full"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      aria-label={ariaLabel}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none",
          tone === "emerald"
            ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
            : "bg-gradient-to-r from-amber-400 to-amber-600",
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

type TrendBadgeProps = {
  percent: number;
};

function TrendBadge({ percent }: TrendBadgeProps) {
  const isPositive = percent >= 0;
  const Icon = isPositive ? ArrowUpRightIcon : ArrowDownRightIcon;
  const formatted = `${isPositive ? "+" : ""}${percent.toFixed(1)}%`;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[0.65rem] font-semibold tabular-nums",
        isPositive
          ? "bg-primary/10 text-primary"
          : "bg-destructive/10 text-destructive",
      )}
      aria-label={`Change vs previous period ${formatted}`}
    >
      <Icon className="size-3" aria-hidden="true" />
      {formatted}
    </span>
  );
}

type InsightCardProps = {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  iconTone: string;
  label: string;
  value: string;
  valueTone?: string;
  hint: string;
};

function InsightCard({
  icon: Icon,
  iconTone,
  label,
  value,
  valueTone,
  hint,
}: InsightCardProps) {
  return (
    <div className="group/insight border-border/60 bg-card ring-foreground/5 hover:ring-foreground/10 relative overflow-hidden rounded-2xl border p-3 ring-1 transition-all duration-300 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <dt className="text-muted-foreground text-[0.7rem] tracking-[0.12em] uppercase">
          {label}
        </dt>
        <Icon className={cn("size-4", iconTone)} aria-hidden={true} />
      </div>
      <dd
        className={cn(
          "mt-2 text-base font-semibold tracking-tight tabular-nums sm:text-lg",
          valueTone ?? "text-foreground",
        )}
      >
        {value}
      </dd>
      <p className="text-muted-foreground mt-0.5 text-[0.7rem]">{hint}</p>
    </div>
  );
}

type SavingsRateCardProps = {
  rate: number | null;
  hidden: boolean;
};

function SavingsRateCard({ rate, hidden }: SavingsRateCardProps) {
  const safeRate = rate ?? 0;
  const clamped = Math.max(-1, Math.min(1, safeRate));
  const display =
    rate === null ? "—" : hidden ? "••" : `${(clamped * 100).toFixed(0)}%`;

  const tone =
    rate === null
      ? "text-muted-foreground"
      : safeRate >= 0.2
        ? "text-emerald-600 dark:text-emerald-300"
        : safeRate >= 0
          ? "text-amber-600 dark:text-amber-300"
          : "text-destructive";

  const hint =
    rate === null
      ? "needs income"
      : safeRate >= 0.2
        ? "healthy savings"
        : safeRate >= 0
          ? "modest savings"
          : "spending exceeds income";

  return (
    <div className="group/insight border-border/60 bg-card ring-foreground/5 hover:ring-foreground/10 relative overflow-hidden rounded-2xl border p-3 ring-1 transition-all duration-300 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <dt className="text-muted-foreground text-[0.7rem] tracking-[0.12em] uppercase">
            Savings rate
          </dt>
          <dd
            className={cn(
              "mt-2 text-base font-semibold tracking-tight tabular-nums sm:text-lg",
              tone,
            )}
          >
            {display}
          </dd>
          <p className="text-muted-foreground mt-0.5 truncate text-[0.7rem]">
            {hint}
          </p>
        </div>
        <SavingsRing
          value={Math.max(0, clamped)}
          tone={
            safeRate >= 0.2
              ? "emerald"
              : safeRate >= 0
                ? "amber"
                : "destructive"
          }
          dimmed={hidden || rate === null}
        />
      </div>
    </div>
  );
}

type SavingsRingProps = {
  value: number;
  tone: "emerald" | "amber" | "destructive";
  dimmed: boolean;
};

function SavingsRing({ value, tone, dimmed }: SavingsRingProps) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - value);

  const stroke =
    tone === "emerald"
      ? "stroke-emerald-500 dark:stroke-emerald-400"
      : tone === "amber"
        ? "stroke-amber-500 dark:stroke-amber-400"
        : "stroke-destructive";

  return (
    <svg
      viewBox="0 0 40 40"
      className={cn(
        "size-12 shrink-0 -rotate-90 transition-opacity",
        dimmed ? "opacity-40" : "opacity-100",
      )}
      role="img"
      aria-label={`Savings ratio ${(value * 100).toFixed(0)} percent`}
    >
      <PiggyBankIcon className="hidden" />
      <circle
        cx="20"
        cy="20"
        r={radius}
        className="stroke-foreground/10 fill-none"
        strokeWidth={4}
      />
      <circle
        cx="20"
        cy="20"
        r={radius}
        className={cn(
          "fill-none transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none",
          stroke,
        )}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
      />
    </svg>
  );
}

type RangeStripProps = {
  best: IncomeExpensePoint;
  worst: IncomeExpensePoint;
};

function RangeStrip({ best, worst }: RangeStripProps) {
  if (best.label === worst.label) return null;
  return (
    <div className="border-border/60 bg-card/60 flex flex-col gap-2 rounded-2xl border p-3 text-xs sm:flex-row sm:items-center sm:justify-between">
      <span className="text-muted-foreground flex items-center gap-2">
        <CalendarRangeIcon
          className="text-muted-foreground size-3.5"
          aria-hidden={true}
        />
        Range across recent periods
      </span>
      <span className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5">
          <span className="bg-primary size-2 rounded-full" aria-hidden={true} />
          <span className="text-muted-foreground">Best</span>
          <span className="text-foreground font-medium tabular-nums">
            {best.label}
          </span>
          <span className="text-primary tabular-nums">
            {formatCurrency(best.net, "MXN")}
          </span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="bg-destructive size-2 rounded-full"
            aria-hidden={true}
          />
          <span className="text-muted-foreground">Lowest</span>
          <span className="text-foreground font-medium tabular-nums">
            {worst.label}
          </span>
          <span className="text-destructive tabular-nums">
            {formatCurrency(worst.net, "MXN")}
          </span>
        </span>
      </span>
    </div>
  );
}

function EmptyInsights() {
  return (
    <div className="border-border/60 bg-card/40 rounded-2xl border border-dashed p-6 text-center">
      <PiggyBankIcon
        className="text-muted-foreground mx-auto size-6"
        aria-hidden={true}
      />
      <p className="text-foreground mt-2 text-sm font-medium">
        No periods recorded yet
      </p>
      <p className="text-muted-foreground mt-1 text-xs">
        Add a few transactions to see savings rate, runway and trends.
      </p>
    </div>
  );
}

function DlContainer({ children }: { children: ReactNode }) {
  return (
    <dl className="4xl:grid-cols-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
      {children}
    </dl>
  );
}
