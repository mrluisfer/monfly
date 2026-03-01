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
import { getTransactionByEmailServer } from "~/lib/api/transaction/get-transaction-by-email";
import { createSafeQuery } from "~/lib/stream-utils";
import { cn } from "~/lib/utils";
import { queryDictionary } from "~/queries/dictionary";
import { RefreshCcwIcon, WalletIcon } from "lucide-react";

import { TransactionCardList } from "./transaction-card-list";
import { DataTableDemo } from "./TransactionsTable";

export default function TransactionsList() {
  const userEmail = useRouteUser();

  const { data, isPending, error, refetch } = useQuery({
    queryKey: [queryDictionary.transactions, userEmail],
    queryFn: createSafeQuery(
      () =>
        getTransactionByEmailServer({
          data: { email: userEmail },
        }),
      8000
    ),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
  });

  const transactions = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <TransactionHoverProvider>
      {/* Desktop: keep Card wrapper */}
      <div className="hidden md:block">
        <Card className="min-h-125">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <WalletIcon className="size-5 text-primary" />
                Transactions
              </CardTitle>
              <div className="ml-auto flex items-center gap-3 md:gap-6">
                <Button
                  onClick={() => refetch()}
                  disabled={isPending || transactions.length === 0}
                  title="Refresh transactions"
                  variant="outline"
                  size="sm"
                  className="h-10 px-4"
                >
                  {isPending ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCcwIcon className="h-4 w-4" />
                      <span className="ml-2">Refresh</span>
                    </>
                  )}
                </Button>
                <BalanceStatusBadge />
              </div>
            </div>
            <CardDescription>You made {total} transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <DesktopContent
              userEmail={userEmail}
              isPending={isPending}
              error={error}
              transactions={transactions}
              refetch={refetch}
              data={data}
            />
          </CardContent>
        </Card>
      </div>

      {/* Mobile: no Card, clean edge-to-edge layout */}
      <div className="md:hidden">
        <MobileHeader
          total={total}
          isPending={isPending}
          transactionsCount={transactions.length}
          refetch={refetch}
        />
        <MobileContent
          userEmail={userEmail}
          isPending={isPending}
          error={error}
          transactions={transactions}
          refetch={refetch}
        />
      </div>
    </TransactionHoverProvider>
  );
}

function MobileHeader({
  total,
  isPending,
  transactionsCount,
  refetch,
}: {
  total: number;
  isPending: boolean;
  transactionsCount: number;
  refetch: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-1 mb-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
          <WalletIcon className="size-4.5 text-primary" />
          Transactions
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {total} {total === 1 ? "transaction" : "transactions"}
        </p>
      </div>
      <Button
        onClick={() => refetch()}
        disabled={isPending || transactionsCount === 0}
        variant="ghost"
        size="icon"
        className="size-9 rounded-xl"
      >
        <RefreshCcwIcon className={cn("size-4", isPending && "animate-spin")} />
      </Button>
    </div>
  );
}

function MobileContent({
  userEmail,
  isPending,
  error,
  transactions,
  refetch,
}: {
  userEmail: string;
  isPending: boolean;
  error: Error | null;
  transactions: any[];
  refetch: () => void;
}) {
  if (!userEmail) {
    return <LoadingState message="Loading user information..." />;
  }

  if (isPending) {
    return <LoadingState message="Loading transactions..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (!transactions.length) {
    return (
      <DataNotFoundPlaceholder>
        No transactions found. Try adding your first transaction!
      </DataNotFoundPlaceholder>
    );
  }

  return <TransactionCardList data={transactions} />;
}

function DesktopContent({
  userEmail,
  isPending,
  error,
  transactions,
  refetch,
  data,
}: {
  userEmail: string;
  isPending: boolean;
  error: Error | null;
  transactions: any[];
  refetch: () => void;
  data: any;
}) {
  if (!userEmail) {
    return <LoadingState message="Loading user information..." />;
  }

  if (isPending) {
    return <LoadingState message="Loading transactions..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (!transactions.length) {
    return (
      <DataNotFoundPlaceholder>
        No transactions found. Try adding your first transaction!
      </DataNotFoundPlaceholder>
    );
  }

  return <DataTableDemo data={transactions} />;
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner className="size-4" />
        {message}
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="text-center">
        <p className="font-medium text-destructive">
          Failed to load transactions
        </p>
        <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
      </div>
      <Button onClick={onRetry} variant="outline" size="lg">
        Retry
      </Button>
    </div>
  );
}
