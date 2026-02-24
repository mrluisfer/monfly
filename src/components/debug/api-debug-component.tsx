import { useQuery } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { useRouteUser } from "~/hooks/use-route-user";
import { getTotalExpensesByEmailServer } from "~/lib/api/transaction/get-total-expenses-by-email";
import { getTransactionByEmailServer } from "~/lib/api/transaction/get-transaction-by-email";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email";
import { queryDictionary } from "~/queries/dictionary";

export function ApiDebugComponent() {
  const userEmail = useRouteUser();

  const transactionQuery = useQuery({
    queryKey: [queryDictionary.transactions, userEmail, "debug"],
    queryFn: async () => {
      const start = Date.now();

      try {
        const result = await getTransactionByEmailServer({
          data: { email: userEmail },
        });
        const duration = Date.now() - start;
        return result;
      } catch (error) {
        const duration = Date.now() - start;
        console.error("❌ Transaction query failed in", duration + "ms", error);
        throw error;
      }
    },
    enabled: false, // Manual trigger only
  });

  const userQuery = useQuery({
    queryKey: [queryDictionary.user, userEmail, "debug"],
    queryFn: async () => {
      const start = Date.now();

      try {
        const result = await getUserByEmailServer({
          data: { email: userEmail },
        });
        const duration = Date.now() - start;
        return result;
      } catch (error) {
        const duration = Date.now() - start;
        console.error("❌ User query failed in", duration + "ms", error);
        throw error;
      }
    },
    enabled: false, // Manual trigger only
  });

  const expenseQuery = useQuery({
    queryKey: [queryDictionary.transactions, userEmail, "expenses", "debug"],
    queryFn: async () => {
      const start = Date.now();

      try {
        const result = await getTotalExpensesByEmailServer({
          data: { email: userEmail },
        });
        const duration = Date.now() - start;
        return result;
      } catch (error) {
        const duration = Date.now() - start;
        console.error("❌ Expense query failed in", duration + "ms", error);
        throw error;
      }
    },
    enabled: false, // Manual trigger only
  });

  return (
    <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
      <h3 className="font-bold text-lg">API Debug Panel</h3>
      <p className="text-sm text-muted-foreground">User: {userEmail}</p>

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
          {transactionQuery.isPending
            ? " Loading..."
            : transactionQuery.error
              ? ` Error: ${transactionQuery.error.message}`
              : transactionQuery.data
                ? ` Success (${transactionQuery.data.data?.length || 0} items)`
                : " Not loaded"}
        </div>

        <div>
          <strong>User:</strong>
          {userQuery.isPending
            ? " Loading..."
            : userQuery.error
              ? ` Error: ${userQuery.error.message}`
              : userQuery.data
                ? ` Success (${userQuery.data.data?.name})`
                : " Not loaded"}
        </div>

        <div>
          <strong>Expenses:</strong>
          {expenseQuery.isPending
            ? " Loading..."
            : expenseQuery.error
              ? ` Error: ${expenseQuery.error.message}`
              : expenseQuery.data !== undefined
                ? ` Success ($${expenseQuery.data})`
                : " Not loaded"}
        </div>
      </div>
    </div>
  );
}
