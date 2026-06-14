import { useQueryClient } from "@tanstack/react-query";

import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { useRouteUser } from "~/hooks/useRouteUser";
import { deleteCardByIdServer } from "~/lib/api/card/delete-card-by-id";
import { sileo } from "~/lib/toaster";
import { invalidateCardQueries } from "~/utils/query-invalidation";

export const useDeleteCard = () => {
  const queryClient = useQueryClient();
  const userEmail = useRouteUser();

  const mutation = useMutation({
    fn: deleteCardByIdServer,
    onSuccess: async ({ data }) => {
      if (isErrorPayload(data)) {
        const response = data as { message?: string };
        sileo.error({ title: response.message ?? "Failed to delete card" });
        return;
      }
      sileo.success({ title: "Card deleted" });
      await invalidateCardQueries(queryClient, userEmail);
    },
  });

  const remove = (id: string) => mutation.mutate({ data: { id } });

  return { mutation, remove };
};
