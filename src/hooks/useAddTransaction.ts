import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { transactionFormNames } from "~/constants/forms/transaction-form-names";
import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { postTransactionByEmailServer } from "~/lib/api/transaction/post-transaction-by-email";
import { sileo } from "~/lib/toaster";
import { invalidateTransactionQueries } from "~/utils/query-invalidation";
import { getUserSession } from "~/utils/user/get-user-session";
import { TransactionFormSchema } from "~/zod-schemas/transaction-schema";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { useRouteUser } from "./useRouteUser";

type FormValues = z.infer<typeof TransactionFormSchema>;

export const useAddTransaction = () => {
  const queryClient = useQueryClient();
  const userEmail = useRouteUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(TransactionFormSchema),
    defaultValues: {
      [transactionFormNames.type]: "income",
      [transactionFormNames.date]: new Date(),
      [transactionFormNames.category]: "",
      [transactionFormNames.amount]: "",
      [transactionFormNames.description]: "",
    },
  });

  const postTransactionByEmail = useMutation({
    fn: postTransactionByEmailServer,
    onSuccess: async ({ data }) => {
      if (isErrorPayload(data)) {
        const response = data as { message?: string };
        sileo.error({ title: response.message ?? "Failed to create transaction" });
        return;
      }

      sileo.success({ title: "Transaction created successfully" });
      form.reset();

      // Invalidate all queries that depend on transaction data
      await invalidateTransactionQueries(queryClient, userEmail);
    },
    idempotency: {
      getKey: (variables) =>
        JSON.stringify({
          amount: variables.data.transaction.amount,
          category: variables.data.transaction.category.trim().toLowerCase(),
          date: variables.data.transaction.date.toISOString(),
          description:
            variables.data.transaction.description?.trim().toLowerCase() ?? "",
          type: variables.data.transaction.type.toLowerCase(),
        }),
      onDuplicatePending: {
        title: "Transaction is already being saved",
        description: "Please wait while we finish the current request.",
      },
      onDuplicateRecentSuccess: {
        title: "Transaction already saved",
        description: "We ignored the duplicate submission to avoid duplicates.",
      },
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const { data: userEmail } = await getUserSession();
      if (!userEmail) throw new Error("User email not found");
      const transformedData = {
        amount: Number.parseFloat(data.amount),
        type: data.type,
        category: data.category,
        description: data.description || null,
        date: data.date || new Date(),
        user: { connect: { email: userEmail } },
      };
      await postTransactionByEmail.mutate({
        data: {
          email: userEmail,
          transaction: {
            ...transformedData,
            date: new Date(transformedData.date),
          },
        },
      });
    } catch (error) {
      sileo.error({ title: "Failed to create transaction" });
    }
  };

  return { form, onSubmit, mutation: postTransactionByEmail };
};
