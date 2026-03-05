import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { userFormNames } from "~/constants/forms/user-form-names";
import { userFormSchema } from "~/zod-schemas/user-schema";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormFieldsProps {
  form: UseFormReturn<UserFormValues>;
  onBalanceBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export function UserFormFields({ form, onBalanceBlur }: UserFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 items-start gap-5 sm:gap-6 md:grid-cols-2">
      <FormField
        control={form.control}
        name={userFormNames.email}
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                inputMode="email"
                placeholder="you@email.com"
                readOnly
                aria-readonly="true"
                className="h-11 bg-muted/40 opacity-90"
                {...field}
              />
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
            <FormDescription>This is your public display name.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={userFormNames.password}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                autoComplete="new-password"
                placeholder="Leave blank to keep current password"
                className="h-11"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Use at least 6 characters for a new password.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={userFormNames.totalBalance}
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Total Balance</FormLabel>
            <FormControl>
              <div className="flex h-11 w-full overflow-hidden rounded-md border border-input bg-background shadow-xs">
                <span className="inline-flex w-10 shrink-0 items-center justify-center border-e border-input text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*[.,]?[0-9]*"
                  placeholder="0.00"
                  className="h-full rounded-none border-0 px-3 shadow-none tabular-nums focus-visible:ring-0"
                  {...field}
                  onBlur={(e) => {
                    field.onBlur();
                    onBalanceBlur(e);
                  }}
                />
                <span className="inline-flex items-center border-s border-input bg-muted/30 px-3 text-sm text-muted-foreground">
                  MXN
                </span>
              </div>
            </FormControl>
            <FormDescription>Current balance (MXN).</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
