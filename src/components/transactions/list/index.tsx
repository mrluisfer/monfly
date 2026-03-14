import { useQuery } from "@tanstack/react-query";
import { BalanceStatusBadge } from "~/components/header/badges/BalanceStatusBadge";
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
import { useRouteUser } from "~/hooks/useRouteUser";
import { getTransactionByEmailServer } from "~/lib/api/transaction/get-transaction-by-email";
import { createSafeQuery } from "~/lib/stream-utils";
import { queryDictionary } from "~/queries/dictionary";
import { TransactionWithUser } from "~/types/TransactionWithUser";
import { RefreshCcwIcon, WalletIcon } from "lucide-react";

import { DesktopContent } from "./DesktopContent";
import { MobileContent } from "./MobileContent";
import { MobileHeader } from "./MobileHeader";

type TransactionsResponse = {
  data?: TransactionWithUser[];
  total?: number;
};

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

  const transactions = (data as TransactionsResponse)?.data ?? [];
  const total = (data as TransactionsResponse)?.total ?? 0;

  return (
    <TransactionHoverProvider>
      <div className="hidden md:block">
        <Card className="finance-panel min-h-125 rounded-[1.9rem] border-0 p-0 shadow-none">
          <CardHeader className="border-b border-border/60 px-5 pt-5 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Activity feed
                </p>
                <CardTitle className="text-xl flex items-center gap-2">
                  <WalletIcon className="size-5 text-primary" />
                  Transactions
                </CardTitle>
              </div>
              <div className="ml-auto flex items-center gap-3 md:gap-4">
                <span className="finance-chip rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  {total} {total === 1 ? "record" : "records"}
                </span>
                <BalanceStatusBadge className="rounded-full" />
                <Button
                  onClick={() => refetch()}
                  disabled={isPending || transactions.length === 0}
                  title="Refresh transactions"
                  variant="outline"
                  size="sm"
                  className="finance-chip h-10 rounded-full px-4"
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
              </div>
            </div>
            <CardDescription className="pt-2 text-sm leading-6">
              Search, filter, edit, or add transactions from one place.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 py-5">
            <DesktopContent
              userEmail={userEmail}
              isPending={isPending}
              error={error}
              transactions={transactions}
              refetch={refetch}
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 md:hidden">
        <section className="finance-panel rounded-[1.75rem] p-4">
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
        </section>
      </div>
    </TransactionHoverProvider>
  );
}
