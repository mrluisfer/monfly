import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { deleteTransactionByIdServer } from "~/lib/api/transaction/delete-transaction-by-id";
import { sileo } from "~/lib/toaster";
import { invalidateTransactionQueries } from "~/utils/query-invalidation";

/**
 * The "delete one transaction" mutation shared by a row's context menu
 * (`TransactionRow`) and its actions dropdown (`TransactionItemActions`).
 *
 * Both used to declare an identical `useMutation` — same success/error toasts,
 * cache invalidation and idempotency guard. Centralizing it here keeps the two
 * entry points in lockstep and surfaces the error toast everywhere (previously
 * only the context menu had it).
 *
 * @param userEmail Owner of the transaction, used to scope cache invalidation.
 */
export const useDeleteTransaction = (userEmail: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    fn: deleteTransactionByIdServer,
    onSuccess: async ({ data }) => {
      if (isErrorPayload(data)) {
        const response = data as { message?: string };
        sileo.error({
          title: response.message ?? "Failed to delete transaction",
        });
        return;
      }

      sileo.success({ title: "Transaction deleted successfully" });
      await invalidateTransactionQueries(queryClient, userEmail);
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

  useEffect(() => {
    if (mutation.status === "error" && mutation.error) {
      sileo.error({ title: "Failed to delete transaction" });
    }
  }, [mutation.status, mutation.error]);

  return mutation;
};
