import { CircleDollarSignIcon, PencilIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { type LoanDirection } from "~/constants/loan-status";
import { usePreferredCurrency } from "~/hooks/usePreferredCurrency";

import { DebtorCombobox } from "./DebtorCombobox";
import { LoanDirectionIcon } from "./LoanDirectionIcon";
import { LoanField } from "./LoanField";
import type { EditLoanPatch, LoanRow } from "./types";

/** Dialog to edit a loan's debtor, amount or direction (status/payments untouched). */
export function EditLoanButton({
  loan,
  onSubmit,
}: {
  loan: LoanRow;
  onSubmit: (patch: EditLoanPatch) => void;
}) {
  const [open, setOpen] = useState(false);
  const currency = usePreferredCurrency();
  const initialDirection = (loan.direction ?? "lent") as LoanDirection;
  const [debtor, setDebtor] = useState(loan.debtor);
  const [amount, setAmount] = useState(String(loan.amount));
  const [direction, setDirection] = useState<LoanDirection>(initialDirection);

  // When opening, hydrate from the latest loan values in case of upstream updates.
  const handleOpenChange = (next: boolean) => {
    if (next) {
      setDebtor(loan.debtor);
      setAmount(String(loan.amount));
      setDirection((loan.direction ?? "lent") as LoanDirection);
    }
    setOpen(next);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) return;

    const patch: EditLoanPatch = {};
    const trimmed = debtor.trim();
    if (trimmed && trimmed !== loan.debtor) patch.debtor = trimmed;
    if (parsed !== loan.amount) patch.amount = parsed;
    if (direction !== initialDirection) patch.direction = direction;

    if (Object.keys(patch).length > 0) onSubmit(patch);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger
          render={
            <DialogTrigger
              render={
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  aria-label={`Edit loan from ${loan.debtor}`}
                  className="text-muted-foreground hover:bg-accent shrink-0"
                >
                  <PencilIcon className="size-4" aria-hidden="true" />
                </Button>
              }
            />
          }
        />
        <TooltipContent side="top">Edit loan</TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit loan</DialogTitle>
          <DialogDescription>
            Update the debtor, amount or direction. Status and payments stay
            untouched.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4" noValidate>
          <Tabs
            value={direction}
            onValueChange={(v) => setDirection(v as LoanDirection)}
            className="w-full"
          >
            <TabsList className="w-full">
              <TabsTrigger value="lent" className="flex-1 gap-1.5">
                <LoanDirectionIcon direction="lent" className="size-3.5" />
                Owed to me
              </TabsTrigger>
              <TabsTrigger value="borrowed" className="flex-1 gap-1.5">
                <LoanDirectionIcon direction="borrowed" className="size-3.5" />I
                owe
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <LoanField
            label={direction === "borrowed" ? "Creditor" : "Debtor"}
            icon={<UserIcon className="size-3.5" />}
          >
            <DebtorCombobox value={debtor} onChange={setDebtor} />
          </LoanField>

          <LoanField
            label={`Amount (${currency})`}
            icon={<CircleDollarSignIcon className="size-3.5" />}
          >
            <Input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </LoanField>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
