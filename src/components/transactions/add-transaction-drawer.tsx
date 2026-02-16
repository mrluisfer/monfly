import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "~/components/ui/sheet";
import { useAddTransaction } from "~/hooks/use-add-transaction";

import { TransactionForm } from "./transaction-form";

export function AddTransactionDrawer() {
  const [open, setOpen] = useState(false);
  const { form, onSubmit } = useAddTransaction();

  const handleSubmit = (values: any) => {
    onSubmit(values);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="rounded-full h-12 w-12 fixed bottom-20 right-4 shadow-lg z-50 md:hidden">
          <PlusIcon className="h-6 w-6" />
          <span className="sr-only">Add Transaction</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto rounded-t-xl">
        <SheetHeader className="text-left mb-4">
          <SheetTitle>Add Transaction</SheetTitle>
          <SheetDescription>
            Create a new transaction to track your expenses or income.
          </SheetDescription>
        </SheetHeader>
        <TransactionForm
          form={form}
          onSubmit={handleSubmit}
          buttonText="Save Transaction"
          description="Add a new transaction"
        />
      </SheetContent>
    </Sheet>
  );
}
