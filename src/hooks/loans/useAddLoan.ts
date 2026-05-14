import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { useRouteUser } from "~/hooks/useRouteUser";
import { postLoanByEmailServer } from "~/lib/api/loan/post-loan-by-email";
import { sileo } from "~/lib/toaster";
import { invalidateLoanQueries } from "~/utils/query-invalidation";
import { LoanFormSchema, type LoanFormValues } from "~/zod-schemas/loan-schema";

export const useAddLoan = () => {
  const queryClient = useQueryClient();
  const userEmail = useRouteUser();

  const form = useForm<LoanFormValues>({
    resolver: zodResolver(LoanFormSchema),
    defaultValues: {
      debtor: "",
      amount: "",
      issuedAt: new Date(),
      dueAt: null,
      notes: "",
      transactionId: null,
      direction: "lent",
    },
  });

  const mutation = useMutation({
    fn: postLoanByEmailServer,
    onSuccess: async ({ data }) => {
      if (isErrorPayload(data)) {
        const response = data as { message?: string };
        sileo.error({ title: response.message ?? "Failed to create loan" });
        return;
      }
      sileo.success({ title: "Loan created" });
      form.reset();
      await invalidateLoanQueries(queryClient, userEmail);
    },
    idempotency: {
      getKey: (variables) =>
        JSON.stringify({
          debtor: variables.data.loan.debtor.trim().toLowerCase(),
          amount: variables.data.loan.amount,
          issuedAt: variables.data.loan.issuedAt?.toISOString() ?? "",
        }),
      onDuplicatePending: { title: "Loan is already being saved" },
      onDuplicateRecentSuccess: { title: "Loan already saved" },
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
            debtor: values.debtor.trim(),
            amount: Number(values.amount),
            issuedAt: values.issuedAt ?? new Date(),
            dueAt: values.dueAt ?? null,
            notes: values.notes ?? null,
            transactionId: values.transactionId ?? null,
            direction: values.direction ?? "lent",
          },
        },
      });
    } catch {
      sileo.error({ title: "Failed to create loan" });
    }
  };

  return { form, onSubmit, mutation };
};
