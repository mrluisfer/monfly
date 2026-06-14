import { useNavigate } from "@tanstack/react-router";
import { CreditCardIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useActiveCard, useCards } from "~/hooks/cards";

const ALL_CARDS = "all";

/**
 * Dashboard card filter. Writes the selected card to the `?card=` search param
 * (validated on the home route); the "All cards" option clears it and restores
 * the aggregate view. Shared widgets read the same param via {@link useActiveCard}.
 */
export function CardSelector({ className }: { className?: string }) {
  const navigate = useNavigate();
  const activeCard = useActiveCard();
  const { data, isPending } = useCards({ status: "active" });

  const cards = data?.data ?? [];

  // Nothing to switch between until the user has created at least one card.
  if (!isPending && cards.length === 0) {
    return null;
  }

  const handleChange = async (value: string | null) => {
    await navigate({
      to: ".",
      search: (prev: Record<string, unknown>) => ({
        ...prev,
        card: !value || value === ALL_CARDS ? undefined : value,
      }),
      replace: true,
    });
  };

  return (
    <Select value={activeCard ?? ALL_CARDS} onValueChange={handleChange}>
      <SelectTrigger className={className} aria-label="Filter by card">
        <CreditCardIcon className="size-4" aria-hidden="true" />
        <SelectValue placeholder="All cards" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_CARDS}>All cards</SelectItem>
        <SelectSeparator />
        {cards.map((card) => (
          <SelectItem key={card.id} value={card.id}>
            {card.name}
            {card.last4 ? ` •••• ${card.last4}` : ""}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
