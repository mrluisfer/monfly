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
      <span>
        {formatCurrency(balance, "MXN")}{" "}
        <span className="text-primary text-sm">MXN</span>
      </span>
      <Button
        variant="outline"
        size="icon"
        className="group-hover:opacity-100 opacity-0 transition-opacity"
        onClick={onEdit}
        aria-label="Edit balance"
      >
        <Edit2 size={12} />
      </Button>
    </p>
  );
}
