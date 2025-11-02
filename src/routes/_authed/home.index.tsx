import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import TotalBalance from "~/components/balance/TotalBalance";
import ChartByCategoryRadar from "~/components/charts/chart-by-category-radar";
import ChartTransactionsByMonth from "~/components/charts/chart-transactions-by-month";
import IncomeExpenseChart from "~/components/charts/income-expense-chart";
import { PageTitle } from "~/components/page-title";
import TransactionsList from "~/components/transactions/list";
import { Skeleton } from "~/components/ui/skeleton";
import { transactionTypes } from "~/constants/transaction-types";
import { useRouteUser } from "~/hooks/use-route-user";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email.server";
import { createSafeQuery } from "~/lib/stream-utils";
import { queryDictionary } from "~/queries/dictionary";

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
    <div>
      <header className="mb-6 flex justify-between items-center">
        <PageTitle description="This is your overview dashboard">
          Welcome back
          <span className="capitalize">, {data?.data?.name || "User"}!</span>
        </PageTitle>
      </header>
      <section className="flex flex-col gap-4">
        <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="order-2 space-y-4 xl:order-1 items-start justify-between w-full gap-4">
            <TotalBalance />
            <div className="w-full">
              <IncomeExpenseChart />
            </div>
          </div>

          <div className="order-1 md:order-2 md:col-span-2 xl:col-span-2">
            <TransactionsList />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
          <ChartByCategoryRadar type={transactionTypes.EXPENSE} />
          <ChartByCategoryRadar type={transactionTypes.INCOME} />
          <ChartTransactionsByMonth />
        </div>
      </section>
    </div>
  );
}
