import { useQuery } from "@tanstack/react-query";
import { DataNotFoundPlaceholder } from "~/components/data-not-found-placeholder";
import { BalanceStatusBadge } from "~/components/header/badges/balance-status-badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";
import { TransactionHoverProvider } from "~/context/transaction-hover-provider";
import { useRouteUser } from "~/hooks/use-route-user";
import { getTransactionByEmailServer } from "~/lib/api/transaction/get-transaction-by-email.server";
import { createSafeQuery } from "~/lib/stream-utils";
import { queryDictionary } from "~/queries/dictionary";
import { RefreshCcwIcon } from "lucide-react";

import AddTransactionButton from "./add-transaction-button";
import { DataTableDemo } from "./TransactionsTable";

export default function TransactionsList() {
  const userEmail = useRouteUser();

  const { data, isPending, error, refetch, isError } = useQuery({
    queryKey: [queryDictionary.transactions, userEmail],
    queryFn: createSafeQuery(
      () =>
        getTransactionByEmailServer({
          data: { email: userEmail },
        }),
      8000 // 8 second timeout
    ),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 2, // 2 minutes cache
    gcTime: 1000 * 60 * 5, // 5 minutes garbage collection
    retry: 1,
    retryDelay: 1000,
  });

  const transactions = data?.data ?? [];
  const total = data?.total ?? 0;

  console.log("TransactionsList query state:", {
    userEmail,
    enabled: !!userEmail,
    isPending,
    isError,
    hasData: !!data,
    error: error?.message,
  });

  return (
    <TransactionHoverProvider>
      <Card className="min-h-[500px]">
        <CardHeader>
          <div className="flex items-center gap-2 justify-between">
            <CardTitle>Transactions</CardTitle>
            <div className="flex items-center gap-6">
              <Button
                onClick={() => refetch()}
                disabled={isPending || transactions.length === 0}
                title="Refresh transactions"
                variant={"outline"}
              >
                {isPending ? (
                  <>
                    <Spinner />
                    Loading...
                  </>
                ) : (
                  <>
                    <RefreshCcwIcon
                      className={isPending ? "animate-spin" : ""}
                    />
                    Refresh
                  </>
                )}
              </Button>
              <BalanceStatusBadge />
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
