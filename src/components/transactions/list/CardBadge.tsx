import { CreditCardIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

/** The slice of a card we need to render a chip — keeps callers decoupled from Prisma. */
export type CardSummary = {
  id: string;
  name: string;
  last4?: string | null;
  color?: string | null;
};

type CardBadgeProps = {
  card?: CardSummary | null;
  className?: string;
};

/**
 * A compact chip identifying which card a transaction belongs to. Built on the
 * shadcn `Badge` (outline variant) so it inherits the shared sizing, radius and
 * focus styles and composes with the rest of the UI instead of reinventing them
 * — we only layer on the card's accent color and last-four. Returns `null` when
 * the transaction isn't tied to a known card, so callers can drop it inline
 * without guarding.
 */
export function CardBadge({ card, className }: CardBadgeProps) {
  if (!card) return null;

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-muted-foreground max-w-[180px] gap-1.5 font-normal",
        className,
      )}
      title={`${card.name}${card.last4 ? ` •••• ${card.last4}` : ""}`}
    >
      {card.color ? (
        <span
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: card.color }}
          aria-hidden="true"
        />
      ) : (
        <CreditCardIcon className="text-primary" aria-hidden="true" />
      )}
      <span className="min-w-0 truncate font-medium">{card.name}</span>
      {card.last4 ? (
        <span className="text-primary shrink-0 tabular-nums">
          ·{card.last4}
        </span>
      ) : null}
    </Badge>
  );
}
