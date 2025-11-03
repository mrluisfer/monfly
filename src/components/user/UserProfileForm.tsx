import { useCallback, useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "~/components/ui/form";
import { userFormNames } from "~/constants/forms/user-form-names";
import { formatToTwoDecimals } from "~/utils/formatTwoDecimals";
import { userFormSchema } from "~/zod-schemas/user-schema";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { UserFormActions } from "./UserFormActions";
import { UserFormFields } from "./UserFormFields";

interface User {
  id: string;
  email: string;
  name?: string | null;
  totalBalance?: number | null;
}

interface UserProfileFormProps {
  userId: string;
  user: User;
}

type FormValues = z.infer<typeof userFormSchema>;

export function UserProfileForm({ userId, user }: UserProfileFormProps) {
  const memoUserId = useMemo(() => userId, [userId]);
  const defaultTotalBalance = useMemo(
    () => formatToTwoDecimals(user?.totalBalance ?? 0).numberValue,
    [user?.totalBalance]
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      [userFormNames.email]: user?.email ?? "",
      [userFormNames.name]: user?.name ?? "",
      [userFormNames.password]: "",
      [userFormNames.totalBalance]: defaultTotalBalance,
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    form.reset({
      [userFormNames.email]: user?.email ?? "",
      [userFormNames.name]: user?.name ?? "",
      [userFormNames.password]: "",
      [userFormNames.totalBalance]: defaultTotalBalance,
    });
  }, [user?.email, user?.name, defaultTotalBalance, form]);

  const handleBalanceBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const { numberValue, stringValue } = formatToTwoDecimals(e.target.value);
      form.setValue(userFormNames.totalBalance, numberValue, {
        shouldDirty: true,
        shouldValidate: true,
      });
      e.currentTarget.value = stringValue;
    },
    [form]
  );

  const onSubmit = useCallback(
    async (values: FormValues) => {
      console.log("Submit user", memoUserId, values);
      // TODO: llama a tu server action aquí
    },
    [memoUserId]
  );

  const submitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        noValidate
      >
        <UserFormFields form={form} onBalanceBlur={handleBalanceBlur} />
        <UserFormActions submitting={submitting} />
      </form>
    </Form>
  );
}
