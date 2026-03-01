import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

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

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type AuthProps<T extends z.ZodType<any, any, any>> = {
  actionText: ActionText;
  onSubmit: (data: z.infer<T>) => void;
  status: "pending" | "idle" | "success" | "error";
  afterSubmit?: ReactNode;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  form: UseFormReturn<any>;
  withCard?: boolean;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function Auth<T extends z.ZodType<any, any, any>>({
  actionText,
  onSubmit,
  status,
  afterSubmit,
  form,
  withCard = true,
}: AuthProps<T>) {
  const Element = withCard ? Card : "div";

  return (
    <Element>
      <h1 className="text-2xl font-bold mb-4 w-full text-center">
        {actionText}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => <EmailInput field={field} />}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) =>
              actionText === authActions.signup ? (
                <ComplexPasswordInput field={field} />
              ) : (
                <SimplePasswordInput field={field} />
              )
            }
          />

          {actionText === authActions.signup && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => <UsernameInput field={field} />}
            />
          )}
          <Button
            type="submit"
            className="w-full font-black uppercase"
            disabled={status === "pending"}
            size="lg"
            variant="default"
          >
            {status === "pending" ? "..." : actionText}
          </Button>
          {afterSubmit ? afterSubmit : null}
          <div className="flex justify-center">
            <div className="text-xs mt-4 flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                render={
                  <Link
                    to={actionText === authActions.login ? "/signup" : "/login"}
                    type="button"
                  >
                    {actionText === authActions.login
                      ? "Don't have an account?"
                      : "Already have an account?"}
                  </Link>
                }
              />
            </div>
          </div>
        </form>
      </Form>
    </Element>
  );
}
