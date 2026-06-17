import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import { type LoanDirection } from "~/constants/loan-status";
import { cn } from "~/lib/utils";

/**
 * Single source of truth for the two loan-direction arrows so every spot (the
 * add form tabs, the list metrics, the filter tabs and the row badge) renders
 * the same glyph and color — change it here and it updates everywhere.
 *
 * - `lent` ("Owed to me")  → down-left arrow, `success` (green)
 * - `borrowed` ("I owe")   → up-right arrow, `destructive` (red)
 *
 * Colors use the `success`/`destructive` theme tokens, which already resolve
 * per light/dark mode. Pass `colored={false}` where the surrounding element
 * already sets the color (a `MetricCard` accent, a `StatusBadge` variant) so the
 * icon inherits `currentColor` instead of fighting it.
 */
const DIRECTION_ICON: Record<LoanDirection, LucideIcon> = {
  lent: ArrowDownLeftIcon,
  borrowed: ArrowUpRightIcon,
};

const DIRECTION_COLOR: Record<LoanDirection, string> = {
  lent: "text-success",
  borrowed: "text-destructive",
};

type LoanDirectionIconProps = LucideProps & {
  direction: LoanDirection;
  /** Set false to inherit the surrounding text color instead of the loan color. */
  colored?: boolean;
};

export function LoanDirectionIcon({
  direction,
  colored = true,
  className,
  ...props
}: LoanDirectionIconProps) {
  const Icon = DIRECTION_ICON[direction];
  return (
    <Icon
      aria-hidden="true"
      className={cn(colored && DIRECTION_COLOR[direction], className)}
      {...props}
    />
  );
}
