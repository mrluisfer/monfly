import { useQueryClient } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useMutation } from "~/hooks/use-mutation";
import { deleteTransactionByIdServer } from "~/lib/api/transaction/delete-transaction-by-id";
import { sileo } from "~/lib/toaster";
import { TransactionWithUser } from "~/types/TransactionWithUser";
import { invalidateTransactionQueries } from "~/utils/query-invalidation";
import { Edit, Ellipsis, Trash } from "lucide-react";

import EditTransaction from "../edit-transaction";

const TransactionItemActions = ({
  transaction,
  setIsOpenDialog,
}: {
  transaction: TransactionWithUser;
  setIsOpenDialog: (isOpen: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  const deleteTransactionByIdMutation = useMutation({
    fn: deleteTransactionByIdServer,
    onSuccess: async () => {
      sileo.success({ title: "Transaction deleted successfully" });

      // Invalidate all queries that depend on transaction data
      await invalidateTransactionQueries(queryClient, transaction.userEmail);
    },
  });

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon-lg"
            className="
              transition-all duration-200 ease-out
              hover:scale-105 hover:shadow-sm hover:border-primary/20
              active:scale-95
              focus-visible:scale-105
              data-[state=open]:scale-105 data-[state=open]:shadow-sm
              dark:hover:shadow-primary/10 rounded-full"
          >
            <Ellipsis className="transition-transform duration-200 hover:rotate-90" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="
          space-y-2
          animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200
        "
        >
          <DropdownMenuLabel>Actions for transaction</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem
              variant="default"
              className="
                transition-all duration-200 ease-out
                hover:bg-primary/10 focus:bg-primary/10
                cursor-pointer group
              "
            >
              <Edit className="transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12" />
              Edit transaction
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            variant="destructive"
            className="
              transition-all duration-200 ease-out
              hover:bg-destructive/10 focus:bg-destructive/10
              cursor-pointer group
            "
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>Edit the transaction details</DialogDescription>
        </DialogHeader>
        <EditTransaction
          transaction={transaction}
          onClose={() => setIsOpenDialog(false)}
        />
      </DialogContent>
    </div>
  );
};

export default TransactionItemActions;
