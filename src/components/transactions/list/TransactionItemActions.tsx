import { useQueryClient } from "@tanstack/react-query";
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
import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { deleteTransactionByIdServer } from "~/lib/api/transaction/delete-transaction-by-id";
import { sileo } from "~/lib/toaster";
import { TransactionWithUser } from "~/types/TransactionWithUser";
import { invalidateTransactionQueries } from "~/utils/query-invalidation";
import { Edit, Ellipsis, Trash } from "lucide-react";

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
    onSuccess: async ({ data }) => {
      if (isErrorPayload(data)) {
        const response = data as { message?: string };
        sileo.error({ title: response.message ?? "Failed to delete transaction" });
        return;
      }

      sileo.success({ title: "Transaction deleted successfully" });

      // Invalidate all queries that depend on transaction data
      await invalidateTransactionQueries(queryClient, transaction.userEmail);
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

  return (
    <div className="inline-flex">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Open transaction actions"
              className="
                transition-all duration-200 ease-out
                hover:scale-105 hover:shadow-sm hover:border-primary/20
                active:scale-95
                focus-visible:scale-105
                data-[state=open]:scale-105 data-[state=open]:shadow-sm
                dark:hover:shadow-primary/10 rounded-full sm:size-9"
            >
              <Ellipsis className="transition-transform duration-200 hover:rotate-90" />
            </Button>
          }
        />
        <DropdownMenuContent
          className="
          space-y-2
          animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200
        "
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions for transaction</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="default"
            className="
              transition-all duration-200 ease-out
              hover:bg-primary/10 focus:bg-primary/10
              cursor-pointer group
            "
            onClick={() => setIsOpenDialog(true)}
          >
            <Edit className="transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12" />
            Edit transaction
          </DropdownMenuItem>
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
    </div>
  );
};

export default TransactionItemActions;
