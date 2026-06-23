import { CreditCardIcon } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
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
  /**
   * Short line shown under the card name inside the tooltip to give the chip
   * context for where it lives (a transaction row vs. the active filter chip).
   */
  hint?: string;
  /** Opt out of the tooltip (falls back to the native `title`). */
  withTooltip?: boolean;
};

/**
 * Tint helpers — blend the card's own accent color into the chip's border, fill
 * and dot so each card reads as visually distinct, while still degrading to the
 * neutral outline styles when a card has no color set. `color-mix` keeps the
 * tints theme-aware (they sit on top of the design tokens, not hardcoded).
 */
// function accentStyles(color?: string | null) {
//   if (!color) return undefined;
//   return {
//     borderColor: `color-mix(in oklab, ${color} 38%, var(--border))`,
//     backgroundColor: `color-mix(in oklab, ${color} 8%, transparent)`,
//   } satisfies React.CSSProperties;
// }

/**
 * A compact chip identifying which card a transaction belongs to. Built on the
 * shadcn `Badge` (outline variant) so it inherits the shared sizing, radius and
 * focus styles and composes with the rest of the UI instead of reinventing them
 * — we only layer on the card's accent color and last-four. Returns `null` when
 * the transaction isn't tied to a known card, so callers can drop it inline
 * without guarding.
 *
 * Wraps the chip in a tooltip that surfaces the card name, a masked card number
 * and a one-line hint. The trigger is focusable, so the same detail is reachable
 * by keyboard on desktop and by tap on touch devices (where there's no hover).
 */
export function CardBadge({
  card,
  className,
  hint = "Linked to this transaction",
  withTooltip = true,
}: CardBadgeProps) {
  if (!card) return null;

  // const accent = accentStyles(card.color);
  const titleText = `${card.name}${card.last4 ? ` •••• ${card.last4}` : ""}`;

  const badge = (
    <Badge
      variant="outline"
      tabIndex={withTooltip ? 0 : undefined}
      className={cn(
        "text-muted-foreground max-w-[180px] cursor-default gap-1.5 font-normal",
        withTooltip &&
          "focus-visible:ring-ring/40 transition-colors hover:brightness-105 focus-visible:ring-2 focus-visible:outline-none",
        className,
      )}
      title={withTooltip ? undefined : titleText}
    >
      {card.color ? (
        <span
          className="size-2 shrink-0 rounded-full ring-2 ring-white/10 ring-inset"
          style={{
            backgroundColor: card.color,
            boxShadow: `0 0 0 2px color-mix(in oklab, ${card.color} 22%, transparent)`,
          }}
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

  if (!withTooltip) return badge;

  return (
    <Tooltip>
      <TooltipTrigger render={badge} />
      <TooltipContent className="flex max-w-3xs flex-col items-start gap-1.5 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: card.color ?? "currentColor" }}
            aria-hidden="true"
          />
          <span className="text-[13px] leading-none font-semibold capitalize">
            {card.name}
          </span>
        </div>
        <span className="font-mono text-[11px] tracking-[0.18em] opacity-80">
          {card.last4 ? `•••• •••• •••• ${card.last4}` : "No card number"}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[10px] opacity-60">
          <CreditCardIcon className="size-3" aria-hidden="true" />
          {hint}
        </span>
      </TooltipContent>
    </Tooltip>
  );
}
