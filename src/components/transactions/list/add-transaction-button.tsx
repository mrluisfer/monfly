import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useAddTransaction } from "~/hooks/use-add-transaction";
import { PlusIcon } from "lucide-react";

import { TransactionForm } from "../transaction-form";

const AddTransactionButton = () => {
  const [open, setOpen] = useState(false);
  const { form, onSubmit } = useAddTransaction();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="group rounded-full"
          variant="outline"
          size="icon"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <PlusIcon
            className="transition-transform duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] group-aria-expanded:rotate-[135deg]"
            size={16}
            aria-hidden="true"
          />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        <TransactionForm
          form={form}
          onSubmit={onSubmit}
          buttonText="Save"
          description="Add a new transaction"
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionButton;
