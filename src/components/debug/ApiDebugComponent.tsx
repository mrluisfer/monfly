import { useQuery } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getTotalExpensesByEmailServer } from "~/lib/api/transaction/get-total-expenses-by-email";
import { getTransactionByEmailServer } from "~/lib/api/transaction/get-transaction-by-email";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email";
import { queryDictionary } from "~/queries/dictionary";

/** One-line status for a debug panel: pending, failed, empty or loaded. */
function describeQuery<TData>(
  query: { isPending: boolean; error: Error | null; data: TData },
  describeSuccess: (data: NonNullable<TData>) => string,
): string {
  if (query.isPending) {
    return " Loading...";
  }
  if (query.error) {
    return ` Error: ${query.error.message}`;
  }
  if (query.data === undefined || query.data === null) {
    return " Not loaded";
  }
  return describeSuccess(query.data as NonNullable<TData>);
}

export function ApiDebugComponent() {
  const userEmail = useRouteUser();

  const transactionQuery = useQuery({
    enabled: false, // Manual trigger only
    queryFn: async () => {
      const start = Date.now();

      try {
        const result = await getTransactionByEmailServer({
          data: { email: userEmail },
        });
        return result;
      } catch (error) {
        const duration = Date.now() - start;
        console.error(`❌ Transaction query failed in ${duration}ms`, error);
        throw error;
      }
    },
    queryKey: [queryDictionary.transactions, userEmail, "debug"],
  });

  const userQuery = useQuery({
    enabled: false, // Manual trigger only
    queryFn: async () => {
      const start = Date.now();

      try {
        const result = await getUserByEmailServer({
          data: { email: userEmail },
        });
        return result;
      } catch (error) {
        const duration = Date.now() - start;
        console.error(`❌ User query failed in ${duration}ms`, error);
        throw error;
      }
    },
    queryKey: [queryDictionary.user, userEmail, "debug"],
  });

  const expenseQuery = useQuery({
    enabled: false, // Manual trigger only
    queryFn: async () => {
      const start = Date.now();

      try {
        const result = await getTotalExpensesByEmailServer({
          data: { email: userEmail },
        });
        return result;
      } catch (error) {
        const duration = Date.now() - start;
        console.error(`❌ Expense query failed in ${duration}ms`, error);
        throw error;
      }
    },
    queryKey: [queryDictionary.transactions, userEmail, "expenses", "debug"],
  });

  return (
    <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
      <h3 className="font-bold text-lg">API Debug Panel</h3>
      <p className="text-muted-foreground text-sm">User: {userEmail}</p>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => transactionQuery.refetch()}
          disabled={transactionQuery.isPending}
          variant="outline"
        >
          {transactionQuery.isPending ? "Loading..." : "Test Transactions API"}
        </Button>

        <Button
          onClick={() => userQuery.refetch()}
          disabled={userQuery.isPending}
          variant="outline"
        >
          {userQuery.isPending ? "Loading..." : "Test User API"}
        </Button>

        <Button
          onClick={() => expenseQuery.refetch()}
          disabled={expenseQuery.isPending}
          variant="outline"
        >
          {expenseQuery.isPending ? "Loading..." : "Test Expenses API"}
        </Button>
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <strong>Transactions:</strong>
          {describeQuery(
            transactionQuery,
            (data) => ` Success (${data.data?.length || 0} items)`,
          )}
        </div>

        <div>
          <strong>User:</strong>
          {describeQuery(userQuery, (data) => ` Success (${data.data?.name})`)}
        </div>

        <div>
          <strong>Expenses:</strong>
          {describeQuery(expenseQuery, (data) => ` Success ($${data})`)}
        </div>
      </div>
    </div>
  );
}
