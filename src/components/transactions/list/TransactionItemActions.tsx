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
import { TransactionWithUser } from "~/types/TransactionWithUser";
import { Edit, Ellipsis, Trash } from "lucide-react";

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
              className="hover:border-primary/20 dark:hover:shadow-primary/10 rounded-full transition-all duration-200 ease-out hover:scale-105 hover:shadow-sm focus-visible:scale-105 active:scale-95 data-[state=open]:scale-105 data-[state=open]:shadow-sm sm:size-9"
            >
              <Ellipsis className="transition-transform duration-200 hover:rotate-90" />
            </Button>
          }
        />
        <DropdownMenuContent className="animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 space-y-2 duration-200">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions for transaction</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="default"
            className="hover:bg-primary/10 focus:bg-primary/10 group cursor-pointer transition-all duration-200 ease-out"
            onClick={() => setIsOpenDialog(true)}
          >
            <Edit className="transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12" />
            Edit transaction
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="hover:bg-destructive/10 focus:bg-destructive/10 group cursor-pointer transition-all duration-200 ease-out"
            onClick={() =>
              deleteTransactionByIdMutation.mutate({
                data: {
                  id: transaction.id,
                },
              })
            }
          >
            <Trash className="transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12" />
            Delete transaction
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TransactionItemActions;
