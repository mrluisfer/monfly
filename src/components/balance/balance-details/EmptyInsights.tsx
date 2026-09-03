import { PiggyBankIcon } from "lucide-react";

export function EmptyInsights() {
  return (
    <div className="rounded-xl border border-border/60 border-dashed bg-card/40 p-6 text-center">
      <PiggyBankIcon
        className="mx-auto size-6 text-muted-foreground"
        aria-hidden={true}
      />
      <p className="mt-2 font-medium text-foreground text-sm">
        No periods recorded yet
      </p>
      <p className="mt-1 text-muted-foreground text-xs">
        Add a few transactions to see savings rate, runway and trends.
      </p>
    </div>
  );
}
