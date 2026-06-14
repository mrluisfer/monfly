import { PiggyBankIcon } from "lucide-react";

export function EmptyInsights() {
  return (
    <div className="border-border/60 bg-card/40 rounded-2xl border border-dashed p-6 text-center">
      <PiggyBankIcon
        className="text-muted-foreground mx-auto size-6"
        aria-hidden={true}
      />
      <p className="text-foreground mt-2 text-sm font-medium">
        No periods recorded yet
      </p>
      <p className="text-muted-foreground mt-1 text-xs">
        Add a few transactions to see savings rate, runway and trends.
      </p>
    </div>
  );
}
