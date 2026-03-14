import { zodResolver } from "@hookform/resolvers/zod";
import { Transaction } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { transactionFormNames } from "~/constants/forms/transaction-form-names";
import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { putTransactionByIdServer } from "~/lib/api/transaction/put-transaction-by-id";
import { sileo } from "~/lib/toaster";
import { invalidateTransactionQueries } from "~/utils/query-invalidation";
import { TransactionFormSchema } from "~/zod-schemas/transaction-schema";
import { useForm } from "react-hook-form";
import type { z } from "zod";

export const useEditTransaction = (
  transaction: Transaction,
  onCloseDialog: () => void
) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof TransactionFormSchema>>({
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    resolver: zodResolver(TransactionFormSchema as any),
    defaultValues: {
      [transactionFormNames.amount]: transaction.amount.toString(),
      [transactionFormNames.type]: transaction.type as "income" | "expense",
      [transactionFormNames.category]: transaction.category,
      [transactionFormNames.description]: transaction.description ?? "",
      [transactionFormNames.date]: transaction.date,
    },
  });

  const putTransactionByIdMutation = useMutation({
    fn: putTransactionByIdServer,
    onSuccess: async (ctx) => {
      if (ctx.data?.error) {
        sileo.error({ title: ctx.data.message });
        return;
      }
      sileo.success({ title: ctx.data.message });

      // Invalidate all queries that depend on transaction data
      await invalidateTransactionQueries(queryClient, transaction.userEmail);
    },
    idempotency: {
      getKey: (variables) =>
        JSON.stringify({
          amount: variables.data.data.amount,
          category: variables.data.data.category.trim().toLowerCase(),
          date: variables.data.data.date.toISOString(),
          description: variables.data.data.description.trim().toLowerCase(),
          id: variables.data.id,
          type: variables.data.data.type.toLowerCase(),
        }),
      onDuplicatePending: {
        title: "Changes are already being saved",
        description: "Please wait for the current update to finish.",
      },
      onDuplicateRecentSuccess: {
        title: "Changes already applied",
        description: "We skipped the duplicate update to keep data consistent.",
      },
    },
  });

  const onSubmitEditedTransaction = async (
    data: z.infer<typeof TransactionFormSchema>
  ) => {
    try {
      const result = await putTransactionByIdMutation.mutate({
        data: {
          id: transaction.id,
          data: {
            amount: Number.parseFloat(data.amount),
            type: data.type,
            category: data.category,
            description: data.description || "",
            date: data.date || new Date(),
          },
        },
      });

      if (result && !isErrorPayload(result)) {
        onCloseDialog();
      }
    } catch (error) {
      sileo.error({ title: "Error editing transaction" });
    }
  };

  return {
    form,
    onSubmitEditedTransaction,
  };
};
