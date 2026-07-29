import { hideBalanceAtom } from "@/state";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { CalendarIcon } from "lucide-react";
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
} from "motion/react";
import { useMemo } from "react";
import { Alert, AlertTitle } from "~/components/ui/alert";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { useActiveCard, useCards } from "~/hooks/cards";
import { usePreferredCurrency } from "~/hooks/usePreferredCurrency";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getIncomeExpenseDataServer } from "~/lib/api/chart/get-income-expense-chart";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email";
import { queryDictionary } from "~/queries/dictionary";
import { formatCurrency, getCurrencySymbol } from "~/utils/format-currency";
import { queryKeys } from "~/utils/query-keys";

import { CopyButton } from "../copy-button/copy-button";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { BalanceActions } from "./BalanceActions";

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

const TotalBalance = () => {
  const isBalanceHidden = useAtomValue(hideBalanceAtom);
  const shouldReduceMotion = useReducedMotion();
  const userEmail = useRouteUser();
  const activeCard = useActiveCard();
  const currency = usePreferredCurrency();

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

  // Currency-aware display string (symbol + grouping for the active currency).
  const displayBalance = formatCurrency(
    scopedBalance !== undefined && scopedBalance !== null
      ? Number(scopedBalance)
      : 0,
    currency,
  );

  // ponytail: only the last period label + period count are rendered, so we
  // derive just those instead of the full income/expense/trend summary.
  const { latestLabel, periodCount } = useMemo(() => {
    const points = (incomeExpenseData?.data ?? []).slice(
      -6,
    ) as IncomeExpensePoint[];

    return {
      latestLabel: points.at(-1)?.month || null,
      periodCount: points.length,
    };
  }, [incomeExpenseData?.data]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Failed to load balance</AlertTitle>
      </Alert>
    );
  }

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 rounded-full" />
          <CardAction>
            <Skeleton className="h-9 w-24" />
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-14 w-3/4" />
          <div className="grid gap-3 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-24 rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-sm font-medium">
            Net total
          </span>
          <Tooltip>
            <TooltipTrigger render={<Badge className="capitalize" />}>
              {latestLabel ? <CalendarIcon /> : null}
              {latestLabel ?? "No activity yet"}
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">
                {latestLabel
                  ? LONG_DATE_FORMATTER.format(new Date())
                  : "No recorded activity yet."}
              </p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
        <CardAction className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger
              render={
                <CopyButton
                  text={displayBalance}
                  variant="outline"
                  size="default"
                />
              }
            />
            <TooltipContent>
              <p>Copy total balance</p>
            </TooltipContent>
          </Tooltip>
          <span className="text-muted-foreground text-sm">
            {periodCount}
            <span className="hidden md:inline"> recorded periods</span>
            <span className="md:hidden"> records</span>
          </span>
        </CardAction>
      </CardHeader>

      <CardContent>
        <LazyMotion features={domAnimation}>
          <div className="flex min-h-18 items-center">
            <AnimatePresence mode="wait" initial={false}>
              <m.span
                key={isBalanceHidden ? "hidden-balance" : "visible-balance"}
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
                aria-label={
                  isBalanceHidden ? "Total balance hidden" : undefined
                }
              >
                {isBalanceHidden
                  ? `${getCurrencySymbol(currency)}••••••`
                  : displayBalance}
              </m.span>
            </AnimatePresence>
          </div>
        </LazyMotion>
      </CardContent>

      <CardFooter>
        <BalanceActions />
      </CardFooter>
    </Card>
  );
};

export default TotalBalance;
