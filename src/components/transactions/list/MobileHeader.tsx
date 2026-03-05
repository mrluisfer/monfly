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
    <div className="flex items-center justify-between px-1 mb-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
          <WalletIcon className="size-4.5 text-primary" />
          Transactions
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {total} {total === 1 ? "transaction" : "transactions"}
        </p>
      </div>
      <Button
        onClick={() => refetch()}
        disabled={isPending || transactionsCount === 0}
        variant="ghost"
        size="icon"
        className="size-9 rounded-xl"
      >
        <RefreshCcwIcon className={cn("size-4", isPending && "animate-spin")} />
      </Button>
    </div>
  );
}
