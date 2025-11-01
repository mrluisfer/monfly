import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { transactionFormNames } from "~/constants/forms/transaction-form-names";
import { useMutation } from "~/hooks/use-mutation";
import { postTransactionByEmailServer } from "~/lib/api/transaction/post-transaction-by-email.server";
import { queryDictionary } from "~/queries/dictionary";
import { getUserSession } from "~/utils/user/get-user-session";
import { TransactionFormSchema } from "~/zod-schemas/transaction-schema";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { useRouteUser } from "./use-route-user";

type FormValues = z.infer<typeof TransactionFormSchema>;

export const useAddTransaction = () => {
  const queryClient = useQueryClient();
  const userEmail = useRouteUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(TransactionFormSchema),
    defaultValues: {
      [transactionFormNames.type]: "income",
      [transactionFormNames.date]: new Date(),
      [transactionFormNames.category]: "",
      [transactionFormNames.amount]: "",
      [transactionFormNames.description]: "",
    },
  });

  const postTransactionByEmail = useMutation({
    fn: postTransactionByEmailServer,
    onSuccess: async () => {
      toast.success("Transaction created successfully");
      form.reset();
      await queryClient.invalidateQueries({
        queryKey: [queryDictionary.transactions, userEmail],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryDictionary.user, userEmail],
      });
      await queryClient.invalidateQueries({
        queryKey: [queryDictionary.categories, userEmail],
      });
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const { data: userEmail } = await getUserSession();
      if (!userEmail) throw new Error("User email not found");
      const transformedData = {
        amount: Number.parseFloat(data.amount),
        type: data.type,
        category: data.category,
        description: data.description || null,
        date: data.date || new Date(),
        user: { connect: { email: userEmail } },
      };
      await postTransactionByEmail.mutate({
        data: {
          email: userEmail,
          transaction: {
            ...transformedData,
            date: new Date(transformedData.date),
          },
        },
      });
    } catch (error) {
      toast.error("Failed to create transaction");
    }
  };

  return { form, onSubmit, mutation: postTransactionByEmail };
};
