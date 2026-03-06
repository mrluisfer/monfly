import { Button } from "~/components/ui/button";
import AddTransactionButton from "~/components/transactions/list/AddTransactionButton";
import { PlusIcon } from "lucide-react";

export function AddTransactionDrawer() {
  return (
    <AddTransactionButton
      customTrigger={
        <Button
          className="fixed right-4 bottom-20 z-50 h-12 w-12 rounded-full shadow-lg md:hidden"
          aria-label="Add transaction"
        >
          <PlusIcon className="h-6 w-6" />
          <span className="sr-only">Add Transaction</span>
        </Button>
      }
    />
  );
}
