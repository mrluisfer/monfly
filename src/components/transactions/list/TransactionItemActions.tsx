import { Edit, Ellipsis, Trash } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useDeleteTransaction } from "~/hooks/transactions";
import type { TransactionWithUser } from "~/types/TransactionWithUser";

const TransactionItemActions = ({
  transaction,
  setIsOpenDialog,
}: {
  transaction: TransactionWithUser;
  setIsOpenDialog: (isOpen: boolean) => void;
}) => {
  const deleteTransactionByIdMutation = useDeleteTransaction(
    transaction.userEmail,
  );

  return (
    <div className="inline-flex">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Open transaction actions"
              className="rounded-full transition-all duration-200 ease-out hover:scale-105 hover:border-primary/20 hover:shadow-sm focus-visible:scale-105 active:scale-95 data-[state=open]:scale-105 data-[state=open]:shadow-sm sm:size-9 dark:hover:shadow-primary/10"
            >
              <Ellipsis className="transition-transform duration-200 hover:rotate-90" />
            </Button>
          }
        />
        <DropdownMenuContent className="fade-in-0 zoom-in-95 slide-in-from-top-2 animate-in space-y-2 duration-200">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions for transaction</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="default"
            className="group cursor-pointer transition-all duration-200 ease-out hover:bg-primary/10 focus:bg-primary/10"
            onClick={() => setIsOpenDialog(true)}
          >
            <Edit className="transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110" />
            Edit transaction
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="group cursor-pointer transition-all duration-200 ease-out hover:bg-destructive/10 focus:bg-destructive/10"
            onClick={() =>
              deleteTransactionByIdMutation.mutate({
                data: {
                  id: transaction.id,
                },
              })
            }
          >
            <Trash className="transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110" />
            Delete transaction
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TransactionItemActions;
