import { lazy, Suspense } from "react";
import { hideMetricsAtom } from "@/state";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import TotalBalance from "~/components/balance/TotalBalance";
import { DashboardMetrics } from "~/components/home/DashboardMetrics";
import { WelcomeMessage } from "~/components/home/WelcomeMessage";
import TransactionsList from "~/components/transactions/list";
import { Skeleton } from "~/components/ui/skeleton";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email";
import { createSafeQuery } from "~/lib/stream-utils";
import { cn } from "~/lib/utils";
import { queryDictionary } from "~/queries/dictionary";
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
} from "framer-motion";
import { useAtomValue } from "jotai";

import { Button } from "@/components/ui/button";

const IncomeExpenseChart = lazy(
  () => import("~/components/charts/IncomeExpenseChart")
);

export const Route = createFileRoute("/_authed/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  const userEmail = useRouteUser();
  const shouldReduceMotion = useReducedMotion();
  const hideMetrics = useAtomValue(hideMetricsAtom);

  const { isPending, error } = useQuery({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: createSafeQuery(() =>
      getUserByEmailServer({ data: { email: userEmail } })
    ),
    enabled: !!userEmail,
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="text-lg font-semibold text-destructive">
          Failed to load user data
        </div>
        <div className="text-sm text-muted-foreground">
          {error?.message || "An unexpected error occurred"}
        </div>
        <Button onClick={() => window.location.reload()}>Reload Page</Button>
      </div>
    );
  }

  // Wait for user data to load before rendering dashboard
  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div
          className={cn(
            "grid gap-6",
            hideMetrics
              ? "xl:grid-cols-1"
              : "xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]"
          )}
        >
          <Skeleton className="h-[26rem] w-full rounded-2xl" />
          <div className={cn(hideMetrics && "xl:flex xl:justify-end")}>
            <div className="grid w-full gap-4 md:grid-cols-3 xl:grid-cols-1 xl:max-w-md">
              <Skeleton className="h-28 w-full rounded-xl" />
              {!hideMetrics &&
                [1, 2, 3].map((item) => (
                  <Skeleton key={item} className="h-40 w-full rounded-xl" />
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <WelcomeMessage>
        Review balance, cashflow, and recent activity in one place, then jump
        directly into the transaction or report you need.
      </WelcomeMessage>

      <LazyMotion features={domAnimation}>
        <AnimatePresence mode="wait">
          <m.section
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.6,
              ease: "easeOut",
            }}
            className="flex flex-col gap-6"
          >
            <m.div
              layout
              className={cn(
                "grid grid-cols-1 gap-6",
                hideMetrics
                  ? "xl:grid-cols-1"
                  : "xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]"
              )}
            >
              <m.div layout className="space-y-6 order-1">
                <m.div
                  layout
                  initial={
                    shouldReduceMotion
                      ? false
                      : { opacity: 0, y: 20, scale: 0.96 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.5,
                    delay: 0,
                  }}
                >
                  <TotalBalance />
                </m.div>
              </m.div>

              <m.div
                layout
                className={cn(
                  "order-2 space-y-4",
                  hideMetrics && "xl:ml-auto xl:w-full xl:max-w-md"
                )}
              >
                <AnimatePresence initial={false}>
                  {!hideMetrics && (
                    <m.div
                      key="dashboard-metrics"
                      layout
                      initial={
                        shouldReduceMotion
                          ? false
                          : { opacity: 0, y: 14, scale: 0.98 }
                      }
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: -12, scale: 0.98 }
                      }
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.24,
                        ease: "easeOut",
                      }}
                    >
                      <DashboardMetrics />
                    </m.div>
                  )}
                </AnimatePresence>
              </m.div>
            </m.div>

            <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1.32fr)_minmax(0,0.92fr)]">
              <m.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.5,
                  delay: shouldReduceMotion ? 0 : 0.25,
                }}
                className="overflow-hidden"
              >
                <TransactionsList />
              </m.div>

              <div className="space-y-6">
                <m.div
                  initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.5,
                    delay: shouldReduceMotion ? 0 : 0.3,
                  }}
                >
                  <Suspense fallback={<ChartFallback />}>
                    <IncomeExpenseChart />
                  </Suspense>
                </m.div>
              </div>
            </div>
          </m.section>
        </AnimatePresence>
      </LazyMotion>
    </div>
  );
}

function ChartFallback() {
  return <Skeleton className="h-72 w-full" />;
}
