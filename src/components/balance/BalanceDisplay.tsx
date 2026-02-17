import { Button } from "~/components/ui/button";
import { formatCurrency } from "~/utils/format-currency";
import { Edit2 } from "lucide-react";

interface BalanceDisplayProps {
  balance: number;
  onEdit: () => void;
}

export function BalanceDisplay({ balance, onEdit }: BalanceDisplayProps) {
  return (
    <p className="flex items-center justify-between gap-3 text-2xl font-bold sm:gap-4">
      <span className="min-w-0 flex-1 truncate text-foreground transition-colors duration-200">
        {formatCurrency(balance, "MXN")}{" "}
        <span className="text-xs text-muted-foreground sm:text-sm">MXN</span>
      </span>
      <Button
        variant="outline"
        size="icon"
        className="
          h-9 w-9 border-border/80 bg-background text-foreground
          opacity-100 scale-100
          sm:opacity-0 sm:scale-95 sm:group-hover:opacity-100 sm:group-hover:scale-105
          transition-all duration-300 ease-out
          hover:border-primary/30 hover:bg-primary/10
          active:scale-95
          focus-visible:opacity-100 focus-visible:scale-105
          md:hover:shadow-sm dark:hover:bg-primary/10
        "
        onClick={onEdit}
        aria-label="Edit balance"
      >
        <Edit2
          size={14}
          className="transition-transform duration-200 group-hover:rotate-12"
        />
      </Button>
    </p>
  );
}
