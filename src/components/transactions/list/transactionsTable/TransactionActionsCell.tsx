import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { deleteTransactionByIdServer } from "~/lib/api/transaction/delete-transaction-by-id";
import { sileo } from "~/lib/toaster";
import { queryDictionary } from "~/queries/dictionary";
import { TransactionWithUser } from "~/types/TransactionWithUser";
import { EditIcon, Ellipsis, TrashIcon } from "lucide-react";

import EditTransaction from "../../EditTransaction";

export function TransactionActionsCell({
  transaction,
}: {
  transaction: TransactionWithUser;
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const deleteTransactionByIdMutation = useMutation({
    fn: deleteTransactionByIdServer,
    onSuccess: async ({ data }) => {
      if (isErrorPayload(data)) {
        const response = data as { message?: string };
        sileo.error({ title: response.message ?? "Failed to delete transaction" });
        setIsDeleteDialogOpen(false);
        return;
      }

      sileo.success({ title: "Transaction deleted successfully" });
      await queryClient.invalidateQueries({
        queryKey: [queryDictionary.transactions, transaction.userEmail],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryDictionary.user, transaction.userEmail],
      });
      setIsDeleteDialogOpen(false);
    },
    idempotency: {
      getKey: (variables) => variables.data.id,
      onDuplicatePending: {
        title: "Transaction is already being deleted",
      },
      onDuplicateRecentSuccess: {
        title: "Transaction already deleted",
      },
    },
  });

  React.useEffect(() => {
    if (
      deleteTransactionByIdMutation.status === "error" &&
      deleteTransactionByIdMutation.error
    ) {
      sileo.error({ title: "Failed to delete transaction" });
      setIsDeleteDialogOpen(false);
    }
  }, [
    deleteTransactionByIdMutation.status,
    deleteTransactionByIdMutation.error,
  ]);

  const handleDelete = () => {
    deleteTransactionByIdMutation.mutate({
      data: {
        id: transaction.id,
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="icon-lg"
              className="
                transition-all duration-200 ease-out
                hover:scale-105 hover:shadow-sm hover:border-primary/20
                active:scale-95
                focus-visible:scale-105
                data-[state=open]:scale-105 data-[state=open]:shadow-sm
                dark:hover:shadow-primary/10 rounded-full
              "
            >
              <span className="sr-only">Open menu</span>
              <Ellipsis className="transition-transform duration-200 hover:rotate-90" />
            </Button>
          }
        />
        <DropdownMenuContent
          align="end"
          className="
            space-y-2
            animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200
          "
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions for transaction</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuItem
            variant="default"
            className="
              transition-all duration-200 ease-out
              hover:bg-primary/10 focus:bg-primary/10
              cursor-pointer
            "
            onClick={() => {
              sileo.promise(navigator.clipboard.writeText(transaction.id), {
                loading: { title: "Copying transaction ID..." },
                success: { title: "Transaction ID copied" },
                error: { title: "Failed to copy transaction ID" },
              });
            }}
          >
            Copy transaction ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="default"
            onClick={() => setIsEditDialogOpen(true)}
            className="
              transition-all duration-200 ease-out
              hover:bg-primary/10 focus:bg-primary/10
              cursor-pointer group
            "
          >
            <EditIcon className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12" />
            Edit transaction
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="
              transition-all duration-200 ease-out
              hover:bg-destructive/10 focus:bg-destructive/10
              cursor-pointer group
            "
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <TrashIcon className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12" />
            Delete transaction
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>Edit the transaction details</DialogDescription>
          </DialogHeader>
          <EditTransaction
            transaction={transaction}
            onClose={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              transaction "{transaction.description}" with amount $
              {Math.abs(transaction.amount).toFixed(2)}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteTransactionByIdMutation.status === "pending"}
            >
              {deleteTransactionByIdMutation.status === "pending"
                ? "Deleting..."
                : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
