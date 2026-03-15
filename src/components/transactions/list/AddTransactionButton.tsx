import { ReactElement, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useAddTransaction } from "~/hooks/useAddTransaction";
import { TransactionFormSchema } from "~/zod-schemas/transaction-schema";
import { PlusIcon, XIcon } from "lucide-react";
import type { z } from "zod";

import {
  TransactionForm,
  transactionFormDialogContentClassName,
} from "../TransactionForm";

type TransactionFormValues = z.infer<typeof TransactionFormSchema>;

const AddTransactionButton = ({
  customTrigger = null,
}: {
  customTrigger?: ReactElement | null;
}) => {
  const [open, setOpen] = useState(false);
  const { form, onSubmit, mutation } = useAddTransaction();

  const handleSubmit = async (data: TransactionFormValues) => {
    await onSubmit(data);
    setOpen(false);
  };

  const trigger = customTrigger ?? (
    <Button
      className="finance-chip group h-10 rounded-full px-3 md:h-11 md:px-4"
      variant="outline"
      size="sm"
      aria-expanded={open}
      aria-label={
        open ? "Close add transaction form" : "Open add transaction form"
      }
    >
      <PlusIcon
        className="text-primary transition-transform duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] group-aria-expanded:rotate-135"
        size={16}
        aria-hidden="true"
      />
      <span className="hidden sm:inline">New Transaction</span>
      <span className="sm:hidden">Add</span>
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent
        showCloseButton={false}
        className={transactionFormDialogContentClassName}
      >
        <div className="flex max-h-[92dvh] flex-col overflow-hidden">
          <div className="mx-auto mt-3 h-1.5 w-14 rounded-full bg-border/80 sm:hidden" />
          <DialogHeader className="border-b border-border/60 px-5 pt-4 pb-4 text-left sm:px-6">
            <DialogTitle className="text-lg font-semibold tracking-tight">
              Add transaction
            </DialogTitle>
            <DialogDescription className="text-sm leading-6">
              Enter the amount, type, category, and date.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="min-h-0 flex-1 overscroll-contain">
            <div className="px-4 py-4 sm:px-6">
              <TransactionForm
                form={form}
                onSubmit={handleSubmit}
                buttonText="Save Transaction"
                description="Add a new transaction"
                isLoading={mutation.status === "pending"}
              />
            </div>
          </ScrollArea>

          <div className="border-t border-border/60 px-4 py-3 sm:px-6">
            <DialogClose
              className="w-full"
              render={
                <Button
                  variant="outline"
                  className="finance-chip h-11 w-full rounded-full"
                >
                  <XIcon className="h-5 w-5" />
                  Cancel
                </Button>
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionButton;
