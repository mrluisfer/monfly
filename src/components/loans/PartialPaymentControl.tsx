import { BanknoteArrowUpIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/** Inline form to record a partial payment against a loan. */
export function PartialPaymentControl({
  onSubmit,
}: {
  onSubmit: (amount: number) => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const raw = String(fd.get("amount") ?? "");
        const amount = Number(raw);
        if (!Number.isFinite(amount) || amount <= 0) return;
        onSubmit(amount);
        (e.currentTarget as HTMLFormElement).reset();
      }}
      className="flex items-center gap-2"
    >
      <Input
        name="amount"
        type="number"
        inputMode="decimal"
        step="0.01"
        min="0"
        placeholder="Add payment"
        className="min-w-0 flex-1"
        aria-label="Partial payment amount"
      />
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="submit"
              variant="default"
              aria-label="Add partial payment"
              className="shrink-0"
              size={"icon"}
            />
          }
        >
          <BanknoteArrowUpIcon aria-hidden="true" />
        </TooltipTrigger>
        <TooltipContent>Add a partial payment to the loan.</TooltipContent>
      </Tooltip>
    </form>
  );
}
