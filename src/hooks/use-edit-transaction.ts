import { zodResolver } from "@hookform/resolvers/zod";
import { Transaction } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { transactionFormNames } from "~/constants/forms/transaction-form-names";
import { useMutation } from "~/hooks/use-mutation";
import { putTransactionByIdServer } from "~/lib/api/transaction/put-transaction-by-id.server";
import { queryDictionary } from "~/queries/dictionary";
import { TransactionFormSchema } from "~/zod-schemas/transaction-schema";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
        toast.error(ctx.data.message);
        return;
      }
      toast.success(ctx.data.message);
      onCloseDialog();
      await queryClient.invalidateQueries({
        queryKey: [queryDictionary.transactions, transaction.userEmail],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryDictionary.user, transaction.userEmail],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryDictionary.categories, transaction.userEmail],
      });
    },
  });

  const onSubmitEditedTransaction = async (
    data: z.infer<typeof TransactionFormSchema>
  ) => {
    try {
      await putTransactionByIdMutation.mutate({
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
      onCloseDialog();
    } catch (error) {
      toast.error("Error editing transaction");
    }
  };

  return {
    form,
    onSubmitEditedTransaction,
  };
};
