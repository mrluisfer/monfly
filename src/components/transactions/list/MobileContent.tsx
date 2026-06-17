import { useMemo, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { DataNotFoundPlaceholder } from "~/components/shared/DataNotFoundPlaceholder";
import { Button } from "~/components/ui/button";
import { TransactionWithUser } from "~/types/TransactionWithUser";
import { ExternalLinkIcon } from "lucide-react";

import { CardSummary } from "./CardBadge";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";
import { TransactionCardList } from "./TransactionCardList";
import { TransactionSearchInput } from "./TransactionSearchInput";

type MobileFilter = "all" | "income" | "expense";

export function MobileContent({
  userEmail,
  isPending,
  error,
  transactions,
  refetch,
  cardsById,
  categoryIconsByName,
}: {
  userEmail: string;
  isPending: boolean;
  error: Error | null;
  transactions: TransactionWithUser[];
  refetch: () => void;
  cardsById?: Map<string, CardSummary>;
  categoryIconsByName?: Map<string, string>;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<MobileFilter>("all");
  const pathname = useLocation().pathname;
  const isTransactionsPage = pathname.includes("/transactions");

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesFilter =
        activeFilter === "all"
          ? true
          : transaction.type.toLowerCase() === activeFilter;

      const matchesSearch =
        !normalizedSearch ||
        transaction.description?.toLowerCase().includes(normalizedSearch) ||
        transaction.category?.toLowerCase().includes(normalizedSearch) ||
        transaction.type?.toLowerCase().includes(normalizedSearch);

      return matchesFilter && Boolean(matchesSearch);
    });
  }, [activeFilter, searchTerm, transactions]);

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

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <TransactionSearchInput
          id="mobile-transaction-search"
          value={searchTerm}
          onValueChange={setSearchTerm}
        />

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter transactions by type"
        >
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setActiveFilter("all")}
          >
            All
          </Button>
          <Button
            variant={activeFilter === "income" ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setActiveFilter("income")}
          >
            Income
          </Button>
          <Button
            variant={activeFilter === "expense" ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setActiveFilter("expense")}
          >
            Expense
          </Button>
        </div>
      </div>

      {filteredTransactions.length ? (
        <>
          <TransactionCardList
            data={filteredTransactions}
            cardsById={cardsById}
            categoryIconsByName={categoryIconsByName}
          />
          {isTransactionsPage ? null : (
            <div className="flex w-full items-center justify-center md:justify-start">
              <Button
                nativeButton={false}
                render={<Link to="/home/transactions" />}
              >
                <ExternalLinkIcon />
                More transactions
              </Button>
            </div>
          )}
        </>
      ) : (
        <DataNotFoundPlaceholder>
          No transactions match the current search or filter.
        </DataNotFoundPlaceholder>
      )}
    </div>
  );
}
