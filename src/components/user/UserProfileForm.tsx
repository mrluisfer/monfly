import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ShieldCheckIcon, SparklesIcon } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Form } from "~/components/ui/form";
import { userFormNames } from "~/constants/forms/user-form-names";
import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { exportUserDataServer } from "~/lib/api/user/export-user-data";
import { putUserTotalBalanceServer } from "~/lib/api/user/put-user-total-balance";
import { updateUserProfileServer } from "~/lib/api/user/update-user-profile";
import { sileo } from "~/lib/toaster";
import { DEFAULT_CURRENCY } from "~/utils/format-currency";
import { formatToTwoDecimals } from "~/utils/formatTwoDecimals";
import { invalidateUserQueries } from "~/utils/query-invalidation";
import {
  type SupportedCurrency,
  userFormSchema,
} from "~/zod-schemas/user-schema";

import { UserFormActions } from "./UserFormActions";
import { UserFormFields } from "./UserFormFields";

interface User {
  acceptedPrivacyAt?: string | Date | null;
  acceptedTermsAt?: string | Date | null;
  email: string;
  id: string;
  marketingOptIn?: boolean | null;
  name?: string | null;
  preferredCurrency?: string | null;
  productUpdatesOptIn?: boolean | null;
  totalBalance?: number | null;
}

interface UserProfileFormProps {
  onDelete?: () => void | Promise<void>;
  onExport?: () => void | Promise<void>;
  user: User;
}

type FormValues = z.infer<typeof userFormSchema>;

export function UserProfileForm({
  user,
  onExport,
  onDelete,
}: UserProfileFormProps) {
  const queryClient = useQueryClient();
  const defaultTotalBalance = formatToTwoDecimals(
    user.totalBalance ?? 0,
  ).numberValue;

  const buildDefaults = useCallback(
    (): FormValues => ({
      [userFormNames.email]: user.email,
      [userFormNames.name]: user.name ?? "",
      [userFormNames.totalBalance]: defaultTotalBalance,
      [userFormNames.preferredCurrency]:
        (user.preferredCurrency as SupportedCurrency | undefined) ??
        DEFAULT_CURRENCY,
      [userFormNames.marketingOptIn]: user.marketingOptIn ?? false,
      [userFormNames.productUpdatesOptIn]: user.productUpdatesOptIn ?? true,
      [userFormNames.acceptTerms]: !!user.acceptedTermsAt,
      [userFormNames.acceptPrivacy]: !!user.acceptedPrivacyAt,
    }),
    [
      user.email,
      user.name,
      defaultTotalBalance,
      user.preferredCurrency,
      user.marketingOptIn,
      user.productUpdatesOptIn,
      user.acceptedTermsAt,
      user.acceptedPrivacyAt,
    ],
  );

  const form = useForm<FormValues>({
    defaultValues: buildDefaults(),
    mode: "onBlur",
    resolver: zodResolver(userFormSchema),
    reValidateMode: "onChange",
  });

  useEffect(() => {
    form.reset(buildDefaults());
  }, [buildDefaults, form]);

  const handleBalanceBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const { numberValue, stringValue } = formatToTwoDecimals(e.target.value);
      form.setValue(userFormNames.totalBalance, numberValue, {
        shouldDirty: true,
        shouldValidate: true,
      });
      e.currentTarget.value = stringValue;
    },
    [form],
  );

  const profileMutation = useMutation({
    fn: updateUserProfileServer,
    onSuccess: async ({ data }) => {
      if (isErrorPayload(data)) {
        const response = data as { message?: string };
        sileo.error({ title: response.message ?? "Failed to save changes" });
        return;
      }
      sileo.success({ title: "Changes saved" });
      // Reset the dirty baseline to what we just persisted.
      form.reset(form.getValues());
      if (user.email) {
        await invalidateUserQueries(queryClient, user.email);
      }
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user.email) {
      sileo.error({ title: "User session not found" });
      return;
    }
    try {
      await profileMutation.mutate({
        data: {
          acceptPrivacy: values.acceptPrivacy,
          acceptTerms: values.acceptTerms,
          email: user.email,
          marketingOptIn: values.marketingOptIn,
          name: values.name,
          preferredCurrency: values.preferredCurrency ?? null,
          productUpdatesOptIn: values.productUpdatesOptIn,
        },
      });
    } catch {
      sileo.error({ title: "Failed to save changes" });
    }
  };

  const balanceMutation = useMutation({
    fn: putUserTotalBalanceServer,
    onSuccess: async ({ data }) => {
      if (isErrorPayload(data)) {
        const response = data as { message?: string };
        sileo.error({ title: response.message ?? "Failed to update balance" });
        return;
      }
      sileo.success({ title: "Total balance updated" });
      // Reset the field's dirty baseline to the value we just persisted.
      const persisted = form.getValues(userFormNames.totalBalance) ?? 0;
      form.resetField(userFormNames.totalBalance, { defaultValue: persisted });
      if (user.email) {
        await invalidateUserQueries(queryClient, user.email);
      }
    },
  });

  const handleUpdateBalance = async () => {
    if (!user.email) {
      sileo.error({ title: "User session not found" });
      return;
    }
    const { numberValue } = formatToTwoDecimals(
      form.getValues(userFormNames.totalBalance) ?? 0,
    );
    if (!Number.isFinite(numberValue)) {
      sileo.error({ title: "Enter a valid balance amount" });
      return;
    }
    try {
      await balanceMutation.mutate({
        data: { email: user.email, totalBalance: numberValue },
      });
    } catch {
      sileo.error({ title: "Failed to update balance" });
    }
  };

  const handleExport = async () => {
    const res = await exportUserDataServer();
    if (!(res?.success && res.data)) {
      sileo.error({ title: res?.message ?? "Failed to export your data" });
      return;
    }
    // ponytail: object URL + anchor click, the platform's own download path.
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(res.data, null, 2)], {
        type: "application/json",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `monfly-export-${res.data.exportedAt.slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    sileo.success({ title: "Export downloaded" });
  };

  const submitting = form.formState.isSubmitting;
  const hasChanges = form.formState.isDirty;
  const updatingBalance = balanceMutation.status === "pending";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative space-y-10"
        noValidate
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 -z-10 size-72 rounded-full bg-[radial-gradient(circle,var(--primary)/10%,transparent_70%)] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 left-0 -z-10 size-56 rounded-full bg-[radial-gradient(circle,#0f766e_0%,transparent_72%)] opacity-15 blur-3xl"
        />

        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="relative inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent text-primary ring-1 ring-primary/20"
            >
              <ShieldCheckIcon className="size-5" />
            </span>
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-2 py-0.5 font-semibold text-[0.65rem] text-muted-foreground uppercase tracking-[0.13em]">
                <SparklesIcon className="size-3" aria-hidden="true" />
                Profile settings
              </span>
              <h3 className="font-[family-name:var(--font-syne)] font-semibold text-foreground text-xl tracking-tight sm:text-2xl">
                Account &amp; preferences
              </h3>
              <p className="max-w-xl text-muted-foreground text-sm">
                Update your profile, security, communication preferences and
                legal acknowledgements.
              </p>
            </div>
          </div>
        </header>

        <UserFormFields
          form={form}
          onBalanceBlur={handleBalanceBlur}
          onUpdateBalance={handleUpdateBalance}
          updatingBalance={updatingBalance}
        />

        <UserFormActions
          submitting={submitting}
          hasChanges={hasChanges}
          onExport={onExport ?? handleExport}
          onDelete={onDelete}
        />
      </form>
    </Form>
  );
}
