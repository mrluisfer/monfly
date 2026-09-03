import { useQueryClient } from "@tanstack/react-query";
import { ClipboardIcon, EditIcon, Ellipsis, TrashIcon } from "lucide-react";
import React, { useCallback } from "react";
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
import type { TransactionWithUser } from "~/types/TransactionWithUser";
import { getTransactionTitle } from "~/utils/transaction-title";
import EditTransaction from "../../EditTransaction";
import { TransactionFormDialogContent } from "../../TransactionFormDialogContent";

export function TransactionActionsCell({
  transaction,
  disabled = false,
}: {
  transaction: TransactionWithUser;
  /**
   * Every action in this menu targets one transaction. While a multi-row
   * selection is active the toolbar owns the operation, so the menu is closed
   * off rather than quietly acting on this single row.
   */
  disabled?: boolean;
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const deleteTransactionByIdMutation = useMutation({
    fn: deleteTransactionByIdServer,
    idempotency: {
      getKey: (variables) => (variables as { data: { id: string } }).data.id,
      onDuplicatePending: {
        title: "Transaction is already being deleted",
      },
      onDuplicateRecentSuccess: {
        title: "Transaction already deleted",
      },
    },
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
  });

  const handleDelete = useCallback(async () => {
    const result = await deleteTransactionByIdMutation.mutate({
      data: {
        id: transaction.id,
      },
    });
    if (result === undefined) {
      sileo.error({ title: "Failed to delete transaction" });
      setIsDeleteDialogOpen(false);
    }
  }, [deleteTransactionByIdMutation, transaction.id]);

  const handleCopyAlert = useCallback(() => {
    sileo.promise(navigator.clipboard.writeText(transaction.id), {
      error: { title: "Failed to copy transaction ID" },
      loading: { title: "Copying transaction ID..." },
      success: { title: "Transaction ID copied" },
    });
  }, [transaction.id]);

  const handleChangeEditDialogOpen = useCallback(
    () => setIsEditDialogOpen(true),
    [],
  );

  const handleChangeDeleteDialogOpen = useCallback(
    () => setIsDeleteDialogOpen(true),
    [],
  );

  const handleCloseEditDialog = useCallback(
    () => setIsEditDialogOpen(false),
    [],
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="icon-lg"
              disabled={disabled}
              className="rounded-full transition-all duration-200 ease-out hover:scale-105 hover:border-primary/20 hover:shadow-sm focus-visible:scale-105 active:scale-95 data-[state=open]:scale-105 data-[state=open]:shadow-sm dark:hover:shadow-primary/10"
            >
              <span className="sr-only">
                {disabled
                  ? "Row actions unavailable while several transactions are selected"
                  : "Open menu"}
              </span>
              <Ellipsis className="transition-transform duration-200 hover:rotate-90" />
            </Button>
          }
        />
        <DropdownMenuContent
          align="end"
          className="fade-in-0 zoom-in-95 slide-in-from-top-2 w-[200px] animate-in space-y-2 border duration-200"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions for transaction</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuItem onClick={handleCopyAlert}>
            <ClipboardIcon />
            Copy transaction ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleChangeEditDialogOpen}>
            <EditIcon />
            Edit transaction
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleChangeDeleteDialogOpen}>
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
            onClose={handleCloseEditDialog}
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
              transaction &quot;
              {getTransactionTitle(
                transaction.description,
                transaction.category,
              )}
              &quot; with amount ${Math.abs(transaction.amount).toFixed(2)}.
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
