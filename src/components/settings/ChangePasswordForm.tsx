import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  KeyRoundIcon,
  XIcon,
} from "lucide-react";
import { useId, useMemo, useState } from "react";
import type {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { changePasswordFormNames } from "@/constants/forms/user-form-names";
import { useMutation } from "@/hooks/useMutation";
import { changePasswordServer } from "@/lib/api/user/change-password";
import { sileo } from "@/lib/toaster";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/zod-schemas/user-schema";

const passwordRequirements = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /[0-9]/, text: "At least 1 number" },
  { regex: /[a-z]/, text: "At least 1 lowercase letter" },
  { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
];

type PasswordFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  field: ControllerRenderProps<TFieldValues, TName>;
  label: string;
  placeholder: string;
  autoComplete: string;
};

function PasswordField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  field,
  label,
  placeholder,
  autoComplete,
}: PasswordFieldProps<TFieldValues, TName>) {
  const id = useId();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <FormItem className="space-y-2">
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <FormControl>
        <div className="relative">
          <Input
            id={id}
            className="h-11 pe-9"
            type={isVisible ? "text" : "password"}
            placeholder={placeholder}
            autoComplete={autoComplete}
            {...field}
          />
          <button
            type="button"
            onClick={() => setIsVisible((prev) => !prev)}
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
            aria-controls={id}
            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px]"
          >
            {isVisible ? (
              <EyeOffIcon size={16} aria-hidden="true" />
            ) : (
              <EyeIcon size={16} aria-hidden="true" />
            )}
          </button>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

export function ChangePasswordForm() {
  const navigate = useNavigate();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      [changePasswordFormNames.currentPassword]: "",
      [changePasswordFormNames.newPassword]: "",
      [changePasswordFormNames.confirmNewPassword]: "",
    },
  });

  const newPassword = useWatch({
    control: form.control,
    name: changePasswordFormNames.newPassword,
  });

  const requirements = useMemo(
    () =>
      passwordRequirements.map((req) => ({
        met: req.regex.test(newPassword || ""),
        text: req.text,
      })),
    [newPassword],
  );

  const changePasswordMutation = useMutation({
    fn: changePasswordServer,
    onSuccess: async ({ data }) => {
      if (data?.error) {
        sileo.error({ title: data.message });
        return;
      }

      sileo.success({ title: data?.message ?? "Password updated" });
      form.reset();
      await navigate({ to: "/user/settings" });
    },
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    await changePasswordMutation.mutate({
      data: {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
    });
  };

  const isPending = changePasswordMutation.status === "pending";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
      >
        <FormField
          control={form.control}
          name={changePasswordFormNames.currentPassword}
          render={({ field }) => (
            <PasswordField
              field={field}
              label="Current password"
              placeholder="Enter your current password"
              autoComplete="current-password"
            />
          )}
        />

        <FormField
          control={form.control}
          name={changePasswordFormNames.newPassword}
          render={({ field }) => (
            <PasswordField
              field={field}
              label="New password"
              placeholder="Choose a new password"
              autoComplete="new-password"
            />
          )}
        />

        <ul className="space-y-1.5" aria-label="Password requirements">
          {requirements.map((req) => (
            <li key={req.text} className="flex items-center gap-2">
              {req.met ? (
                <CheckIcon
                  size={16}
                  className="text-emerald-500"
                  aria-hidden="true"
                />
              ) : (
                <XIcon
                  size={16}
                  className="text-muted-foreground/80"
                  aria-hidden="true"
                />
              )}
              <span
                className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}
              >
                {req.text}
              </span>
            </li>
          ))}
        </ul>

        <FormField
          control={form.control}
          name={changePasswordFormNames.confirmNewPassword}
          render={({ field }) => (
            <PasswordField
              field={field}
              label="Confirm new password"
              placeholder="Repeat your new password"
              autoComplete="new-password"
            />
          )}
        />

        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="w-full font-semibold tracking-[0.04em] uppercase sm:w-auto"
        >
          <KeyRoundIcon aria-hidden="true" />
          {isPending ? "Updating..." : "Update password"}
        </Button>
      </form>
    </Form>
  );
}
