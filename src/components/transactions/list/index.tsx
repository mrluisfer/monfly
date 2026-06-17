import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { BalanceStatusBadge } from "~/components/header/badges/BalanceStatusBadge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";
import { TransactionHoverProvider } from "~/context/transaction-hover-provider";
import { useActiveCard, useCards } from "~/hooks/cards";
import { useGetCategoriesByEmail } from "~/hooks/categories";
import { useIsMobile } from "~/hooks/use-mobile";
import { useIsMounted } from "~/hooks/ui/useIsMounted";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getTransactionByEmailServer } from "~/lib/api/transaction/get-transaction-by-email";
import { createSafeQuery } from "~/lib/stream-utils";
import { queryKeys } from "~/utils/query-keys";
import { TransactionWithUser } from "~/types/TransactionWithUser";
import { RefreshCcwIcon, WalletIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";

import AddTransactionButton from "./AddTransactionButton";
import { CardBadge, type CardSummary } from "./CardBadge";
import { DesktopContent } from "./DesktopContent";
import { MobileContent } from "./MobileContent";
import { MobileHeader } from "./MobileHeader";
import { TransactionsInsights } from "./TransactionsInsights";

type TransactionsResponse = {
  data?: TransactionWithUser[];
  total?: number;
};

type CardRecord = {
  id: string;
  name: string;
  last4?: string | null;
  color?: string | null;
};

export default function TransactionsList() {
  const userEmail = useRouteUser();
  const activeCard = useActiveCard();
  const pathname = useLocation().pathname;
  const isTransactionsRoute = pathname.includes("/transactions");
  const limit = isTransactionsRoute ? 1000 : 30;

  const { data, isPending, error, refetch, isRefetching } = useQuery({
    queryKey: [...queryKeys.transactions.byEmail(userEmail, activeCard), limit],
    queryFn: createSafeQuery(
      () =>
        getTransactionByEmailServer({
          data: { email: userEmail, limit, cardId: activeCard },
        }),
      8000,
    ),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
  });

  const transactions = (data as TransactionsResponse)?.data ?? [];
  const total = (data as TransactionsResponse)?.total ?? 0;

  // Resolve each transaction's `cardId` to a card so rows can show which card
  // they belong to now that the app is multi-card. Shares the cached cards
  // query, so this adds no extra request.
  const { data: cardsData } = useCards();
  const cardsById = useMemo(() => {
    const map = new Map<string, CardSummary>();
    const cards = (cardsData?.data as CardRecord[] | undefined) ?? [];
    for (const card of cards) {
      map.set(card.id, {
        id: card.id,
        name: card.name,
        last4: card.last4,
        color: card.color,
      });
    }
    return map;
  }, [cardsData]);

  const activeCardSummary = activeCard ? cardsById.get(activeCard) : undefined;

  // Map each category name to the icon the user picked for it, so a transaction
  // row can show the same icon the Categories view uses. Shares the cached
  // categories query — no extra request.
  const { data: categories } = useGetCategoriesByEmail();
  const categoryIconsByName = useMemo(() => {
    const map = new Map<string, string>();
    for (const category of categories) {
      map.set(category.name.trim().toLowerCase(), category.icon);
    }
    return map;
  }, [categories]);

  // The CSS classes (hidden md:block / md:hidden) keep SSR + the hydration
  // frame consistent on any viewport; after mount we stop mounting the hidden
  // variant entirely so mobile doesn't pay for the desktop table (and vice
  // versa).
  const isMobile = useIsMobile();
  const isMounted = useIsMounted();
  const showDesktop = !isMounted || !isMobile;
  const showMobile = !isMounted || isMobile;

  return (
    <TransactionHoverProvider>
      {showDesktop && (
        <div className="mt-4 hidden md:block">
          <PageHeader
            icon={<WalletIcon className="size-5" aria-hidden="true" />}
            title="Transactions"
            description="Search, filter, edit, or add transactions from one place."
            actions={
              <div className="flex items-center justify-end gap-4">
                <Badge variant={"default"}>
                  {total} {total === 1 ? "record" : "records"}
                </Badge>
                {activeCardSummary && <CardBadge card={activeCardSummary} />}
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
                      <Spinner className="mr-2 size-4" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCcwIcon className="size-4" />
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
          <Card className="mt-2 min-h-[30rem] rounded-2xl border-2 p-0 shadow-none">
            <CardContent className="px-5 pt-3 pb-5">
              <DesktopContent
                userEmail={userEmail}
                isPending={isPending}
                error={error}
                transactions={transactions}
                refetch={refetch}
                cardsById={cardsById}
                categoryIconsByName={categoryIconsByName}
              />
            </CardContent>
          </Card>
          <div className="mt-4">
            <TransactionsInsights transactions={transactions} />
          </div>
        </div>
      )}

      {showMobile && (
        <div className="space-y-4 md:hidden">
          <section className="bg-card rounded-2xl px-2 py-4 lg:p-4">
            <MobileHeader
              total={total}
              isPending={isPending}
              transactionsCount={transactions.length}
              refetch={refetch}
              activeCard={activeCardSummary}
            />
            <MobileContent
              userEmail={userEmail}
              isPending={isPending}
              error={error}
              transactions={transactions}
              refetch={refetch}
              cardsById={cardsById}
              categoryIconsByName={categoryIconsByName}
            />
          </section>
        </div>
      )}
    </TransactionHoverProvider>
  );
}
