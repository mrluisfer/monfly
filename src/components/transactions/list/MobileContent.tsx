import { useMemo, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { DataNotFoundPlaceholder } from "~/components/shared/DataNotFoundPlaceholder";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { TransactionWithUser } from "~/types/TransactionWithUser";
import { ExternalLinkIcon, SearchIcon } from "lucide-react";

import { CardSummary } from "./CardBadge";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";
import { TransactionCardList } from "./TransactionCardList";

type MobileFilter = "all" | "income" | "expense";

export function MobileContent({
  userEmail,
  isPending,
  error,
  transactions,
  refetch,
  cardsById,
}: {
  userEmail: string;
  isPending: boolean;
  error: Error | null;
  transactions: TransactionWithUser[];
  refetch: () => void;
  cardsById?: Map<string, CardSummary>;
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
        <label className="sr-only" htmlFor="mobile-transaction-search">
          Search transactions
        </label>
        <div className="relative">
          <Input
            id="mobile-transaction-search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search description or category"
            className="border-border/70 bg-background/70 h-11 rounded-full pl-10"
            type="search"
            inputMode="search"
          />
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
        </div>

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
