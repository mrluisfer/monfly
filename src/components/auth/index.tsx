import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { UseFormReturn } from "react-hook-form";
import { cn } from "~/lib/utils";

import Card from "../card";
import { Button } from "../ui/button";
import { Form, FormField } from "../ui/form";
import ComplexPasswordInput from "./complex-password-input";
import EmailInput from "./email-input";
import { SimplePasswordInput } from "./simple-password-input";
import UsernameInput from "./username-input";

export enum authActions {
  login = "Login",
  signup = "Sign Up",
}

type ActionText = (typeof authActions)[keyof typeof authActions];

type BaseAuthValues = {
  email: string;
  password: string;
  name?: string;
};

type AuthProps<TFormValues extends BaseAuthValues> = {
  actionText: ActionText;
  onSubmit: (data: TFormValues) => void | Promise<void>;
  status: "pending" | "idle" | "success" | "error";
  afterSubmit?: ReactNode;
  form: UseFormReturn<TFormValues>;
  withCard?: boolean;
  showActionTitle?: boolean;
  className?: string;
};

export function Auth<TFormValues extends BaseAuthValues>({
  actionText,
  onSubmit,
  status,
  afterSubmit,
  form,
  withCard = true,
  showActionTitle = true,
  className,
}: AuthProps<TFormValues>) {
  const shouldShowSignupFields = actionText === authActions.signup;

  const formBody = (
    <>
      {showActionTitle ? (
        <h1 className="mb-4 w-full text-center text-2xl font-bold">
          {actionText}
        </h1>
      ) : null}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => <EmailInput field={field} />}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) =>
              shouldShowSignupFields ? (
                <ComplexPasswordInput field={field} />
              ) : (
                <SimplePasswordInput field={field} />
              )
            }
          />

          {shouldShowSignupFields && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => <UsernameInput field={field} />}
            />
          )}
          <Button
            type="submit"
            className="h-11 w-full font-semibold uppercase tracking-[0.08em]"
            disabled={status === "pending"}
            size="lg"
            variant="default"
          >
            {status === "pending" ? "Please wait..." : actionText}
          </Button>
          {afterSubmit ? afterSubmit : null}
          <p className="pt-2 text-center text-sm text-muted-foreground">
            {actionText === authActions.login
              ? "Don't have an account?"
              : "Already have an account?"}
            <Link
              to={actionText === authActions.login ? "/signup" : "/login"}
              className="ml-1 font-medium text-primary underline-offset-4 hover:underline"
            >
              {actionText === authActions.login ? "Sign up" : "Log in"}
            </Link>
          </p>
        </form>
      </Form>
    </>
  );

  if (withCard) {
    return <Card className={cn("h-fit", className)}>{formBody}</Card>;
  }

  return <div className={className}>{formBody}</div>;
}
