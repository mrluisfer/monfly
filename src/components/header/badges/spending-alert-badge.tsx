import { useQuery } from "@tanstack/react-query";
import { useRouteUser } from "~/hooks/use-route-user";
import { getTotalExpensesByEmailServer } from "~/lib/api/transaction/get-total-expenses-by-email.server";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email.server";
import { queryDictionary } from "~/queries/dictionary";
import { AlertTriangle, ChartSpline } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function SpendingAlertBadge() {
  const userEmail = useRouteUser();

  const {
    data: spent = 0,
    isPending: isSpentLoading,
    error: spentError,
  } = useQuery({
    queryKey: [queryDictionary.transactions, userEmail],
    queryFn: () =>
      getTotalExpensesByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
  });

  const {
    data: userData,
    isPending: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
  });

  if (isSpentLoading || isUserLoading) {
    return (
      <Badge variant="outline" className="gap-1.5" aria-live="polite">
        <span className="animate-pulse">Loading...</span>
      </Badge>
    );
  }

  if (spentError || userError) {
    return (
      <Badge variant="destructive" className="gap-1.5">
        Error fetching budget
      </Badge>
    );
  }

  const balance = Number(userData?.data?.totalBalance) ?? 0;

  if (!balance || isNaN(balance)) {
    return (
      <Badge variant="secondary" className="gap-1.5">
        <ChartSpline className="text-muted-foreground" />
        Balance not set
      </Badge>
    );
  }

  if (balance <= 0) {
    return (
      <Badge variant="destructive" className="gap-1.5">
        <AlertTriangle size={14} className="text-amber-500" />
        Your balance is zero or negative
      </Badge>
    );
  }

  const percent = Math.min((Number(spent) / balance) * 100, 9999);

  if (percent < 80) {
    return (
      <Badge variant="secondary" className="gap-1.5">
        <ChartSpline className="text-green-500" />
        Budget is safe ({percent.toFixed(0)}%)
      </Badge>
    );
  }

  if (percent < 100) {
    return (
      <Badge variant="destructive" className="gap-1.5 animate-pulse">
        <AlertTriangle size={14} className="text-amber-500" />
        Budget Almost Spent ({percent.toFixed(0)}%)
      </Badge>
    );
  }

  return (
    <Badge variant="destructive" className="gap-1.5 animate-pulse">
      <AlertTriangle size={14} className="text-amber-500" />
      Limit Exceeded! ({percent.toFixed(0)}%)
    </Badge>
  );
}
