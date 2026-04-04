import { ReactElement, useState } from "react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogTrigger } from "~/components/ui/dialog";
import { useAddTransaction } from "~/hooks/useAddTransaction";
import { TransactionFormSchema } from "~/zod-schemas/transaction-schema";
import { PlusIcon } from "lucide-react";
import type { z } from "zod";

import { TransactionForm } from "../TransactionForm";
import { TransactionFormDialogContent } from "../TransactionFormDialogContent";

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
      className="group h-10 rounded-full px-3 md:h-11 md:px-4"
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
      <TransactionFormDialogContent
        title="Add transaction"
        description="Enter the amount, type, category, and date."
      >
        <TransactionForm
          form={form}
          onSubmit={handleSubmit}
          buttonText="Save Transaction"
          description="Add a new transaction"
          isLoading={mutation.status === "pending"}
        />
      </TransactionFormDialogContent>
    </Dialog>
  );
};

export default AddTransactionButton;
