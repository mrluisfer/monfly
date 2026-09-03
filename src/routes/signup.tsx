import { zodResolver } from "@hookform/resolvers/zod";
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  BadgeCheck,
  ChartNoAxesCombined,
  ShieldCheck,
  Sparkles,
  UserIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { SharedHeader } from "@/components/auth/SharedHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Auth, authActions } from "~/components/auth";
import { ExternalLogin } from "~/components/auth/ExternalLogin";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { useMutation } from "~/hooks/useMutation";
import { signupFn } from "~/server/auth/signupfn";
import {
  type SignupFormValues,
  signupSchema,
} from "~/zod-schemas/signup-schema";

const signupStats = [
  { label: "Time to start", value: "< 60s" },
  { label: "Setup flow", value: "Guided" },
  { label: "Mobile ready", value: "100%" },
];

const signupHighlights = [
  "Create personalized budgets aligned with your goals",
  "Monitor spending behavior with clean visual analytics",
  "Keep all your core money workflows in one dashboard",
];

export const Route = createFileRoute("/signup")({
  beforeLoad: ({ context }) => {
    if (context.userEmail) {
      throw redirect({
        to: "/home",
      });
    }
  },
  head: () => ({
    title: "Sign Up | Monfly",
    meta: [
      {
        name: "description",
        content:
          "Create your Monfly account and start tracking budgets, expenses, and financial goals from any device.",
      },
      {
        name: "robots",
        content: "noindex, nofollow",
      },
    ],
  }),
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const router = useRouter();
  const signupServerFn = useServerFn(signupFn);

  const signupMutation = useMutation({
    fn: signupServerFn,
  });

  const onSubmit = async (data: SignupFormValues) => {
    const signupMutationData = await signupMutation.mutate({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        acceptTerms: data.acceptTerms,
        acceptPrivacy: data.acceptPrivacy,
        redirectUrl: "/home",
      },
    });

    if (signupMutationData?.success) {
      // Re-read the new session cookie into the router context before landing
      // on a protected route.
      await router.invalidate();
      await navigate({
        to: "/home",
      });
    }
  };

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      acceptTerms: false,
      acceptPrivacy: false,
    },
  });

  return (
    <div className="landing-shell relative min-h-dvh overflow-x-clip">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-44 left-1/2 size-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--landing-aurora)_0%,transparent_72%)] opacity-52 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-28 -left-24 hidden size-80 rounded-full bg-[radial-gradient(circle,#0f766e_0%,transparent_74%)] opacity-20 blur-2xl sm:block"
      />

      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 pt-4 pb-6 sm:px-6 sm:pt-6 sm:pb-8">
        <SharedHeader>
          <Button
            render={
              <Link to="/login">
                <UserIcon />
                Already have an account
              </Link>
            }
          />
        </SharedHeader>

        <div className="grid flex-1 items-stretch gap-5 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-6">
          <Card className="order-2 h-fit">
            <CardContent>
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 font-semibold text-primary text-xs uppercase tracking-[0.12em]">
                  <Sparkles className="size-3.5" />
                  Build Your Money System
                </p>
                <h2 className="mt-5 text-balance font-[family-name:var(--font-syne)] font-semibold text-3xl leading-tight xl:text-4xl">
                  Start with a faster onboarding flow that works on every
                  screen.
                </h2>
                <p className="mt-3 max-w-lg text-muted-foreground text-sm sm:text-base">
                  Create your account and move from scattered expenses to a
                  single operating dashboard.
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <dl className="grid gap-3 sm:grid-cols-3">
                  {signupStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-border/65 bg-background/80 p-3"
                    >
                      <dt className="text-[0.68rem] text-muted-foreground uppercase tracking-[0.12em]">
                        {stat.label}
                      </dt>
                      <dd className="mt-1 font-semibold text-foreground text-lg">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <ul className="space-y-2">
                  {signupHighlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-muted-foreground text-sm"
                    >
                      <ChartNoAxesCombined className="mt-0.5 size-4 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Badge variant="default" className="w-fit">
                  <ShieldCheck className="size-4" />
                  Built for personal and educational finance planning
                </Badge>
              </div>
            </CardContent>
          </Card>

          <section className="order-1 flex items-start sm:items-center">
            <div className="landing-glass-panel w-full rounded-3xl border border-border/70 p-5 shadow-[0_18px_38px_-32px_rgba(15,23,42,0.55)] sm:p-8">
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 font-semibold text-primary text-xs uppercase tracking-[0.1em]">
                <BadgeCheck className="size-3.5" />
                Create Account
              </p>
              <h1 className="mt-4 text-balance font-[family-name:var(--font-syne)] font-bold text-2xl leading-tight sm:text-3xl">
                Launch your personal finance workspace
              </h1>
              <p className="mt-2 text-muted-foreground text-sm sm:text-base">
                It takes less than a minute to set up your account and start
                tracking.
              </p>

              <div className="mt-6">
                <ExternalLogin label="Sign up with Google" />
              </div>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-muted-foreground text-xs uppercase tracking-[0.08em]">
                  or continue with email
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <Auth<SignupFormValues>
                form={form}
                actionText={authActions.signup}
                status={signupMutation.status}
                onSubmit={onSubmit}
                withCard={false}
                showActionTitle={false}
                afterSubmit={
                  signupMutation.error ? (
                    <p className="text-destructive text-sm" role="alert">
                      {signupMutation.data?.message ||
                        "An error occurred. Please try again."}
                    </p>
                  ) : null
                }
              />
            </div>
          </section>

          <section className="landing-glass-panel order-3 rounded-2xl border border-border/65 p-4 lg:hidden">
            <h2 className="font-semibold text-primary text-sm uppercase tracking-[0.08em]">
              What you get
            </h2>
            <ul className="mt-3 space-y-2 text-muted-foreground text-sm">
              {signupHighlights.slice(0, 2).map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <ChartNoAxesCombined className="mt-0.5 size-4 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
