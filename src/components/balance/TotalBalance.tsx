import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getIncomeExpenseDataServer } from "~/lib/api/chart/get-income-expense-chart";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email";
import { cn } from "~/lib/utils";
import { queryDictionary } from "~/queries/dictionary";
import { formatCurrency } from "~/utils/format-currency";
import { formatToTwoDecimals } from "~/utils/formatTwoDecimals";
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
} from "framer-motion";
import {
  ActivityIcon,
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";

const TOTAL_BALANCE_VISIBILITY_STORAGE_KEY = "monfly-total-balance-hidden";

type MonthlyPoint = {
  expense: number;
  income: number;
  label: string;
  net: number;
};

function Sparkline({
  data,
  tone,
}: {
  data: MonthlyPoint[];
  tone: "positive" | "negative";
}) {
  if (data.length < 2) {
    return (
      <div className="flex h-48 items-center justify-center rounded-[1.5rem] border border-dashed border-border/70 bg-background/50 px-5 text-center text-sm text-muted-foreground">
        Add a few transactions to reveal your balance momentum over time.
      </div>
    );
  }

  const width = 420;
  const height = 180;
  const padding = 12;
  const values = data.map((point) => point.net);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = data
    .map((point, index) => {
      const x =
        padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
      const y =
        height -
        padding -
        ((point.net - min) / range) * (height - padding * 2);

      return `${x},${y}`;
    })
    .join(" ");

  const lastPoint = points.split(" ").at(-1)?.split(",") ?? ["0", "0"];
  const strokeColor =
    tone === "positive" ? "hsl(152 76% 40%)" : "hsl(0 72% 51%)";
  const fillId = tone === "positive" ? "sparkPositive" : "sparkNegative";

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-48 w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={fillId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.22" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        <polygon
          points={`12,${height - padding} ${points} ${width - padding},${height - padding}`}
          fill={`url(#${fillId})`}
          stroke="none"
        />
        <polyline
          points={points}
          fill="none"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
        <circle
          cx={lastPoint[0]}
          cy={lastPoint[1]}
          r="7"
          fill={strokeColor}
          fillOpacity="0.16"
        />
        <circle cx={lastPoint[0]} cy={lastPoint[1]} r="4" fill={strokeColor} />
      </svg>

      <div className="mt-3 flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}

const TotalBalance = () => {
  const [totalBalance, setTotalBalance] = useState<string>("0");
  const [isBalanceHidden, setIsBalanceHidden] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const userEmail = useRouteUser();

  const { error, isPending, data } = useQuery({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    retryDelay: 1000,
  });

  const { data: incomeExpenseData } = useQuery({
    queryKey: [queryDictionary.incomeExpenseData, userEmail],
    queryFn: () => getIncomeExpenseDataServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (data?.data?.totalBalance !== undefined) {
      setTotalBalance(formatToTwoDecimals(data.data.totalBalance).stringValue);
    }
  }, [data]);

  useEffect(() => {
    const storedVisibility = localStorage.getItem(
      TOTAL_BALANCE_VISIBILITY_STORAGE_KEY
    );

    if (storedVisibility === null) {
      setIsBalanceHidden(false);
      return;
    }

    setIsBalanceHidden(storedVisibility === "true");
  }, []);

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden((previousValue) => {
      const nextValue = !previousValue;
      localStorage.setItem(
        TOTAL_BALANCE_VISIBILITY_STORAGE_KEY,
        String(nextValue)
      );
      return nextValue;
    });
  };

  const balanceValue = Number(data?.data?.totalBalance ?? 0);

  const summary = useMemo(() => {
    const normalizedData: MonthlyPoint[] =
      incomeExpenseData?.data?.map((item: any) => {
        const income = Number.isFinite(item.income) ? item.income : 0;
        const expense = Number.isFinite(item.expense) ? item.expense : 0;

        return {
          label: String(item.month || "Period"),
          income,
          expense,
          net: income - expense,
        };
      }) ?? [];

    const recentPoints = normalizedData.slice(-6);
    const latestPoint = recentPoints.at(-1) ?? null;
    const previousPoint = recentPoints.at(-2) ?? null;
    const totalIncome = recentPoints.reduce((sum, item) => sum + item.income, 0);
    const totalExpenses = recentPoints.reduce(
      (sum, item) => sum + item.expense,
      0
    );
    const trendDelta =
      latestPoint && previousPoint ? latestPoint.net - previousPoint.net : null;
    const peakPoint =
      recentPoints.length > 0
        ? recentPoints.reduce((best, current) =>
            current.net > best.net ? current : best
          )
        : null;

    return {
      latestPoint,
      peakPoint,
      recentPoints,
      totalExpenses,
      totalIncome,
      trendDelta,
    };
  }, [incomeExpenseData?.data]);

  const balanceTone = balanceValue >= 0 ? "positive" : "negative";
  const balanceToneClass =
    balanceTone === "positive"
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-rose-600 dark:text-rose-400";
  const TrendIcon =
    (summary.latestPoint?.net ?? 0) >= 0 ? ArrowUpRightIcon : ArrowDownRightIcon;

  if (error) {
    return (
      <section className="finance-panel rounded-[1.75rem] p-5">
        <p className="text-sm font-medium text-destructive">
          Failed to load balance
        </p>
      </section>
    );
  }

  if (isPending) {
    return (
      <section className="finance-hero rounded-[2rem] p-5 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.82fr)]">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-14 w-3/4" />
            <Skeleton className="h-5 w-2/3" />
            <div className="grid gap-3 sm:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-24 rounded-[1.35rem]" />
              ))}
            </div>
          </div>
          <Skeleton className="h-72 rounded-[1.75rem]" />
        </div>
      </section>
    );
  }

  return (
    <section className="finance-hero rounded-[2rem] p-5 sm:p-6 lg:p-7">
      <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.82fr)]">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Net total
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {summary.latestPoint?.label ?? "No activity yet"}
              </p>
            </div>
            <span className="text-sm text-muted-foreground">
              {summary.recentPoints.length} recorded periods
            </span>
          </div>

          <div className="space-y-3">
            <LazyMotion features={domAnimation}>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex min-h-18 items-center">
                  <AnimatePresence mode="wait" initial={false}>
                    {isBalanceHidden ? (
                      <m.span
                        key="hidden-balance"
                        initial={
                          shouldReduceMotion
                            ? false
                            : { opacity: 0, y: 8, filter: "blur(4px)" }
                        }
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={
                          shouldReduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, y: -8, filter: "blur(4px)" }
                        }
                        transition={{
                          duration: shouldReduceMotion ? 0 : 0.22,
                          ease: "easeOut",
                        }}
                        className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
                        aria-label="Total balance hidden"
                      >
                        $••••••
                      </m.span>
                    ) : (
                      <m.span
                        key="visible-balance"
                        initial={
                          shouldReduceMotion
                            ? false
                            : { opacity: 0, y: 8, filter: "blur(4px)" }
                        }
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={
                          shouldReduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, y: -8, filter: "blur(4px)" }
                        }
                        transition={{
                          duration: shouldReduceMotion ? 0 : 0.22,
                          ease: "easeOut",
                        }}
                        className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
                      >
                        ${totalBalance}
                      </m.span>
                    )}
                  </AnimatePresence>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="icon-lg"
                  onClick={toggleBalanceVisibility}
                  aria-label={
                    isBalanceHidden ? "Show total balance" : "Hide total balance"
                  }
                  aria-pressed={isBalanceHidden}
                  title={isBalanceHidden ? "Show balance" : "Hide balance"}
                  className="finance-chip rounded-full"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <m.span
                      key={isBalanceHidden ? "show-icon" : "hide-icon"}
                      initial={
                        shouldReduceMotion
                          ? false
                          : { opacity: 0, scale: 0.75, rotate: -15 }
                      }
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.75, rotate: 15 }
                      }
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.18,
                        ease: "easeOut",
                      }}
                      className="flex items-center justify-center"
                    >
                      {isBalanceHidden ? (
                        <EyeIcon aria-hidden="true" />
                      ) : (
                        <EyeOffIcon aria-hidden="true" />
                      )}
                    </m.span>
                  </AnimatePresence>
                </Button>
              </div>
            </LazyMotion>
          </div>

          <dl className="grid gap-3 sm:grid-cols-3">
            <div className="finance-chip rounded-[1.2rem] p-4">
              <dt className="text-sm font-medium text-muted-foreground">
                Latest net
              </dt>
              <div className="mt-3 flex items-center gap-2">
                <TrendIcon className={cn("size-4.5", balanceToneClass)} />
                <dd className={cn("text-lg font-semibold", balanceToneClass)}>
                  {formatCurrency(summary.latestPoint?.net ?? 0, "USD")}
                </dd>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {summary.latestPoint?.label ?? "Latest period"}
              </p>
            </div>

            <div className="finance-chip rounded-[1.2rem] p-4">
              <dt className="text-sm font-medium text-muted-foreground">
                Income tracked
              </dt>
              <dd className="mt-3 text-lg font-semibold text-foreground">
                {formatCurrency(summary.totalIncome, "USD")}
              </dd>
              <p className="mt-1 text-xs text-muted-foreground">
                Recent recorded periods
              </p>
            </div>

            <div className="finance-chip rounded-[1.2rem] p-4">
              <dt className="text-sm font-medium text-muted-foreground">
                Expenses tracked
              </dt>
              <dd className="mt-3 text-lg font-semibold text-foreground">
                {formatCurrency(summary.totalExpenses, "USD")}
              </dd>
              <p className="mt-1 text-xs text-muted-foreground">
                Recent recorded periods
              </p>
            </div>
          </dl>
        </div>

        <aside className="finance-soft-chart rounded-[1.75rem] p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Trend</p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                Balance over time
              </h2>
            </div>

            <span className="text-sm text-muted-foreground">
              {summary.recentPoints.length} periods
            </span>
          </div>

          <div className="mt-5">
            <Sparkline data={summary.recentPoints} tone={balanceTone} />
          </div>

          <div className="mt-5">
            <div className="rounded-[1.15rem] border border-border/70 bg-background/65 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ActivityIcon className="size-4 text-primary" />
                Change vs previous period
              </div>
              <p className={cn("mt-3 text-base font-semibold", balanceToneClass)}>
                {summary.trendDelta === null
                  ? "Not enough data"
                  : formatCurrency(summary.trendDelta, "USD")}
              </p>
              {summary.peakPoint && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Peak period: {summary.peakPoint.label} (
                  {formatCurrency(summary.peakPoint.net, "USD")})
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default TotalBalance;
