import { Link } from "@tanstack/react-router";
import {
  BellRingIcon,
  CheckIcon,
  LoaderIcon,
  LockKeyholeIcon,
  MailIcon,
  ScaleIcon,
  UserIcon,
  WalletIcon,
} from "lucide-react";
import { useId } from "react";
import type { ControllerProps, UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { ChangePasswordRow } from "~/components/settings/ChangePasswordRow";
import { ConsentRow } from "~/components/shared/ConsentRow";
import { Button } from "~/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { userFormNames } from "~/constants/forms/user-form-names";
import { DEFAULT_CURRENCY } from "~/utils/format-currency";
import {
  supportedCurrencies,
  type userFormSchema,
} from "~/zod-schemas/user-schema";

type UserFormValues = z.infer<typeof userFormSchema>;

type UserFieldRender = ControllerProps<UserFormValues>["render"];

const renderEmail: UserFieldRender = ({ field }) => (
  <FormItem className="md:col-span-2">
    <FormLabel>Email</FormLabel>
    <FormControl>
      <div className="relative">
        <MailIcon
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="email"
          inputMode="email"
          placeholder="you@email.com"
          readOnly
          aria-readonly="true"
          className="h-11 bg-muted/40 pl-9 opacity-90"
          {...field}
        />
      </div>
    </FormControl>
    <FormDescription>
      This is your sign-in email and cannot be changed here.
    </FormDescription>
    <FormMessage />
  </FormItem>
);

const renderName: UserFieldRender = ({ field }) => (
  <FormItem>
    <FormLabel>Name</FormLabel>
    <FormControl>
      <Input
        placeholder="Your name"
        autoComplete="name"
        className="h-11"
        {...field}
      />
    </FormControl>
    <FormDescription>This is your public display name.</FormDescription>
    <FormMessage />
  </FormItem>
);

const renderCurrency: UserFieldRender = ({ field }) => (
  <FormItem>
    <FormLabel>Preferred currency</FormLabel>
    <Select
      value={field.value ?? DEFAULT_CURRENCY}
      onValueChange={field.onChange}
    >
      <FormControl>
        <SelectTrigger
          ref={field.ref}
          onBlur={field.onBlur}
          className="w-full justify-between"
        >
          <SelectValue placeholder="Select a currency" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {supportedCurrencies.map((currency) => (
          <SelectItem key={currency} value={currency}>
            {currency}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <FormDescription>Used by reports and the dashboard.</FormDescription>
    <FormMessage />
  </FormItem>
);

const renderProductUpdates: UserFieldRender = ({ field }) => (
  <SwitchRow
    title="Product updates"
    description="Occasional emails about new features and improvements."
    checked={!!field.value}
    onCheckedChange={field.onChange}
  />
);

const renderMarketing: UserFieldRender = ({ field }) => (
  <SwitchRow
    title="Marketing emails"
    description="Tips, financial guides and seasonal offers. Opt-in only."
    checked={!!field.value}
    onCheckedChange={field.onChange}
  />
);

const renderTerms: UserFieldRender = ({ field, fieldState }) => (
  <ConsentRow
    checked={!!field.value}
    onCheckedChange={field.onChange}
    error={fieldState.error?.message}
    title={
      <>
        I accept the{" "}
        <Link
          to="/terms"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Terms &amp; Conditions
        </Link>
      </>
    }
    description="You agree to abide by the rules that govern the service."
  />
);

const renderPrivacy: UserFieldRender = ({ field, fieldState }) => (
  <ConsentRow
    checked={!!field.value}
    onCheckedChange={field.onChange}
    error={fieldState.error?.message}
    title={
      <>
        I have read the{" "}
        <Link
          to="/privacy"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Privacy Policy
        </Link>
      </>
    }
    description="You acknowledge how Monfly handles your personal data."
  />
);

interface UserFormFieldsProps {
  form: UseFormReturn<UserFormValues>;
  onBalanceBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onUpdateBalance?: () => void | Promise<void>;
  updatingBalance?: boolean;
}

export function UserFormFields({
  form,
  onBalanceBlur,
  onUpdateBalance,
  updatingBalance = false,
}: UserFormFieldsProps) {
  return (
    <div className="divide-y divide-border/60">
      <FormSection
        icon={UserIcon}
        title="Account details"
        description="The information shown across your dashboard."
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name={userFormNames.email}
            render={renderEmail}
          />

          <FormField
            control={form.control}
            name={userFormNames.name}
            render={renderName}
          />

          <FormField
            control={form.control}
            name={userFormNames.preferredCurrency}
            render={renderCurrency}
          />
        </div>
      </FormSection>

      <FormSection
        icon={WalletIcon}
        title="Financial settings"
        description="Configure how Monfly displays your balance."
      >
        <FormField
          control={form.control}
          name={userFormNames.totalBalance}
          render={({ field }) => (
            <FormItem className="max-w-md">
              <FormLabel>Total balance</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <div className="flex h-11 w-full overflow-hidden rounded-md border border-input bg-background shadow-xs focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30">
                    <span className="inline-flex w-10 shrink-0 items-center justify-center border-input border-e text-muted-foreground text-sm">
                      $
                    </span>
                    <Input
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*[.,]?[0-9]*"
                      placeholder="0.00"
                      className="h-full rounded-none border-0 px-3 tabular-nums shadow-none focus-visible:ring-0"
                      {...field}
                      value={field.value ?? ""}
                      onBlur={(e) => {
                        field.onBlur();
                        onBalanceBlur(e);
                      }}
                    />
                    <span className="inline-flex items-center border-input border-s bg-muted/30 px-3 font-medium text-muted-foreground text-sm">
                      {form.watch(userFormNames.preferredCurrency) ??
                        DEFAULT_CURRENCY}
                    </span>
                  </div>
                </FormControl>
                {onUpdateBalance ? (
                  <Button
                    type="button"
                    variant="default"
                    onClick={onUpdateBalance}
                    disabled={updatingBalance}
                    className="h-11 shrink-0"
                    aria-label="Update total balance"
                  >
                    {updatingBalance ? (
                      <LoaderIcon className="animate-spin" aria-hidden="true" />
                    ) : (
                      <CheckIcon aria-hidden="true" />
                    )}
                    <span className="hidden sm:inline">
                      {updatingBalance ? "Updating…" : "Update"}
                    </span>
                  </Button>
                ) : null}
              </div>
              <FormDescription>
                Sets your starting balance for new period summaries. Use
                “Update” to save just this value instantly.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>

      <FormSection
        icon={LockKeyholeIcon}
        title="Security"
        description="Manage your account password from a dedicated, secure page."
      >
        <ul className="divide-y divide-border/50">
          <ChangePasswordRow />
        </ul>
      </FormSection>

      <FormSection
        icon={BellRingIcon}
        title="Communication preferences"
        description="Decide how Monfly may contact you. You can change this anytime."
      >
        <ul className="divide-y divide-border/50">
          <FormField
            control={form.control}
            name={userFormNames.productUpdatesOptIn}
            render={renderProductUpdates}
          />
          <FormField
            control={form.control}
            name={userFormNames.marketingOptIn}
            render={renderMarketing}
          />
        </ul>
      </FormSection>

      <FormSection
        icon={ScaleIcon}
        title="Legal acknowledgements"
        description="Required to keep using Monfly. Read them anytime from your account."
      >
        <ul className="divide-y divide-border/50">
          <FormField
            control={form.control}
            name={userFormNames.acceptTerms}
            render={renderTerms}
          />
          <FormField
            control={form.control}
            name={userFormNames.acceptPrivacy}
            render={renderPrivacy}
          />
        </ul>
      </FormSection>
    </div>
  );
}

interface FormSectionProps {
  children: React.ReactNode;
  description: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
}

function FormSection({
  icon: Icon,
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <section className="grid gap-6 py-8 first:pt-0 last:pb-0 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] md:gap-10">
      <header className="flex items-start gap-3 md:sticky md:top-24 md:self-start">
        <span
          aria-hidden="true"
          className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/0 text-primary ring-1 ring-primary/15 after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-tr after:from-transparent after:to-foreground/5"
        >
          <Icon className="size-4" aria-hidden={true} />
        </span>
        <div className="min-w-0 space-y-1">
          <h4 className="font-[family-name:var(--font-syne)] font-semibold text-foreground text-sm tracking-tight sm:text-base">
            {title}
          </h4>
          <p className="text-muted-foreground text-xs leading-relaxed sm:text-[0.8rem]">
            {description}
          </p>
        </div>
      </header>
      <div className="min-w-0 space-y-4">{children}</div>
    </section>
  );
}

interface SwitchRowProps {
  checked: boolean;
  description: string;
  onCheckedChange: (checked: boolean) => void;
  title: string;
}

function SwitchRow({
  title,
  description,
  checked,
  onCheckedChange,
}: SwitchRowProps) {
  const id = useId();
  return (
    <FormItem className="flex flex-row items-center justify-between gap-4 px-0 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0 space-y-0.5">
        <FormLabel htmlFor={id} className="font-medium text-sm">
          {title}
        </FormLabel>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <FormControl>
        <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
      </FormControl>
    </FormItem>
  );
}
