import { lazy, Suspense } from "react";
import { hideMetricsAtom } from "@/state";
import { createFileRoute } from "@tanstack/react-router";
import TotalBalance from "~/components/balance/TotalBalance";
import { DashboardMetrics } from "~/components/home/DashboardMetrics";
import { PageHeader } from "~/components/layout/PageHeader";
import { Section } from "~/components/layout/Section";
import { UpcomingReceivablesCard } from "~/components/loans/UpcomingReceivablesCard";
import TransactionsList from "~/components/transactions/list";
import { Skeleton } from "~/components/ui/skeleton";
import { StatusBadge } from "~/components/ui/status-badge";
import { cn } from "~/lib/utils";
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
} from "motion/react";
import { useAtomValue } from "jotai";
import { CalendarDaysIcon, LayoutDashboardIcon } from "lucide-react";

import { BalanceDetails } from "@/components/balance/balance-details";

const IncomeExpenseChart = lazy(
  () => import("~/components/charts/IncomeExpenseChart"),
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
  const shouldReduceMotion = useReducedMotion();
  const hideMetrics = useAtomValue(hideMetricsAtom);

  // No gating query here: each widget (TotalBalance, BalanceDetails,
  // DashboardMetrics, TransactionsList) fetches its own data and renders its
  // own skeleton/error state, so the dashboard streams in progressively.
  return (
    <div className="space-y-6 sm:space-y-8">
      <PageHeader
        className="mt-4 md:mt-0"
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
                  : "xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]",
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
                className="space-y-4"
              >
                <TotalBalance />
                <BalanceDetails />
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
                "3xl:grid-cols-[minmax(0,1.32fr)_minmax(0,0.92fr)]",
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
                <TransactionsList />
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
                  <Suspense
                    fallback={<Skeleton className="h-72 w-full rounded-2xl" />}
                  >
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
