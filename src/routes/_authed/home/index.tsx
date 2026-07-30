import { hideMetricsAtom } from "@/state";
import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import {
  CalendarDaysIcon,
  LayoutDashboardIcon,
  SquareActivityIcon,
} from "lucide-react";
import { lazy, Suspense } from "react";
import { z } from "zod";
import TotalBalance from "~/components/balance/TotalBalance";
import { DashboardMetrics } from "~/components/home/DashboardMetrics";
import { PageHeader } from "~/components/layout/PageHeader";
import { UpcomingReceivablesCard } from "~/components/loans/UpcomingReceivablesCard";
import TransactionsList from "~/components/transactions/list";
import { Skeleton } from "~/components/ui/skeleton";
import { StatusBadge } from "~/components/ui/status-badge";
import { cn } from "~/lib/utils";

import { BalanceDetails } from "@/components/balance/balance-details";
import { CardSelector } from "@/components/cards/CardSelector";

const IncomeExpenseChart = lazy(
  () => import("~/components/charts/IncomeExpenseChart"),
);

const SpendingHeatmap = lazy(
  () => import("~/components/charts/SpendingHeatmap"),
);

/**
 * `card` is an optional filter: undefined = aggregate "all cards" view (the
 * default, identical to the pre-cards behavior); a uuid scopes the whole
 * dashboard to that card.
 */
const homeSearchSchema = z.object({
  card: z.string().uuid().optional(),
});

export const Route = createFileRoute("/_authed/home/")({
  component: RouteComponent,
  validateSearch: homeSearchSchema,
});

function todayLabel() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

function RouteComponent() {
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
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge
              variant="primary"
              size="md"
              icon={<CalendarDaysIcon />}
            >
              {todayLabel()}
            </StatusBadge>
            <CardSelector className="w-44" />
          </div>
        }
      />

      {/* ponytail: no motion here — the entry animations were JS-driven on the
          whole dashboard subtree. Widgets stream in on their own skeletons, so
          a single CSS fade is enough (and respects prefers-reduced-motion via
          tw-animate-css). */}
      <div className="motion-safe:animate-in motion-safe:fade-in space-y-6 duration-300 sm:space-y-8">
        <div
          className={cn(
            "grid grid-cols-1 gap-6",
            hideMetrics
              ? "xl:grid-cols-1"
              : "xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]",
          )}
        >
          <div className="space-y-4">
            <TotalBalance />
            <BalanceDetails />
          </div>

          {!hideMetrics && (
            <div className="space-y-4">
              <DashboardMetrics />
              <UpcomingReceivablesCard />
            </div>
          )}
        </div>

        <div
          className={cn(
            "grid grid-cols-1 gap-6",
            "3xl:grid-cols-[minmax(0,1.32fr)_minmax(0,0.92fr)]",
          )}
        >
          {/* wrapper kept on purpose: TransactionsList renders several root
              nodes, so without it they'd each become separate grid items. */}
          <div>
            <TransactionsList />
          </div>

          <div className="space-y-6">
            <PageHeader
              icon={
                <SquareActivityIcon className="size-5" aria-hidden="true" />
              }
              title="Daily activity"
              description="Spot your cashflow rhythm day by day."
            />
            <Suspense
              fallback={<Skeleton className="h-56 w-full rounded-2xl" />}
            >
              <SpendingHeatmap />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
