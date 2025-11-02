import React from "react";
import { useQuery } from "@tanstack/react-query";
import { DataNotFoundPlaceholder } from "~/components/data-not-found-placeholder";
import { BalanceStatusBadge } from "~/components/header/badges/balance-status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { TransactionHoverProvider } from "~/context/transaction-hover-provider";
import { useRouteUser } from "~/hooks/use-route-user";
import { getTransactionByEmailServer } from "~/lib/api/transaction/get-transaction-by-email.server";
import { queryDictionary } from "~/queries/dictionary";

import AddTransactionButton from "./add-transaction-button";
import { DataTableDemo } from "./TransactionsTable";

export default function TransactionsList() {
  const userEmail = useRouteUser();

  // Debug the userEmail
  React.useEffect(() => {
    console.log("Current userEmail:", userEmail, "Type:", typeof userEmail);
  }, [userEmail]);

  const { data, isPending, error, refetch, isError } = useQuery({
    queryKey: [queryDictionary.transactions, userEmail || "no-user"],
    queryFn: async () => {
      if (!userEmail) {
        throw new Error("User email is required");
      }

      console.log("Fetching transactions for user:", userEmail);

      const result = await getTransactionByEmailServer({
        data: {
          email: userEmail,
        },
      });

      console.log("Transaction query result:", result);

      if (result.error) {
        throw new Error(result.message);
      }

      return result;
    },
    enabled:
      !!userEmail &&
      userEmail !== "no-user" &&
      typeof userEmail === "string" &&
      userEmail.length > 0,
  });

  // Safe defaults if data is undefined
  const transactions = data?.data ?? [];
  const total = data?.total ?? 0;

  // Debug logging
  React.useEffect(() => {
    console.log("TransactionsList render:", {
      userEmail,
      isPending,
      error: error?.message,
      dataExists: !!data,
      rawData: data,
      transactionsArray: transactions,
      transactionsCount: transactions.length,
      total,
      queryEnabled: !!userEmail && userEmail !== "no-user",
    });
  }, [
    userEmail,
    isPending,
    error,
    data,
    transactions,
    transactions.length,
    total,
  ]);

  return (
    <TransactionHoverProvider>
      <Card className="min-h-[500px]">
        <CardHeader>
          <div className="flex items-center gap-2 justify-between">
            <CardTitle>Transactions</CardTitle>
            <div className="flex items-center gap-6">
              <BalanceStatusBadge />
              <button
                onClick={() => refetch()}
                disabled={isPending}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600 rounded-md transition-colors disabled:opacity-50"
                title="Refresh transactions"
              >
                {isPending ? "Loading..." : "Refresh"}
              </button>
              <button
                onClick={async () => {
                  console.log("Manual test - userEmail:", userEmail);
                  if (userEmail) {
                    try {
                      const result = await getTransactionByEmailServer({
                        data: { email: userEmail },
                      });
                      console.log("Manual test result:", result);
                    } catch (err) {
                      console.error("Manual test error:", err);
                    }
                  }
                }}
                className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-400 dark:hover:bg-blue-500 rounded-md transition-colors"
                title="Test query manually"
              >
                Test
              </button>
              <AddTransactionButton />
            </div>
          </div>
          <CardDescription>You made {total} transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col h-full justify-between">
            {!userEmail && (
              <div className="flex items-center justify-center p-8">
                <div className="text-sm text-gray-500">
                  Loading user information...
                </div>
              </div>
            )}
            {userEmail && isPending && (
              <div className="flex items-center justify-center p-8">
                <div className="text-sm text-gray-500">
                  Loading transactions...
                </div>
              </div>
            )}
            {userEmail && error && (
              <div className="flex flex-col items-center justify-center p-8 space-y-4">
                <div className="text-red-600 text-center">
                  <p className="font-medium">Failed to load transactions</p>
                  <p className="text-sm mt-1">{error.message}</p>
                </div>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}
            {userEmail && !isPending && !error && (
              <>
                {Array.isArray(transactions) && transactions.length > 0 ? (
                  <DataTableDemo data={transactions} />
                ) : (
                  <div className="space-y-4">
                    <DataNotFoundPlaceholder>
                      No transactions found. Try adding your first transaction!
                    </DataNotFoundPlaceholder>
                    <div className="text-xs text-gray-500 text-center">
                      Debug Info: User: {userEmail}, Data:{" "}
                      {JSON.stringify(data, null, 2)}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </TransactionHoverProvider>
  );
}
