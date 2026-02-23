import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BalanceActions } from "~/components/balance/BalanceActions";
import TotalBalance from "~/components/balance/TotalBalance";
import ChartTransactionsByMonth from "~/components/charts/chart-transactions-by-month";
import IncomeExpenseChart from "~/components/charts/income-expense-chart";
import { ChartTabs } from "~/components/home/chart-tabs";
import { DashboardMetrics } from "~/components/home/dashboard-metrics";
import { ManagementTabs } from "~/components/home/management-tabs";
import { WelcomeMessage } from "~/components/home/welcome-message";
import TransactionsList from "~/components/transactions/list";
import { Skeleton } from "~/components/ui/skeleton";
import { useRouteUser } from "~/hooks/use-route-user";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email.server";
import { createSafeQuery } from "~/lib/stream-utils";
import { queryDictionary } from "~/queries/dictionary";
import { AnimatePresence, motion } from "framer-motion";

export const Route = createFileRoute("/_authed/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  const userEmail = useRouteUser();

  const { data, isPending, error } = useQuery({
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
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeMessage>
        Here's a quick overview of your finances. Dive in to explore detailed
        insights and manage your funds effectively.
      </WelcomeMessage>

      <AnimatePresence mode="wait">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column: Balance & Transactions (Primary Focus) */}
            <div className="xl:col-span-2 space-y-6 order-1">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0 }}
              >
                <TotalBalance />
                <BalanceActions />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="overflow-hidden"
              >
                <TransactionsList />
              </motion.div>
            </div>

            {/* Right Column: Metrics & Charts (Secondary) */}
            <div className="space-y-6 order-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <DashboardMetrics />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <IncomeExpenseChart />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <ChartTransactionsByMonth />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <ChartTabs />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <ManagementTabs />
              </motion.div>
            </div>
          </div>
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
