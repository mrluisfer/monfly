import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { useRouteUser } from "~/hooks/useRouteUser";
import { postCardByEmailServer } from "~/lib/api/card/post-card-by-email";
import { sileo } from "~/lib/toaster";
import { invalidateCardQueries } from "~/utils/query-invalidation";
import { CardFormSchema, type CardFormValues } from "~/zod-schemas/card-schema";

export const useAddCard = () => {
  const queryClient = useQueryClient();
  const userEmail = useRouteUser();

  const form = useForm<CardFormValues>({
    resolver: zodResolver(CardFormSchema),
    defaultValues: {
      name: "",
      type: null,
      last4: null,
      provider: null,
      balance: "",
      color: null,
    },
  });

  const mutation = useMutation({
    fn: postCardByEmailServer,
    onSuccess: async ({ data }) => {
      if (isErrorPayload(data)) {
        const response = data as { message?: string };
        sileo.error({ title: response.message ?? "Failed to create card" });
        return;
      }
      sileo.success({ title: "Card created" });
      form.reset();
      await invalidateCardQueries(queryClient, userEmail);
    },
    idempotency: {
      getKey: (variables) =>
        JSON.stringify({
          name: variables.data.card.name.trim().toLowerCase(),
          last4: variables.data.card.last4 ?? "",
        }),
      onDuplicatePending: { title: "Card is already being saved" },
      onDuplicateRecentSuccess: { title: "Card already saved" },
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
          email: userEmail,
          card: {
            name: values.name.trim(),
            type: values.type ?? null,
            last4: values.last4 ?? null,
            provider: values.provider ?? null,
            balance:
              values.balance && values.balance !== ""
                ? Number(values.balance)
                : null,
            color: values.color ?? null,
          },
        },
      });
    } catch {
      sileo.error({ title: "Failed to create card" });
    }
  };

  return { form, onSubmit, mutation };
};
