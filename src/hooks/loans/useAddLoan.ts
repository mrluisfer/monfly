import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { useRouteUser } from "~/hooks/useRouteUser";
import { postLoanByEmailServer } from "~/lib/api/loan/post-loan-by-email";
import { sileo } from "~/lib/toaster";
import { invalidateLoanQueries } from "~/utils/query-invalidation";
import { LoanFormSchema, type LoanFormValues } from "~/zod-schemas/loan-schema";

/**
 * A blank loan form. Built fresh on each call so `issuedAt` is today's date
 * rather than whenever the page happened to mount.
 */
export const buildLoanFormDefaults = (): LoanFormValues => ({
  amount: "",
  debtor: "",
  direction: "borrowed",
  dueAt: null,
  issuedAt: new Date(),
  notes: "",
  transactionId: null,
});

export const useAddLoan = () => {
  const queryClient = useQueryClient();
  const userEmail = useRouteUser();

  const form = useForm<LoanFormValues>({
    defaultValues: buildLoanFormDefaults(),
    resolver: zodResolver(LoanFormSchema),
  });

  const mutation = useMutation({
    fn: postLoanByEmailServer,
    idempotency: {
      getKey: (variables) =>
        JSON.stringify({
          amount: variables.data.loan.amount,
          debtor: variables.data.loan.debtor.trim().toLowerCase(),
          issuedAt: variables.data.loan.issuedAt?.toISOString() ?? "",
        }),
      onDuplicatePending: { title: "Loan is already being saved" },
      onDuplicateRecentSuccess: { title: "Loan already saved" },
    },
    onSuccess: async ({ data }) => {
      if (isErrorPayload(data)) {
        const response = data as { message?: string };
        sileo.error({ title: response.message ?? "Failed to create loan" });
        return;
      }
      sileo.success({ title: "Loan created" });
      form.reset(buildLoanFormDefaults());
      await invalidateLoanQueries(queryClient, userEmail);
    },
  });

  const onSubmit = async (values: LoanFormValues) => {
    if (!userEmail) {
      sileo.error({ title: "User session not found" });
      return;
    }
    try {
      await mutation.mutate({
        data: {
          email: userEmail,
          loan: {
            amount: Number(values.amount),
            debtor: values.debtor.trim(),
            direction: values.direction ?? "borroed",
            dueAt: values.dueAt ?? null,
            issuedAt: values.issuedAt ?? new Date(),
            notes: values.notes ?? null,
            transactionId: values.transactionId ?? null,
          },
        },
      });
    } catch {
      sileo.error({ title: "Failed to create loan" });
    }
  };

  return { form, mutation, onSubmit };
};
