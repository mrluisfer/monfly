import { useCallback, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "~/components/ui/form";
import { userFormNames } from "~/constants/forms/user-form-names";
import { useAppHaptics } from "~/hooks/haptics/useAppHaptics";
import { formatToTwoDecimals } from "~/utils/formatTwoDecimals";
import {
  type SupportedCurrency,
  userFormSchema,
} from "~/zod-schemas/user-schema";
import { ShieldCheckIcon, SparklesIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { UserFormActions } from "./UserFormActions";
import { UserFormFields } from "./UserFormFields";

interface User {
  id: string;
  email: string;
  name?: string | null;
  totalBalance?: number | null;
  preferredCurrency?: SupportedCurrency | null;
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
  const defaultTotalBalance = formatToTwoDecimals(
    user?.totalBalance ?? 0,
  ).numberValue;

  const buildDefaults = useCallback(
    (): FormValues => ({
      [userFormNames.email]: user?.email ?? "",
      [userFormNames.name]: user?.name ?? "",
      [userFormNames.password]: "",
      [userFormNames.confirmPassword]: "",
      [userFormNames.totalBalance]: defaultTotalBalance,
      [userFormNames.preferredCurrency]: user?.preferredCurrency ?? "MXN",
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

  const onSubmit = useCallback(
    async (values: FormValues) => {
      // TODO: llama a tu server action aquí
      void values;
      void userId;
    },
    [userId],
  );

  const submitting = form.formState.isSubmitting;
  const hasChanges = form.formState.isDirty;

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

        <UserFormFields form={form} onBalanceBlur={handleBalanceBlur} />

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
