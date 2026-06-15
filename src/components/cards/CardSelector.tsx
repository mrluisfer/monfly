import { useNavigate } from "@tanstack/react-router";
import { CreditCardIcon, LayersIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useActiveCard, useCards } from "~/hooks/cards";
import { usePreferredCurrency } from "~/hooks/usePreferredCurrency";
import { formatCurrency } from "~/utils/format-currency";

const ALL_CARDS = "all";

/**
 * Dashboard card filter. Writes the selected card to the `?card=` search param
 * (validated on the home route); the "All cards" option clears it and restores
 * the aggregate view. Shared widgets read the same param via {@link useActiveCard}.
 */
export function CardSelector({ className }: { className?: string }) {
  const navigate = useNavigate();
  const activeCard = useActiveCard();
  const currency = usePreferredCurrency();
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
        <SelectValue placeholder="All cards">
          {(selected: unknown) => {
            const id = typeof selected === "string" ? selected : "";
            const card =
              id && id !== ALL_CARDS
                ? cards.find((c) => c.id === id)
                : undefined;
            if (!card) {
              return (
                <span className="flex items-center gap-2">
                  <LayersIcon className="text-muted-foreground size-4" />
                  All cards
                </span>
              );
            }
            return (
              <span className="flex items-center gap-2">
                <CreditCardIcon className="text-primary size-4" />
                <span className="truncate">{card.name}</span>
              </span>
            );
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} className="min-w-72">
        <SelectItem value={ALL_CARDS}>
          <LayersIcon className="text-muted-foreground size-4" />
          <span>All cards</span>
        </SelectItem>
        <SelectSeparator />
        {cards.map((card) => (
          <SelectItem key={card.id} value={card.id}>
            <CreditCardIcon className="text-primary size-4" />
            <span className="flex w-full items-center justify-between gap-3">
              <span className="flex min-w-0 flex-col">
                <span className="truncate capitalize">{card.name}</span>
                {card.last4 ? (
                  <span className="text-muted-foreground text-xs tabular-nums">
                    •••• {card.last4}
                  </span>
                ) : null}
              </span>
              <span className="text-muted-foreground shrink-0 text-xs font-medium tabular-nums">
                {formatCurrency(card.balance ?? 0, currency)}
              </span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
