import { zodResolver } from "@hookform/resolvers/zod";
import type { Card } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { useRouteUser } from "~/hooks/useRouteUser";
import { putCardByIdServer } from "~/lib/api/card/put-card-by-id";
import { sileo } from "~/lib/toaster";
import { invalidateCardQueries } from "~/utils/query-invalidation";
import { CardFormSchema, type CardFormValues } from "~/zod-schemas/card-schema";

export const useEditCard = (
  card: Card,
  options?: { onSuccess?: () => void },
) => {
  const queryClient = useQueryClient();
  const userEmail = useRouteUser();

  const form = useForm<CardFormValues>({
    defaultValues: {
      balance:
        card.balance !== null && card.balance !== undefined
          ? String(card.balance)
          : "",
      color: card.color ?? null,
      last4: card.last4 ?? null,
      name: card.name,
      provider: card.provider ?? null,
      type: card.type ?? null,
    },
    resolver: zodResolver(CardFormSchema),
  });

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
      options?.onSuccess?.();
    },
  });

  const onSubmit = async (values: CardFormValues) => {
    try {
      await mutation.mutate({
        data: {
          // Empty string = leave the balance untouched; a number adjusts it
          // (the server moves the delta to the user total atomically).
          balance:
            values.balance && values.balance !== ""
              ? Number(values.balance)
              : null,
          color: values.color ?? null,
          id: card.id,
          last4: values.last4 ?? null,
          name: values.name.trim(),
          provider: values.provider ?? null,
          type: values.type ?? null,
        },
      });
    } catch {
      sileo.error({ title: "Failed to update card" });
    }
  };

  return { form, mutation, onSubmit };
};
