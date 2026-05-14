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
        <p className="text-muted-foreground text-[0.7rem] font-medium tracking-[0.22em] uppercase">
          Activity feed
        </p>
        <h2 className="text-foreground flex items-center gap-2 text-lg font-semibold tracking-tight">
          <WalletIcon className="text-primary size-4" />
          Transactions
        </h2>
        <p className="text-muted-foreground text-sm">
          {total} {total === 1 ? "transaction" : "transactions"} total.
        </p>
      </div>
      <Button
        onClick={() => refetch()}
        disabled={isPending || transactionsCount === 0}
        variant="outline"
        size="icon"
        className="bg-muted size-10 rounded-full"
      >
        <RefreshCcwIcon className={cn("size-4", isPending && "animate-spin")} />
      </Button>
    </div>
  );
}
