import { lazy, Suspense } from "react";
import { hideMetricsAtom } from "@/state";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
} from "framer-motion";
import { useAtomValue } from "jotai";
import { CalendarDaysIcon, LayoutDashboardIcon } from "lucide-react";

import TotalBalance from "~/components/balance/TotalBalance";
import { DashboardMetrics } from "~/components/home/DashboardMetrics";
import { PageHeader } from "~/components/layout/PageHeader";
import { Section } from "~/components/layout/Section";
import { UpcomingReceivablesCard } from "~/components/loans/UpcomingReceivablesCard";
import TransactionsList from "~/components/transactions/list";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { StatusBadge } from "~/components/ui/status-badge";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email";
import { createSafeQuery } from "~/lib/stream-utils";
import { cn } from "~/lib/utils";
import { queryDictionary } from "~/queries/dictionary";

const IncomeExpenseChart = lazy(
  () => import("~/components/charts/IncomeExpenseChart")
);

export const Route = createFileRoute("/_authed/home/")({
  component: RouteComponent,
});

function todayLabel() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

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
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-3 text-center">
        <div className="text-destructive text-base font-semibold">
          Failed to load user data
        </div>
        <p className="text-muted-foreground max-w-md text-sm">
          {error?.message || "An unexpected error occurred"}
        </p>
        <Button onClick={() => window.location.reload()}>Reload page</Button>
      </div>
    );
  }

  if (isPending) {
    return <DashboardSkeleton hideMetrics={hideMetrics} />;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        icon={<LayoutDashboardIcon className="size-5" aria-hidden="true" />}
        title="Overview"
        description="Track balance, cashflow, and recent activity in one place."
        actions={
          <StatusBadge variant="primary" size="md" icon={<CalendarDaysIcon />}>
            {todayLabel()}
          </StatusBadge>
        }
      />

      <LazyMotion features={domAnimation}>
        <AnimatePresence mode="wait">
          <m.div
            key="home-content"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.4,
              ease: "easeOut",
            }}
            className="space-y-6 sm:space-y-8"
          >
            <m.div
              layout
              className={cn(
                "grid grid-cols-1 gap-6",
                hideMetrics
                  ? "xl:grid-cols-1"
                  : "xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]"
              )}
            >
              <m.div
                layout
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0, y: 16, scale: 0.98 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.45,
                }}
              >
                <TotalBalance />
              </m.div>

              <AnimatePresence initial={false}>
                {!hideMetrics && (
                  <m.div
                    key="dashboard-metrics"
                    layout
                    initial={
                      shouldReduceMotion
                        ? false
                        : { opacity: 0, y: 12, scale: 0.98 }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: -10, scale: 0.98 }
                    }
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.3,
                      ease: "easeOut",
                    }}
                    className="space-y-4"
                  >
                    <DashboardMetrics />
                    <UpcomingReceivablesCard />
                  </m.div>
                )}
              </AnimatePresence>
            </m.div>

            <div
              className={cn(
                "grid grid-cols-1 gap-6",
                "3xl:grid-cols-[minmax(0,1.32fr)_minmax(0,0.92fr)]"
              )}
            >
              <m.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.4,
                  delay: shouldReduceMotion ? 0 : 0.15,
                }}
              >
                <Section
                  title="Recent transactions"
                  description="Your latest activity across accounts."
                >
                  <TransactionsList />
                </Section>
              </m.div>

              <m.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.4,
                  delay: shouldReduceMotion ? 0 : 0.2,
                }}
                className="xl:hidden"
              >
                <Section
                  title="Income vs expenses"
                  description="Monthly comparison of inflow and outflow."
                >
                  <Suspense fallback={<Skeleton className="h-72 w-full rounded-2xl" />}>
                    <IncomeExpenseChart />
                  </Suspense>
                </Section>
              </m.div>
            </div>
          </m.div>
        </AnimatePresence>
      </LazyMotion>
    </div>
  );
}

function DashboardSkeleton({ hideMetrics }: { hideMetrics: boolean }) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div
        className={cn(
          "grid gap-6",
          hideMetrics
            ? "xl:grid-cols-1"
            : "xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]"
        )}
      >
        <Skeleton className="h-[26rem] w-full rounded-2xl" />
        {!hideMetrics && (
          <div className="grid w-full gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        )}
      </div>
      <Skeleton className="h-72 w-full rounded-2xl" />
    </div>
  );
}
