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
import { deleteTransactionByIdServer } from "~/lib/api/transaction/delete-transaction-by-id.server";
import { TransactionWithUser } from "~/types/TransactionWithUser";
import { invalidateTransactionQueries } from "~/utils/query-invalidation";
import { Edit, Ellipsis, Trash } from "lucide-react";
import { toast } from "sonner";

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
      toast.success("Transaction deleted successfully");

      // Invalidate all queries that depend on transaction data
      await invalidateTransactionQueries(queryClient, transaction.userEmail);
    },
  });

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="space-y-2">
          <DropdownMenuLabel>Actions for transaction</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem variant="default">
              <Edit />
              Edit transaction
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem
            variant="destructive"
            onClick={() =>
              deleteTransactionByIdMutation.mutate({
                data: {
                  id: transaction.id,
                },
              })
            }
          >
            <Trash />
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
