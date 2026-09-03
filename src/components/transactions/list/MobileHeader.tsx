import { RefreshCcwIcon, WalletIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import { CardBadge, type CardSummary } from "./CardBadge";

export function MobileHeader({
  total,
  isPending,
  transactionsCount,
  refetch,
  activeCard,
}: {
  total: number;
  isPending: boolean;
  transactionsCount: number;
  refetch: () => void;
  activeCard?: CardSummary | null;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="space-y-1">
        <p className="font-medium text-[0.7rem] text-muted-foreground uppercase tracking-[0.22em]">
          Activity feed
        </p>
        <h2 className="flex items-center gap-2 font-semibold text-foreground text-lg tracking-tight">
          <WalletIcon className="size-4 text-primary" />
          Transactions
        </h2>
        <p className="text-muted-foreground text-sm">
          {total} {total === 1 ? "transaction" : "transactions"} total.
        </p>
        {activeCard ? (
          <CardBadge
            card={activeCard}
            className="mt-1"
            hint="Showing transactions for this card"
          />
        ) : null}
      </div>
      <Button
        onClick={() => refetch()}
        disabled={isPending || transactionsCount === 0}
        variant="outline"
        size="icon"
        className="size-10 rounded-full bg-muted"
      >
        <RefreshCcwIcon className={cn("size-4", isPending && "animate-spin")} />
      </Button>
    </div>
  );
}
