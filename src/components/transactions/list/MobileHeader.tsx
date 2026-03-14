import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { RefreshCcwIcon, WalletIcon } from "lucide-react";

export function MobileHeader({
  total,
  isPending,
  transactionsCount,
  refetch,
}: {
  total: number;
  isPending: boolean;
  transactionsCount: number;
  refetch: () => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="space-y-1">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Activity feed
        </p>
        <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
          <WalletIcon className="size-4.5 text-primary" />
          Transactions
        </h2>
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? "transaction" : "transactions"} total.
        </p>
      </div>
      <Button
        onClick={() => refetch()}
        disabled={isPending || transactionsCount === 0}
        variant="outline"
        size="icon"
        className="finance-chip size-10 rounded-full"
      >
        <RefreshCcwIcon className={cn("size-4", isPending && "animate-spin")} />
      </Button>
    </div>
  );
}
