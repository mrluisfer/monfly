import { useQueryClient } from "@tanstack/react-query";

import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { useRouteUser } from "~/hooks/useRouteUser";
import { deleteLoanByIdServer } from "~/lib/api/loan/delete-loan-by-id";
import { sileo } from "~/lib/toaster";
import { invalidateLoanQueries } from "~/utils/query-invalidation";

export const useDeleteLoan = () => {
  const queryClient = useQueryClient();
  const userEmail = useRouteUser();

  const mutation = useMutation({
    fn: deleteLoanByIdServer,
    onSuccess: async ({ data }) => {
      if (isErrorPayload(data)) {
        const response = data as { message?: string };
        sileo.error({ title: response.message ?? "Failed to delete loan" });
        return;
      }
      sileo.success({ title: "Loan deleted" });
      await invalidateLoanQueries(queryClient, userEmail);
    },
  });

  const remove = (id: string) => mutation.mutate({ data: { id } });

  return { mutation, remove };
};
