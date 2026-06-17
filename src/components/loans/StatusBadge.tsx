import { StatusBadge as UIStatusBadge } from "~/components/ui/status-badge";
import { LOAN_STATUS_LABEL, type LoanStatus } from "~/constants/loan-status";

/**
 * Maps a loan's lifecycle to the design-system status palette — the semantic
 * mapping the component originally hinted at in comments, now built on the
 * shared `StatusBadge` primitive instead of hand-rolled color classes.
 */
const STATUS_VARIANT: Record<LoanStatus, "success" | "warning" | "neutral"> = {
  paid: "success",
  partial: "warning",
  pending: "neutral",
};

/** Pill reflecting a loan's lifecycle: pending, partial or paid. */
export function StatusBadge({ status }: { status: LoanStatus }) {
  return (
    <UIStatusBadge
      variant={STATUS_VARIANT[status] ?? "neutral"}
      size="sm"
      className="tracking-wide uppercase"
    >
      {LOAN_STATUS_LABEL[status]}
    </UIStatusBadge>
  );
}
