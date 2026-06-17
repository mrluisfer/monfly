import { StatusBadge } from "~/components/ui/status-badge";
import {
  LOAN_DIRECTION_LABEL,
  type LoanDirection,
} from "~/constants/loan-status";

import { LoanDirectionIcon } from "./LoanDirectionIcon";

/** Shows whether a loan is money owed to the user ("lent") or owed by them ("borrowed"). */
export function DirectionBadge({ direction }: { direction: LoanDirection }) {
  const isBorrowed = direction === "borrowed";
  return (
    <StatusBadge
      variant={isBorrowed ? "danger" : "success"}
      size="sm"
      className="tracking-wide uppercase"
      icon={<LoanDirectionIcon direction={direction} colored={false} />}
    >
      {LOAN_DIRECTION_LABEL[direction]}
    </StatusBadge>
  );
}
