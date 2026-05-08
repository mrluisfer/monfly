import { useQuery } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { BalanceStatusBadge } from "~/components/header/badges/BalanceStatusBadge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";
import { TransactionHoverProvider } from "~/context/transaction-hover-provider";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getTransactionByEmailServer } from "~/lib/api/transaction/get-transaction-by-email";
import { createSafeQuery } from "~/lib/stream-utils";
import { queryDictionary } from "~/queries/dictionary";
import { TransactionWithUser } from "~/types/TransactionWithUser";
import { RefreshCcwIcon, WalletIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";

import AddTransactionButton from "./AddTransactionButton";
import { DesktopContent } from "./DesktopContent";
import { MobileContent } from "./MobileContent";
import { MobileHeader } from "./MobileHeader";
import { TransactionsInsights } from "./TransactionsInsights";

type TransactionsResponse = {
  data?: TransactionWithUser[];
  total?: number;
};

export default function TransactionsList() {
  const userEmail = useRouteUser();
  const pathname = useLocation().pathname;
  const isTransactionsRoute = pathname.includes("/transactions");
  const limit = isTransactionsRoute ? 1000 : 30;

  const { data, isPending, error, refetch, isRefetching } = useQuery({
    queryKey: [queryDictionary.transactions, userEmail, limit],
    queryFn: createSafeQuery(
      () =>
        getTransactionByEmailServer({
          data: { email: userEmail, limit },
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
      <div className="hidden md:block mt-4">
        <PageHeader
          icon={<WalletIcon className="size-5" aria-hidden="true" />}
          title="Transactions"
          description="Search, filter, edit, or add transactions from one place."
          actions={
            <div className="flex gap-4 items-center justify-end">
              <Badge variant={"default"}>
                {total} {total === 1 ? "record" : "records"}
              </Badge>
              <BalanceStatusBadge className="rounded-full" />
              <Button
                onClick={() => refetch()}
                disabled={isPending || transactions.length === 0}
                title="Refresh transactions"
                variant={isRefetching ? "default" : "outline"}
                size="sm"
              >
                {isPending || isRefetching ? (
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
              {pathname.includes("/transactions") && (
                <div className="hidden md:block">
                  <AddTransactionButton />
                </div>
              )}
            </div>
          }
        />
        <Card className="min-h-[30rem] rounded-2xl border-2 p-0 shadow-none mt-2">
          <CardContent className="px-5 pb-5 pt-3">
            <DesktopContent
              userEmail={userEmail}
              isPending={isPending}
              error={error}
              transactions={transactions}
              refetch={refetch}
            />
          </CardContent>
        </Card>
        <div className="mt-4">
          <TransactionsInsights transactions={transactions} />
        </div>
      </div>

      <div className="space-y-4 md:hidden">
        <section className="bg-card rounded-2xl lg:p-4 py-4 px-2">
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
