import { Transaction } from "@prisma/client";
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
import { Edit, Ellipsis, Trash } from "lucide-react";
import { toast } from "sonner";

import EditTransaction from "../edit-transaction";

const TransactionItemActions = ({
  transaction,
  setIsOpenDialog,
}: {
  transaction: Transaction;
  setIsOpenDialog: (isOpen: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  const deleteTransactionByIdMutation = useMutation({
    fn: deleteTransactionByIdServer,
    onSuccess: () => {
      toast.success("Transaction deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["transactions", transaction.userEmail],
      });
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
