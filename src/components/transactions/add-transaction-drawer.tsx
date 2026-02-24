import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { useAddTransaction } from "~/hooks/use-add-transaction";
import { PlusIcon, XIcon } from "lucide-react";

import { TransactionForm } from "./transaction-form";

export function AddTransactionDrawer() {
  const [open, setOpen] = useState(false);
  const { form, onSubmit, mutation } = useAddTransaction();

  const handleSubmit = async (values: any) => {
    await onSubmit(values);
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
      <SheetContent
        side="bottom"
        className="h-[90vh] overflow-y-auto rounded-t-xl border-0 px-0"
      >
        <SheetHeader className="mb-2 text-left">
          <SheetTitle>Add Transaction</SheetTitle>
          <SheetDescription>
            Create a new transaction to track your expenses or income.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-2">
          <TransactionForm
            form={form}
            onSubmit={handleSubmit}
            buttonText="Save Transaction"
            description="Add a new transaction"
            isLoading={mutation.status === "pending"}
          />
        </div>
        <div className="px-4 pb-2">
          <SheetClose asChild className="w-full">
            <Button variant="outline">
              <XIcon />
              Cancel
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
