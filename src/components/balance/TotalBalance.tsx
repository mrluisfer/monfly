import { hideBalanceAtom } from "@/state";
import { useQuery } from "@tanstack/react-query";
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
} from "motion/react";
import { useAtomValue } from "jotai";
import { CalendarIcon } from "lucide-react";
import { useMemo } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { useActiveCard, useCards } from "~/hooks/cards";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getIncomeExpenseDataServer } from "~/lib/api/chart/get-income-expense-chart";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email";
import { queryDictionary } from "~/queries/dictionary";
import { queryKeys } from "~/utils/query-keys";
import { formatToTwoDecimals } from "~/utils/formatTwoDecimals";

import { CopyButton } from "../copy-button/copy-button";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { BalanceActions } from "./BalanceActions";

export type MonthlyPoint = {
  expense: number;
  income: number;
  label: string;
  net: number;
};

type IncomeExpensePoint = {
  month: string;
  year: number;
  income: number;
  expense: number;
};

const LONG_DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatLongDate(date: Date): string {
  return LONG_DATE_FORMATTER.format(date);
}

export type TotalBalanceSummary = {
  latestPoint: MonthlyPoint | null;
  peakPoint: MonthlyPoint | null;
  recentPoints: MonthlyPoint[];
  totalExpenses: number;
  totalIncome: number;
  trendDelta: number | null;
};

const TotalBalance = () => {
  const isBalanceHidden = useAtomValue(hideBalanceAtom);
  const shouldReduceMotion = useReducedMotion();
  const userEmail = useRouteUser();
  const activeCard = useActiveCard();

  const { error, isPending, data } = useQuery({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    retryDelay: 1000,
  });

  // Only fetched when a card is active; otherwise the query stays disabled.
  const { data: cardsData } = useCards();

  const { data: incomeExpenseData } = useQuery({
    queryKey: queryKeys.charts.incomeExpense(userEmail, activeCard),
    queryFn: () =>
      getIncomeExpenseDataServer({
        data: { email: userEmail, cardId: activeCard },
      }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
  });

  // When a card is selected, show that card's balance; otherwise the global
  // user total. Both are kept in sync atomically server-side.
  const scopedBalance = activeCard
    ? (cardsData?.data?.find((card) => card.id === activeCard)?.balance ?? 0)
    : data?.data?.totalBalance;

  const totalBalance =
    scopedBalance !== undefined && scopedBalance !== null
      ? formatToTwoDecimals(scopedBalance).stringValue
      : "0";

  const summary = useMemo<TotalBalanceSummary>(() => {
    const normalizedData: MonthlyPoint[] =
      incomeExpenseData?.data?.map((item: IncomeExpensePoint) => {
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
    const totalIncome = recentPoints.reduce(
      (sum, item) => sum + item.income,
      0,
    );
    const totalExpenses = recentPoints.reduce(
      (sum, item) => sum + item.expense,
      0,
    );
    const trendDelta =
      latestPoint && previousPoint ? latestPoint.net - previousPoint.net : null;
    const peakPoint =
      recentPoints.length > 0
        ? recentPoints.reduce((best, current) =>
            current.net > best.net ? current : best,
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

  if (error) {
    return (
      <section className="bg-card rounded-2xl p-5">
        <p className="text-destructive text-sm font-medium">
          Failed to load balance
        </p>
      </section>
    );
  }

  if (isPending) {
    return (
      <section className="bg-card rounded-2xl p-5 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.82fr)]">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-14 w-3/4" />
            <Skeleton className="h-5 w-2/3" />
            <div className="grid gap-3 sm:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-24 rounded-xl" />
              ))}
            </div>
          </div>
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-card rounded-2xl px-1 py-3 sm:p-3 lg:p-7">
      <div className="relative grid gap-6">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-row items-center gap-4">
              <div className="flex items-center justify-start gap-2">
                <p className="text-muted-foreground text-sm font-medium">
                  Net total
                </p>
                <Tooltip>
                  <TooltipTrigger render={<Badge className="capitalize" />}>
                    {summary.latestPoint?.label ? <CalendarIcon /> : null}
                    {summary.latestPoint?.label ?? "No activity yet"}
                  </TooltipTrigger>
                  <TooltipContent>
                    {summary.latestPoint ? (
                      <p className="text-sm">{formatLongDate(new Date())}</p>
                    ) : (
                      <p className="text-sm">No recorded activity yet.</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <CopyButton
                      text={`$${totalBalance}`}
                      variant={"secondary"}
                      size={"default"}
                    />
                  }
                />
                <TooltipContent>
                  <p>Copy total balance</p>
                </TooltipContent>
              </Tooltip>

              <span className="text-muted-foreground hidden text-sm md:block">
                {summary.recentPoints.length} recorded periods
              </span>
              <span className="text-muted-foreground text-sm md:hidden">
                {summary.recentPoints.length} records
              </span>
            </div>
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
                        className="text-foreground text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
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
                        className="text-foreground text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
                      >
                        ${totalBalance}
                      </m.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </LazyMotion>
          </div>
        </div>
      </div>
      <BalanceActions />
    </section>
  );
};

export default TotalBalance;
