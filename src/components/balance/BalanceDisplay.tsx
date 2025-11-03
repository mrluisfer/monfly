import { Button } from "~/components/ui/button";
import { formatCurrency } from "~/utils/format-currency";
import { Edit2 } from "lucide-react";

interface BalanceDisplayProps {
  balance: number;
  onEdit: () => void;
}

export function BalanceDisplay({ balance, onEdit }: BalanceDisplayProps) {
  return (
    <p className="text-2xl font-bold flex items-center justify-between gap-4">
      <span className="transition-colors duration-200">
        {formatCurrency(balance, "MXN")}{" "}
        <span className="text-primary text-sm">MXN</span>
      </span>
      <Button
        variant="outline"
        size="icon"
        className="
          group-hover:opacity-100 group-hover:scale-105
          opacity-0 scale-95
          transition-all duration-300 ease-out
          hover:bg-primary/10 hover:border-primary/20
          active:scale-95
          focus-visible:opacity-100 focus-visible:scale-105
          md:hover:shadow-sm
          dark:hover:bg-primary/5
        "
        onClick={onEdit}
        aria-label="Edit balance"
      >
        <Edit2
          size={12}
          className="transition-transform duration-200 group-hover:rotate-12"
        />
      </Button>
    </p>
  );
}
