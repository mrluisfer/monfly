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
import { Dialog } from "~/components/ui/dialog";
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
import { ClipboardIcon, EditIcon, Ellipsis, TrashIcon } from "lucide-react";

import EditTransaction from "../../EditTransaction";
import { TransactionFormDialogContent } from "../../TransactionFormDialogContent";

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
        sileo.error({
          title: response.message ?? "Failed to delete transaction",
        });
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
      //@ts-ignore
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
          className="space-y-2 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200 w-[200px] border"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions for transaction</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              sileo.promise(navigator.clipboard.writeText(transaction.id), {
                loading: { title: "Copying transaction ID..." },
                success: { title: "Transaction ID copied" },
                error: { title: "Failed to copy transaction ID" },
              });
            }}
          >
            <ClipboardIcon />
            Copy transaction ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <EditIcon />
            Edit transaction
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
            <TrashIcon />
            Delete transaction
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <TransactionFormDialogContent
          title="Edit transaction"
          description="Update the amount, category, type, or date without leaving the current flow."
        >
          <EditTransaction
            transaction={transaction}
            onClose={() => setIsEditDialogOpen(false)}
          />
        </TransactionFormDialogContent>
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
