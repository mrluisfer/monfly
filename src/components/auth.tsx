import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

import Card from "./card";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const actions = {
  login: "Login",
  signup: "Sign Up",
};

type ActionText = (typeof actions)[keyof typeof actions];

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
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input id="email" className="px-2 py-1" {...field} />
                </FormControl>
                <FormDescription>
                  This is your email address. We will send you a confirmation
                  email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <Input type="password" className="px-2 py-1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {actionText === actions.signup && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Username</FormLabel>
                  <FormControl>
                    <Input className="px-2 py-1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
              <span className="text-center text-muted-foreground">
                {actionText === actions.login
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </span>
              <Button asChild variant="ghost">
                <Link
                  to={actionText === actions.login ? "/signup" : "/login"}
                  type="button"
                >
                  {actionText === actions.login ? "Sign up" : "Login"}
                </Link>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </Element>
  );
}
