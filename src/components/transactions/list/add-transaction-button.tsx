import { ReactNode, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { useAddTransaction } from "~/hooks/use-add-transaction";
import { useIsMobile } from "~/hooks/use-mobile";
import { TransactionFormSchema } from "~/zod-schemas/transaction-schema";
import { PlusIcon } from "lucide-react";
import type { z } from "zod";

import { TransactionForm } from "../transaction-form";

type TransactionFormValues = z.infer<typeof TransactionFormSchema>;

const AddTransactionButton = ({
  customTrigger = null,
}: {
  customTrigger?: ReactNode;
}) => {
  const isMobile = useIsMobile();
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

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent
          side="bottom"
          className="h-[92vh] overflow-y-auto rounded-t-xl border-0 px-0"
        >
          <SheetHeader className="mb-2 text-left">
            <SheetTitle>Add Transaction</SheetTitle>
            <SheetDescription>
              Create a new transaction to track your expenses or income.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-6">
            <TransactionForm
              form={form}
              onSubmit={handleSubmit}
              buttonText="Save Transaction"
              description="Add a new transaction"
              isLoading={mutation.status === "pending"}
            />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Create a new transaction to track your expenses or income.
          </DialogDescription>
        </DialogHeader>
        <TransactionForm
          form={form}
          onSubmit={handleSubmit}
          buttonText="Save"
          description="Add a new transaction"
          isLoading={mutation.status === "pending"}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionButton;
