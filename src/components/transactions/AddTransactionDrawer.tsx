import { Button } from "~/components/ui/button";
import AddTransactionButton from "~/components/transactions/list/AddTransactionButton";
import { PlusIcon } from "lucide-react";

export function AddTransactionDrawer() {
  return (
    <AddTransactionButton
      customTrigger={
        <Button
          className="fixed right-4 bottom-20 z-50 size-14 rounded-full border-0 bg-primary text-primary-foreground shadow-[0_28px_48px_-24px_color-mix(in_oklab,var(--primary)_70%,transparent)] md:hidden"
          aria-label="Add transaction"
        >
          <PlusIcon className="h-6 w-6" />
          <span className="sr-only">Add Transaction</span>
        </Button>
      }
    />
  );
}
