import { Link } from "@tanstack/react-router";
import {
  BellRingIcon,
  EyeIcon,
  EyeOffIcon,
  LockKeyholeIcon,
  MailIcon,
  ScaleIcon,
  UserIcon,
  WalletIcon,
} from "lucide-react";
import { useId, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "~/components/ui/checkbox";
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
import { cn } from "~/lib/utils";
import { supportedCurrencies, userFormSchema } from "~/zod-schemas/user-schema";

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormFieldsProps {
  form: UseFormReturn<UserFormValues>;
  onBalanceBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export function UserFormFields({ form, onBalanceBlur }: UserFormFieldsProps) {
  return (
    <div className="divide-border/60 divide-y">
      <FormSection
        icon={UserIcon}
        title="Account details"
        description="The information shown across your dashboard."
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name={userFormNames.email}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MailIcon
                      className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                      aria-hidden="true"
                    />
                    <Input
                      type="email"
                      inputMode="email"
                      placeholder="you@email.com"
                      readOnly
                      aria-readonly="true"
                      className="bg-muted/40 h-11 pl-9 opacity-90"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  This is your sign-in email and cannot be changed here.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={userFormNames.name}
            render={({ field }) => (
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
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={userFormNames.preferredCurrency}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred currency</FormLabel>
                <Select
                  value={field.value ?? "MXN"}
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
                <FormDescription>
                  Used by reports and the dashboard.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
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
              <FormControl>
                <div className="border-input bg-background focus-within:border-ring focus-within:ring-ring/30 flex h-11 w-full overflow-hidden rounded-md border shadow-xs focus-within:ring-3">
                  <span className="border-input text-muted-foreground inline-flex w-10 shrink-0 items-center justify-center border-e text-sm">
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
                  <span className="border-input bg-muted/30 text-muted-foreground inline-flex items-center border-s px-3 text-sm font-medium">
                    {form.watch(userFormNames.preferredCurrency) ?? "MXN"}
                  </span>
                </div>
              </FormControl>
              <FormDescription>
                Sets your starting balance for new period summaries.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>

      <FormSection
        icon={LockKeyholeIcon}
        title="Security"
        description="Choose a strong password and confirm it. Leave blank to keep the current one."
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name={userFormNames.password}
            render={({ field }) => (
              <PasswordField
                label="New password"
                description="At least 8 characters."
                autoComplete="new-password"
                placeholder="Leave blank to keep current password"
                field={field}
              />
            )}
          />
          <FormField
            control={form.control}
            name={userFormNames.confirmPassword}
            render={({ field }) => (
              <PasswordField
                label="Confirm password"
                description="Must match the new password."
                autoComplete="new-password"
                placeholder="Repeat the new password"
                field={field}
              />
            )}
          />
        </div>
        <PasswordStrength value={form.watch(userFormNames.password) ?? ""} />
      </FormSection>

      <FormSection
        icon={BellRingIcon}
        title="Communication preferences"
        description="Decide how Monfly may contact you. You can change this anytime."
      >
        <ul className="divide-border/50 divide-y">
          <FormField
            control={form.control}
            name={userFormNames.productUpdatesOptIn}
            render={({ field }) => (
              <SwitchRow
                title="Product updates"
                description="Occasional emails about new features and improvements."
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <FormField
            control={form.control}
            name={userFormNames.marketingOptIn}
            render={({ field }) => (
              <SwitchRow
                title="Marketing emails"
                description="Tips, financial guides and seasonal offers. Opt-in only."
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </ul>
      </FormSection>

      <FormSection
        icon={ScaleIcon}
        title="Legal acknowledgements"
        description="Required to keep using Monfly. Read them anytime from your account."
      >
        <ul className="divide-border/50 divide-y">
          <FormField
            control={form.control}
            name={userFormNames.acceptTerms}
            render={({ field, fieldState }) => (
              <ConsentRow
                checked={!!field.value}
                onCheckedChange={field.onChange}
                error={fieldState.error?.message}
                title={
                  <>
                    I accept the{" "}
                    <Link
                      to="/terms"
                      className="text-primary font-medium underline-offset-4 hover:underline"
                    >
                      Terms &amp; Conditions
                    </Link>
                    .
                  </>
                }
                description="You agree to abide by the rules that govern the service."
              />
            )}
          />
          <FormField
            control={form.control}
            name={userFormNames.acceptPrivacy}
            render={({ field, fieldState }) => (
              <ConsentRow
                checked={!!field.value}
                onCheckedChange={field.onChange}
                error={fieldState.error?.message}
                title={
                  <>
                    I have read the{" "}
                    <Link
                      to="/privacy"
                      className="text-primary font-medium underline-offset-4 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </>
                }
                description="You acknowledge how Monfly handles your personal data."
              />
            )}
          />
        </ul>
      </FormSection>
    </div>
  );
}

type FormSectionProps = {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  description: string;
  children: React.ReactNode;
};

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
          className="from-primary/15 to-primary/0 text-primary ring-primary/15 after:to-foreground/5 relative inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ring-1 after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-tr after:from-transparent"
        >
          <Icon className="size-4" aria-hidden={true} />
        </span>
        <div className="min-w-0 space-y-1">
          <h4 className="text-foreground font-[family-name:var(--font-syne)] text-sm font-semibold tracking-tight sm:text-base">
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

type PasswordFieldProps = {
  label: string;
  description: string;
  placeholder: string;
  autoComplete: "new-password" | "current-password";
  field: {
    name: string;
    value?: string;
    onChange: (...args: unknown[]) => void;
    onBlur: () => void;
    ref?: React.Ref<HTMLInputElement>;
  };
};

function PasswordField({
  label,
  description,
  placeholder,
  autoComplete,
  field,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className="relative">
          <LockKeyholeIcon
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            type={visible ? "text" : "password"}
            autoComplete={autoComplete}
            placeholder={placeholder}
            className="h-11 px-9"
            {...field}
            value={field.value ?? ""}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring/40 absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {visible ? (
              <EyeOffIcon className="size-4" />
            ) : (
              <EyeIcon className="size-4" />
            )}
          </button>
        </div>
      </FormControl>
      <FormDescription>{description}</FormDescription>
      <FormMessage />
    </FormItem>
  );
}

function passwordStrength(value: string): {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
} {
  if (!value) return { score: 0, label: "—" };
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
  return { score: score as 0 | 1 | 2 | 3 | 4, label: labels[score] };
}

function PasswordStrength({ value }: { value: string }) {
  if (!value) return null;
  const { score, label } = passwordStrength(value);
  const segments = 4;
  const tone =
    score <= 1
      ? "bg-destructive"
      : score === 2
        ? "bg-amber-500"
        : score === 3
          ? "bg-emerald-500"
          : "bg-primary";
  return (
    <div className="flex items-center gap-3" aria-live="polite">
      <div className="flex flex-1 gap-1" role="presentation">
        {Array.from({ length: segments }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-300 motion-reduce:transition-none",
              i < score ? tone : "bg-foreground/10",
            )}
          />
        ))}
      </div>
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
    </div>
  );
}

type SwitchRowProps = {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

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
        <FormLabel htmlFor={id} className="text-sm font-medium">
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

type ConsentRowProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  title: React.ReactNode;
  description: string;
  error?: string;
};

function ConsentRow({
  checked,
  onCheckedChange,
  title,
  description,
  error,
}: ConsentRowProps) {
  const id = useId();
  return (
    <FormItem
      className={cn(
        "flex flex-row items-start gap-3 px-0 py-3 transition-colors first:pt-0 last:pb-0",
        error && "bg-destructive/5 rounded-lg px-3",
      )}
    >
      <FormControl>
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(value) => onCheckedChange(value === true)}
          aria-describedby={`${id}-desc`}
          className="mt-0.5"
        />
      </FormControl>
      <div className="min-w-0 space-y-0.5">
        <FormLabel htmlFor={id} className="text-sm font-medium">
          {title}
        </FormLabel>
        <p id={`${id}-desc`} className="text-muted-foreground text-xs">
          {description}
        </p>
        {error ? (
          <p className="text-destructive text-xs font-medium" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </FormItem>
  );
}
