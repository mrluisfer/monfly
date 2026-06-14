import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ShieldCheckIcon, SparklesIcon } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "~/components/ui/form";
import { userFormNames } from "~/constants/forms/user-form-names";
import { useAppHaptics } from "~/hooks/haptics/useAppHaptics";
import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { putUserTotalBalanceServer } from "~/lib/api/user/put-user-total-balance";
import { updateUserProfileServer } from "~/lib/api/user/update-user-profile";
import { sileo } from "~/lib/toaster";
import { formatToTwoDecimals } from "~/utils/formatTwoDecimals";
import { invalidateUserQueries } from "~/utils/query-invalidation";
import {
  type SupportedCurrency,
  userFormSchema,
} from "~/zod-schemas/user-schema";

import { UserFormActions } from "./UserFormActions";
import { UserFormFields } from "./UserFormFields";

interface User {
  id: string;
  email: string;
  name?: string | null;
  totalBalance?: number | null;
  preferredCurrency?: string | null;
  marketingOptIn?: boolean | null;
  productUpdatesOptIn?: boolean | null;
  acceptedTermsAt?: string | Date | null;
  acceptedPrivacyAt?: string | Date | null;
}

interface UserProfileFormProps {
  userId: string;
  user: User;
  onExport?: () => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
}

type FormValues = z.infer<typeof userFormSchema>;

export function UserProfileForm({
  userId,
  user,
  onExport,
  onDelete,
}: UserProfileFormProps) {
  const { warning } = useAppHaptics();
  const queryClient = useQueryClient();
  const defaultTotalBalance = formatToTwoDecimals(
    user?.totalBalance ?? 0,
  ).numberValue;

  const buildDefaults = useCallback(
    (): FormValues => ({
      [userFormNames.email]: user?.email ?? "",
      [userFormNames.name]: user?.name ?? "",
      [userFormNames.totalBalance]: defaultTotalBalance,
      [userFormNames.preferredCurrency]:
        (user?.preferredCurrency as SupportedCurrency | undefined) ?? "MXN",
      [userFormNames.marketingOptIn]: user?.marketingOptIn ?? false,
      [userFormNames.productUpdatesOptIn]: user?.productUpdatesOptIn ?? true,
      [userFormNames.acceptTerms]: !!user?.acceptedTermsAt,
      [userFormNames.acceptPrivacy]: !!user?.acceptedPrivacyAt,
    }),
    [
      user?.email,
      user?.name,
      defaultTotalBalance,
      user?.preferredCurrency,
      user?.marketingOptIn,
      user?.productUpdatesOptIn,
      user?.acceptedTermsAt,
      user?.acceptedPrivacyAt,
    ],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: buildDefaults(),
    mode: "onBlur",
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
      if (user?.email) {
        await invalidateUserQueries(queryClient, user.email);
      }
    },
  });

  const onSubmit = async (values: FormValues) => {
    void userId;
    if (!user?.email) {
      sileo.error({ title: "User session not found" });
      return;
    }
    try {
      await profileMutation.mutate({
        data: {
          email: user.email,
          name: values.name,
          preferredCurrency: values.preferredCurrency ?? null,
          marketingOptIn: values.marketingOptIn,
          productUpdatesOptIn: values.productUpdatesOptIn,
          acceptTerms: values.acceptTerms,
          acceptPrivacy: values.acceptPrivacy,
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
      if (user?.email) {
        await invalidateUserQueries(queryClient, user.email);
      }
    },
  });

  const handleUpdateBalance = async () => {
    if (!user?.email) {
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
        data: { totalBalance: numberValue, email: user.email },
      });
    } catch {
      sileo.error({ title: "Failed to update balance" });
    }
  };

  const submitting = form.formState.isSubmitting;
  const hasChanges = form.formState.isDirty;
  const updatingBalance = balanceMutation.status === "pending";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, () => {
          void warning();
        })}
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
              className="from-primary/20 via-primary/10 text-primary ring-primary/20 relative inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br to-transparent ring-1"
            >
              <ShieldCheckIcon className="size-5" />
            </span>
            <div className="space-y-1">
              <span className="bg-foreground/5 text-muted-foreground inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold tracking-[0.13em] uppercase">
                <SparklesIcon className="size-3" aria-hidden="true" />
                Profile settings
              </span>
              <h3 className="text-foreground font-[family-name:var(--font-syne)] text-xl font-semibold tracking-tight sm:text-2xl">
                Account &amp; preferences
              </h3>
              <p className="text-muted-foreground max-w-xl text-sm">
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
          onExport={onExport}
          onDelete={onDelete}
        />
      </form>
    </Form>
  );
}
