import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { useRouteUser } from "~/hooks/useRouteUser";
import { postCardByEmailServer } from "~/lib/api/card/post-card-by-email";
import { sileo } from "~/lib/toaster";
import { invalidateCardQueries } from "~/utils/query-invalidation";
import { CardFormSchema, type CardFormValues } from "~/zod-schemas/card-schema";

/** `onCreated` fires only after a card is actually persisted — the card page
 *  uses it to collapse the form. */
export const useAddCard = (onCreated?: () => void) => {
  const queryClient = useQueryClient();
  const userEmail = useRouteUser();

  const form = useForm<CardFormValues>({
    defaultValues: {
      balance: "",
      color: null,
      last4: null,
      name: "",
      provider: null,
      type: null,
    },
    resolver: zodResolver(CardFormSchema),
  });

  const mutation = useMutation({
    fn: postCardByEmailServer,
    idempotency: {
      getKey: (variables) =>
        JSON.stringify({
          last4: variables.data.card.last4 ?? "",
          name: variables.data.card.name.trim().toLowerCase(),
        }),
      onDuplicatePending: { title: "Card is already being saved" },
      onDuplicateRecentSuccess: { title: "Card already saved" },
    },
    onSuccess: async ({ data }) => {
      if (isErrorPayload(data)) {
        const response = data as { message?: string };
        sileo.error({ title: response.message ?? "Failed to create card" });
        return;
      }
      sileo.success({ title: "Card created" });
      form.reset();
      onCreated?.();
      await invalidateCardQueries(queryClient, userEmail);
    },
  });

  const onSubmit = async (values: CardFormValues) => {
    if (!userEmail) {
      sileo.error({ title: "User session not found" });
      return;
    }
    try {
      await mutation.mutate({
        data: {
          card: {
            balance:
              values.balance && values.balance !== ""
                ? Number(values.balance)
                : null,
            color: values.color ?? null,
            last4: values.last4 ?? null,
            name: values.name.trim(),
            provider: values.provider ?? null,
            type: values.type ?? null,
          },
          email: userEmail,
        },
      });
    } catch {
      sileo.error({ title: "Failed to create card" });
    }
  };

  return { form, mutation, onSubmit };
};
