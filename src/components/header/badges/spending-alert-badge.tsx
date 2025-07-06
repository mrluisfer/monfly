import { useQuery } from "@tanstack/react-query";
import { useRouteUser } from "~/hooks/use-route-user";
import { getTransactionByEmailServer } from "~/lib/api/transaction/get-transaction-by-email.server";
import { queryDictionary } from "~/queries/dictionary";
import { AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const PAGE_SIZE = 1000;

export function SpendingAlertBadge() {
  const limit = 1000;
  const userEmail = useRouteUser();

  const { data, isPending, error } = useQuery({
    queryKey: [queryDictionary.transactions, userEmail, 1],
    queryFn: () =>
      getTransactionByEmailServer({
        data: {
          email: userEmail,
          page: 1,
          pageSize: PAGE_SIZE,
        },
      }),
    enabled: !!userEmail,
  });

  if (isPending) {
    return (
      <Badge variant="outline" className="gap-1.5">
        <span className="animate-pulse">Loading...</span>
      </Badge>
    );
  }

  if (error) {
    return (
      <Badge variant="destructive" className="gap-1.5">
        Error fetching transactions
      </Badge>
    );
  }

  const spent =
    data?.data?.reduce((acc, tx) => {
      if (tx.type === "expense") return acc + tx.amount;
      return acc;
    }, 0) ?? 0;

  const percent = (spent / limit) * 100;
  if (percent < 80) return null;

  return (
    <Badge variant="destructive" className="gap-1.5 animate-pulse">
      <AlertTriangle size={14} className="text-amber-500" />
      {percent >= 100 ? "Limit Exceeded!" : "Budget Almost Spent"}
    </Badge>
  );
}
