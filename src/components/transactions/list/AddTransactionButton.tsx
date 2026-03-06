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

import { TransactionForm } from "../TransactionForm";

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
      className="group h-9 px-2.5 md:h-10 md:px-4"
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
      <DialogContent className="w-[calc(100vw-1rem)] max-w-xl p-0 sm:w-full">
        <div className="flex max-h-[90dvh] flex-col overflow-hidden">
          <DialogHeader className="border-b px-4 pt-4 pb-3 text-left sm:px-6">
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>
              Create a new transaction to track your expenses or income.
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

          <div className="border-t px-4 py-3 sm:px-6">
            <DialogClose
              className="w-full"
              render={
                <Button variant="outline" className="w-full">
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
