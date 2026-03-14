import { lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BalanceActions } from "~/components/balance/BalanceActions";
import TotalBalance from "~/components/balance/TotalBalance";
import { DashboardMetrics } from "~/components/home/DashboardMetrics";
import { WelcomeMessage } from "~/components/home/WelcomeMessage";
import TransactionsList from "~/components/transactions/list";
import { Skeleton } from "~/components/ui/skeleton";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email";
import { createSafeQuery } from "~/lib/stream-utils";
import { queryDictionary } from "~/queries/dictionary";
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
} from "framer-motion";

const IncomeExpenseChart = lazy(
  () => import("~/components/charts/IncomeExpenseChart")
);
const ChartTransactionsByMonth = lazy(
  () => import("~/components/charts/ChartTransactionsByMonth")
);
const ChartTabs = lazy(() =>
  import("~/components/home/ChartTabs").then((module) => ({
    default: module.ChartTabs,
  }))
);

export const Route = createFileRoute("/_authed/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  const userEmail = useRouteUser();
  const shouldReduceMotion = useReducedMotion();

  const { isPending, error } = useQuery({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: createSafeQuery(() =>
      getUserByEmailServer({ data: { email: userEmail } })
    ),
    enabled: !!userEmail,
  });

  if (error) {
    console.error("Home page user query error:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="text-lg font-semibold text-destructive">
          Failed to load user data
        </div>
        <div className="text-sm text-muted-foreground">
          {error?.message || "An unexpected error occurred"}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Reload Page
        </button>
      </div>
    );
  }

  // Wait for user data to load before rendering dashboard
  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-[1.75rem]" />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
          <Skeleton className="h-[26rem] w-full rounded-[2rem]" />
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
            {[1, 2, 3].map((item) => (
              <Skeleton
                key={item}
                className="h-40 w-full rounded-[1.6rem]"
              />
            ))}
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
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
              <div className="space-y-6 order-1">
                <m.div
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

                <m.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.5,
                    delay: shouldReduceMotion ? 0 : 0.2,
                  }}
                  className="overflow-hidden"
                >
                  <BalanceActions />
                </m.div>
              </div>

              <div className="space-y-6 order-2">
                <m.div
                  initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.5,
                    delay: shouldReduceMotion ? 0 : 0.1,
                  }}
                >
                  <DashboardMetrics />
                </m.div>
              </div>
            </div>

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

                <m.div
                  initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.5,
                    delay: shouldReduceMotion ? 0 : 0.4,
                  }}
                >
                  <Suspense fallback={<ChartFallback />}>
                    <ChartTransactionsByMonth />
                  </Suspense>
                </m.div>

                <m.div
                  initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.5,
                    delay: shouldReduceMotion ? 0 : 0.5,
                  }}
                >
                  <Suspense fallback={<ChartFallback />}>
                    <ChartTabs />
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
