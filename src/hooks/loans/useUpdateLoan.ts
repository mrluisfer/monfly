import { useQueryClient } from "@tanstack/react-query";

import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { useRouteUser } from "~/hooks/useRouteUser";
import { putLoanByIdServer } from "~/lib/api/loan/put-loan-by-id";
import { sileo } from "~/lib/toaster";
import { invalidateLoanQueries } from "~/utils/query-invalidation";
import type { UpdateLoanInput } from "~/zod-schemas/loan-schema";

export const useUpdateLoan = () => {
  const queryClient = useQueryClient();
  const userEmail = useRouteUser();

  const mutation = useMutation({
    fn: putLoanByIdServer,
    onSuccess: async ({ data }) => {
      if (isErrorPayload(data)) {
        const response = data as { message?: string };
        sileo.error({ title: response.message ?? "Failed to update loan" });
        return;
      }
      sileo.success({ title: "Loan updated" });
      await invalidateLoanQueries(queryClient, userEmail);
    },
  });

  const update = (input: UpdateLoanInput) => mutation.mutate({ data: input });

  /**
   * Convenience helpers for the most common state transitions.
   */
  const markPaid = (id: string) => update({ id, status: "paid" });
  const markPending = (id: string) =>
    update({ id, status: "pending", amountPaid: 0 });
  const recordPayment = (id: string, amountPaid: number) =>
    update({ id, amountPaid });

  return { mutation, update, markPaid, markPending, recordPayment };
};
