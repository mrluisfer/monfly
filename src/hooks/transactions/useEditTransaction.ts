import { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Loan, Transaction } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { transactionFormNames } from "~/constants/forms/transaction-form-names";
import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { deleteLoanByIdServer } from "~/lib/api/loan/delete-loan-by-id";
import { getLoanByTransactionIdServer } from "~/lib/api/loan/get-loan-by-transaction-id";
import { postLoanByEmailServer } from "~/lib/api/loan/post-loan-by-email";
import { putLoanByIdServer } from "~/lib/api/loan/put-loan-by-id";
import { putTransactionByIdServer } from "~/lib/api/transaction/put-transaction-by-id";
import { sileo } from "~/lib/toaster";
import {
  invalidateLoanQueries,
  invalidateTransactionQueries,
} from "~/utils/query-invalidation";
import { TransactionFormSchema } from "~/zod-schemas/transaction-schema";
import { useForm, type Resolver } from "react-hook-form";
import type { z } from "zod";

export const useEditTransaction = (
  transaction: Transaction,
  onCloseDialog: () => void,
) => {
  const queryClient = useQueryClient();
  // Holds the loan that's already linked to this transaction (if any).
  const existingLoanRef = useRef<Loan | null>(null);

  // Pre-resolve the initial loan mode from the transaction itself:
  // if the row already has `appliedToLoanId`, we open in "apply" mode.
  // Mode "create" is set later from a follow-up fetch (see effect below).
  const initialAppliedToLoanId =
    (transaction as Transaction & { appliedToLoanId?: string | null })
      .appliedToLoanId ?? null;

  const form = useForm<z.infer<typeof TransactionFormSchema>>({
    resolver: zodResolver(TransactionFormSchema) as Resolver<
      z.infer<typeof TransactionFormSchema>
    >,
    defaultValues: {
      [transactionFormNames.amount]: transaction.amount.toString(),
      [transactionFormNames.type]: transaction.type as "income" | "expense",
      [transactionFormNames.category]: transaction.category,
      [transactionFormNames.description]: transaction.description ?? "",
      [transactionFormNames.date]: transaction.date,
      [transactionFormNames.cardId]: transaction.cardId ?? null,
      [transactionFormNames.loanMode]: initialAppliedToLoanId
        ? "apply"
        : "none",
      [transactionFormNames.markAsLoan]: false,
      [transactionFormNames.loanDebtor]: "",
      [transactionFormNames.loanDueAt]: null,
      [transactionFormNames.appliedToLoanId]: initialAppliedToLoanId,
    },
  });

  // Fetch the linked-origin loan once and pre-fill the form fields, but
  // only when the transaction is not already a payment of another loan
  // (the two modes are mutually exclusive).
  useEffect(() => {
    if (initialAppliedToLoanId) return;

    getLoanByTransactionIdServer({
      data: { transactionId: transaction.id },
    }).then((res) => {
      if (res.data) {
        existingLoanRef.current = res.data;
        form.setValue(
          transactionFormNames.loanMode as Parameters<typeof form.setValue>[0],
          "create",
        );
        form.setValue(
          transactionFormNames.markAsLoan as Parameters<
            typeof form.setValue
          >[0],
          true,
        );
        form.setValue(
          transactionFormNames.loanDebtor as Parameters<
            typeof form.setValue
          >[0],
          res.data.debtor,
        );
        form.setValue(
          transactionFormNames.loanDueAt as Parameters<typeof form.setValue>[0],
          res.data.dueAt ?? null,
        );
      }
    });
    // Only run once when the dialog opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaction.id]);

  const putTransactionByIdMutation = useMutation({
    fn: putTransactionByIdServer,
    onSuccess: async (ctx) => {
      if (ctx.data?.error) {
        sileo.error({ title: ctx.data.message });
        return;
      }
      sileo.success({ title: ctx.data.message });

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
          appliedToLoanId: variables.data.data.appliedToLoanId ?? null,
          cardId: variables.data.data.cardId ?? null,
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
    data: z.infer<typeof TransactionFormSchema>,
  ) => {
    try {
      const mode = data.loanMode ?? "none";
      const nextAppliedToLoanId =
        mode === "apply" ? (data.appliedToLoanId ?? null) : null;

      const result = await putTransactionByIdMutation.mutate({
        data: {
          id: transaction.id,
          data: {
            amount: Number.parseFloat(data.amount),
            type: data.type,
            category: data.category,
            description: data.description || "",
            date: data.date || new Date(),
            // Send only when in apply or explicitly clearing; in "create"/"none"
            // we want to keep this column in sync (set to null).
            appliedToLoanId: nextAppliedToLoanId,
            // Reassign (or clear) the linked card; the DB layer moves the
            // balance delta to the right card atomically.
            cardId: data.cardId ?? null,
          },
        },
      });

      if (!result || isErrorPayload(result)) return;

      const amount = Number.parseFloat(data.amount);
      const txDate = data.date || new Date();
      const debtor = (data.loanDebtor ?? "").trim();
      const existing = existingLoanRef.current;

      // ── Origin-loan side (mode === "create") ──────────────────────────
      // Only touch the origin loan when in "create" or when leaving it
      // (existing was set previously and user picked another mode).
      if (mode !== "create" && existing) {
        // User left the create-loan flow on a transaction that previously
        // had a linked origin loan — remove it so toggling is reversible.
        await deleteLoanByIdServer({ data: { id: existing.id } });
        existingLoanRef.current = null;
      } else if (mode === "create" && debtor) {
        if (existing) {
          await putLoanByIdServer({
            data: {
              id: existing.id,
              debtor,
              amount,
              issuedAt: txDate,
              dueAt: data.loanDueAt ?? null,
              notes: data.description?.trim() || null,
            },
          });
        } else {
          const loanResult = await postLoanByEmailServer({
            data: {
              email: transaction.userEmail,
              loan: {
                debtor,
                amount,
                issuedAt: txDate,
                dueAt: data.loanDueAt ?? null,
                notes: data.description?.trim() || null,
                transactionId: transaction.id,
              },
            },
          });

          if (loanResult?.data && !isErrorPayload(loanResult)) {
            existingLoanRef.current = loanResult.data as Loan;
          } else {
            sileo.warning({
              title: "Transaction saved, but loan could not be created",
            });
          }
        }
      }

      // The transaction PUT already invalidates loan queries via
      // invalidateTransactionQueries, but we keep this explicit call here
      // so any side-effect from the origin-loan flow above also triggers a
      // refetch of the loans list.
      await invalidateLoanQueries(queryClient, transaction.userEmail);
      onCloseDialog();
    } catch {
      sileo.error({ title: "Error editing transaction" });
    }
  };

  return {
    form,
    onSubmitEditedTransaction,
    mutation: putTransactionByIdMutation,
  };
};
