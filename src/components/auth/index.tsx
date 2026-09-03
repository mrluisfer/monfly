import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { Path, UseFormReturn } from "react-hook-form";
import { cn } from "~/lib/utils";
import type { FieldRenderProps } from "~/types/form";

import Card from "../shared/Card";
import { ConsentRow } from "../shared/ConsentRow";
import { Button } from "../ui/button";
import { Form, FormField } from "../ui/form";
import ComplexPasswordInput from "./ComplexPasswordInput";
import EmailInput from "./EmailInput";
import { SimplePasswordInput } from "./SimplePasswordInput";
import UsernameInput from "./UsernameInput";

export enum authActions {
  login = "Login",
  signup = "Sign Up",
}

type ActionText = (typeof authActions)[keyof typeof authActions];

interface BaseAuthValues {
  acceptPrivacy?: boolean;
  acceptTerms?: boolean;
  email: string;
  name?: string;
  password: string;
}

interface AuthProps<TFormValues extends BaseAuthValues> {
  actionText: ActionText;
  afterSubmit?: ReactNode;
  className?: string;
  form: UseFormReturn<TFormValues>;
  onSubmit: (data: TFormValues) => void | Promise<void>;
  showActionTitle?: boolean;
  status: "pending" | "idle" | "success" | "error";
  withCard?: boolean;
}

const inlineLinkClassName =
  "font-medium text-primary underline-offset-4 hover:underline";

/* ────────────────────────────────────────────────────────────────────────
   Field renderers
   None of these read anything from `Auth`'s props, so they live at module
   scope: created once for the module instead of once per keystroke, with no
   `useCallback` and no dependency array to keep honest.
   ──────────────────────────────────────────────────────────────────────── */

function renderUsername<TFormValues extends BaseAuthValues>({
  field,
}: FieldRenderProps<TFormValues>) {
  return <UsernameInput field={field} />;
}

function renderEmail<TFormValues extends BaseAuthValues>({
  field,
}: FieldRenderProps<TFormValues>) {
  return <EmailInput field={field} />;
}

function renderComplexPassword<TFormValues extends BaseAuthValues>({
  field,
}: FieldRenderProps<TFormValues>) {
  return <ComplexPasswordInput field={field} />;
}

function renderSimplePassword<TFormValues extends BaseAuthValues>({
  field,
}: FieldRenderProps<TFormValues>) {
  return <SimplePasswordInput field={field} />;
}

// The consent titles never change, so they are values, not renders.
const termsTitle = (
  <>
    I accept the{" "}
    <Link to="/terms" target="_blank" className={inlineLinkClassName}>
      Terms &amp; Conditions
    </Link>
    .
  </>
);

const privacyTitle = (
  <>
    I have read the{" "}
    <Link to="/privacy" target="_blank" className={inlineLinkClassName}>
      Privacy Policy
    </Link>
    .
  </>
);

function renderTermsConsent<TFormValues extends BaseAuthValues>({
  field,
  fieldState,
}: FieldRenderProps<TFormValues>) {
  return (
    <ConsentRow
      checked={Boolean(field.value)}
      onCheckedChange={field.onChange}
      error={fieldState.error?.message}
      title={termsTitle}
      description="You agree to abide by the rules that govern the service."
    />
  );
}

function renderPrivacyConsent<TFormValues extends BaseAuthValues>({
  field,
  fieldState,
}: FieldRenderProps<TFormValues>) {
  return (
    <ConsentRow
      checked={Boolean(field.value)}
      onCheckedChange={field.onChange}
      error={fieldState.error?.message}
      title={privacyTitle}
      description="You acknowledge how Monfly handles your personal data."
    />
  );
}

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
  const isLogin = actionText === authActions.login;
  const handleSubmit = form.handleSubmit(onSubmit);
  // Hoisted: a bare `a ? b : c` between two strings reads as a leaked render.
  const submitLabel = status === "pending" ? "Please wait..." : actionText;

  const formBody = (
    <>
      {showActionTitle ? (
        <h1 className="mb-4 w-full text-center font-bold text-2xl">
          {actionText}
        </h1>
      ) : null}
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {shouldShowSignupFields && (
            <FormField
              control={form.control}
              name={"name" as Path<TFormValues>}
              render={renderUsername}
            />
          )}

          <FormField
            control={form.control}
            name={"email" as Path<TFormValues>}
            render={renderEmail}
          />

          {/* Signup asks for a new password and coaches on its strength;
              login only has to take one back. Picking between two stable
              renderers keeps the branch out of the JSX prop. */}
          <FormField
            control={form.control}
            name={"password" as Path<TFormValues>}
            render={
              shouldShowSignupFields
                ? renderComplexPassword
                : renderSimplePassword
            }
          />

          {shouldShowSignupFields && (
            <ul className="space-y-2 divide-y divide-border/50">
              <FormField
                control={form.control}
                name={"acceptTerms" as Path<TFormValues>}
                render={renderTermsConsent}
              />
              <FormField
                control={form.control}
                name={"acceptPrivacy" as Path<TFormValues>}
                render={renderPrivacyConsent}
              />
            </ul>
          )}

          <Button
            type="submit"
            className="h-11 w-full font-semibold uppercase tracking-[0.08em]"
            disabled={status === "pending"}
            size="lg"
            variant="default"
          >
            {submitLabel}
          </Button>
          {afterSubmit ?? null}
          <p className="pt-2 text-center text-muted-foreground text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <Link
              to={isLogin ? "/signup" : "/login"}
              className={cn("ml-1", inlineLinkClassName)}
            >
              {isLogin ? "Sign up" : "Log in"}
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
