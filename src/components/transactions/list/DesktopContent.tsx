import { DataNotFoundPlaceholder } from "~/components/shared/DataNotFoundPlaceholder";
import { TransactionWithUser } from "~/types/TransactionWithUser";

import { CardSummary } from "./CardBadge";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";
import { DataTableDemo } from "./transactionsTable";

export function DesktopContent({
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
    <div className="space-y-6">
      <DataTableDemo
        data={transactions}
        cardsById={cardsById}
        categoryIconsByName={categoryIconsByName}
      />
    </div>
  );
}
