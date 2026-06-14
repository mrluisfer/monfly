import { useQueryClient } from "@tanstack/react-query";

import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { useRouteUser } from "~/hooks/useRouteUser";
import { putCardByIdServer } from "~/lib/api/card/put-card-by-id";
import { sileo } from "~/lib/toaster";
import { invalidateCardQueries } from "~/utils/query-invalidation";
import type { UpdateCardInput } from "~/zod-schemas/card-schema";

export const useUpdateCard = () => {
  const queryClient = useQueryClient();
  const userEmail = useRouteUser();

  const mutation = useMutation({
    fn: putCardByIdServer,
    onSuccess: async ({ data }) => {
      if (isErrorPayload(data)) {
        const response = data as { message?: string };
        sileo.error({ title: response.message ?? "Failed to update card" });
        return;
      }
      sileo.success({ title: "Card updated" });
      await invalidateCardQueries(queryClient, userEmail);
    },
  });

  const update = (input: UpdateCardInput) => mutation.mutate({ data: input });

  const archive = (id: string) => update({ id, status: "archived" });
  const restore = (id: string) => update({ id, status: "active" });

  return { mutation, update, archive, restore };
};
