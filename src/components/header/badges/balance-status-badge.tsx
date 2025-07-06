import { useQuery } from "@tanstack/react-query";
import { useRouteUser } from "~/hooks/use-route-user";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email.server";
import { queryDictionary } from "~/queries/dictionary";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function BalanceStatusBadge() {
  const userEmail = useRouteUser();

  const { error, isPending, data } = useQuery({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
  });

  if (!data) {
    return null;
  }

  const isPositive = data?.data!.totalBalance >= 0;

  return (
    <>
      {error ? (
        <Badge variant="destructive" className="gap-1.5">
          Error fetching balance
        </Badge>
      ) : null}
      {isPending ? (
        <Badge variant="outline" className="gap-1.5">
          <span className="animate-pulse">Loading balance...</span>
        </Badge>
      ) : null}
      {data?.data?.totalBalance !== undefined ? (
        <Badge
          variant={isPositive ? "secondary" : "destructive"}
          className="gap-1.5"
        >
          {isPositive ? (
            <TrendingUp size={14} className="text-emerald-500" />
          ) : (
            <TrendingDown size={14} className="text-rose-500" />
          )}
          {isPositive ? "Surplus" : "Deficit"}
        </Badge>
      ) : null}
    </>
  );
}
