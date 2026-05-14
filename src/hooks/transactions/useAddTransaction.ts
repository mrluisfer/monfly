import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { transactionFormNames } from "~/constants/forms/transaction-form-names";
import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { useRouteUser } from "~/hooks/useRouteUser";
import { postLoanByEmailServer } from "~/lib/api/loan/post-loan-by-email";
import { postTransactionByEmailServer } from "~/lib/api/transaction/post-transaction-by-email";
import { sileo } from "~/lib/toaster";
import { getUserSession } from "~/server/db/users/get-user-session";
import {
  invalidateLoanQueries,
  invalidateTransactionQueries,
} from "~/utils/query-invalidation";
import { TransactionFormSchema } from "~/zod-schemas/transaction-schema";

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
      [transactionFormNames.loanMode]: "none",
      [transactionFormNames.markAsLoan]: false,
      [transactionFormNames.loanDebtor]: "",
      [transactionFormNames.loanDueAt]: null,
      [transactionFormNames.appliedToLoanId]: null,
    },
  });

  const postTransactionByEmail = useMutation({
    fn: postTransactionByEmailServer,
    onSuccess: async ({ data }) => {
      if (isErrorPayload(data)) {
        const response = data as { message?: string };
        sileo.error({
          title: response.message ?? "Failed to create transaction",
        });
        return;
      }

      sileo.success({ title: "Transaction created successfully" });
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
          appliedToLoanId: variables.data.transaction.appliedToLoanId ?? null,
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
      const { data: sessionEmail } = await getUserSession();
      if (!sessionEmail) throw new Error("User email not found");

      const txDate = data.date ? new Date(data.date) : new Date();
      const amount = Number.parseFloat(data.amount);
      const loanMode = data.loanMode ?? "none";
      const appliedToLoanId =
        loanMode === "apply" ? (data.appliedToLoanId ?? null) : null;

      const txResult = await postTransactionByEmail.mutate({
        data: {
          email: sessionEmail,
          transaction: {
            amount,
            type: data.type,
            category: data.category,
            description: data.description || null,
            date: txDate,
            appliedToLoanId,
          },
        },
      });

      // If the user opted-in, also create a Loan linked to this transaction.
      if (loanMode === "create" && txResult && !isErrorPayload(txResult)) {
        const createdTx = (txResult as { data?: { id?: string } }).data;
        const debtor = (data.loanDebtor ?? "").trim();

        if (createdTx?.id && debtor) {
          const loanResult = await postLoanByEmailServer({
            data: {
              email: sessionEmail,
              loan: {
                debtor,
                amount,
                issuedAt: txDate,
                dueAt: data.loanDueAt ?? null,
                notes: data.description?.trim() || null,
                transactionId: createdTx.id,
              },
            },
          });

          if (loanResult && !isErrorPayload(loanResult)) {
            sileo.success({ title: "Loan registered" });
            await invalidateLoanQueries(queryClient, sessionEmail);
          } else {
            sileo.warning({
              title: "Transaction saved, but loan could not be created",
            });
          }
        }
      }

      // Reset only after the whole flow finished so the user sees what they typed
      // until everything is persisted.
      if (txResult && !isErrorPayload(txResult)) {
        form.reset();
      }
    } catch {
      sileo.error({ title: "Failed to create transaction" });
    }
  };

  return { form, onSubmit, mutation: postTransactionByEmail };
};
