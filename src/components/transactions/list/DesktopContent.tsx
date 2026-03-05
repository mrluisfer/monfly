import { DataNotFoundPlaceholder } from "~/components/DataNotFoundPlaceholder";
import { TransactionWithUser } from "~/types/TransactionWithUser";

import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";
import { DataTableDemo } from "./transactionsTable";

export function DesktopContent({
  userEmail,
  isPending,
  error,
  transactions,
  refetch,
}: {
  userEmail: string;
  isPending: boolean;
  error: Error | null;
  transactions: TransactionWithUser[];
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

  return <DataTableDemo data={transactions} />;
}
