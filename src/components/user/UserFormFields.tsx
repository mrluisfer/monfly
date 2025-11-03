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
import { UseFormReturn } from "react-hook-form";

interface UserFormFieldsProps {
  form: UseFormReturn<any>;
  onBalanceBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export function UserFormFields({ form, onBalanceBlur }: UserFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-start">
      <FormField
        control={form.control}
        name={userFormNames.email}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                inputMode="email"
                placeholder="you@email.com"
                readOnly
                aria-readonly="true"
                className="opacity-80"
                {...field}
              />
            </FormControl>
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
              <Input placeholder="Your name" autoComplete="name" {...field} />
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
                placeholder="New password"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Be sure to choose a strong password.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={userFormNames.totalBalance}
        render={({ field }) => (
          <FormItem className="*:not-first:mt-2">
            <FormLabel>Total Balance</FormLabel>
            <FormControl>
              <div className="relative flex rounded-md shadow-xs">
                <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*[.,]?[0-9]*"
                  placeholder="0.00"
                  className="-me-px rounded-e-none ps-6 shadow-none tabular-nums z-10"
                  {...field}
                  onBlur={(e) => {
                    field.onBlur();
                    onBalanceBlur(e);
                  }}
                />
                <span className="inline-flex items-center rounded-e-md border border-input bg-background px-3 text-sm text-muted-foreground">
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
