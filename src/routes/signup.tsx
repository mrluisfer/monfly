import { zodResolver } from "@hookform/resolvers/zod";
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Auth, authActions } from "~/components/auth";
import { ExternalLogin } from "~/components/auth/external-login";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { useMutation } from "~/hooks/use-mutation";
import { signupFn } from "~/utils/auth/signupfn";
import { getUserSession } from "~/utils/user/get-user-session";
import {
  ArrowLeft,
  BadgeCheck,
  ChartNoAxesCombined,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  name: z.string().min(3, "Name must be at least 3 characters."),
});

type SignupFormValues = z.infer<typeof signupSchema>;

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
  beforeLoad: async () => {
    const { data: userEmail } = await getUserSession();

    if (userEmail) {
      throw redirect({
        to: "/home",
      });
    }
  },
});

function Signup() {
  const navigate = useNavigate();
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
        redirectUrl: "/home",
      },
    });

    if (signupMutationData?.success) {
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
    },
  });

  return (
    <div className="landing-shell relative min-h-dvh overflow-x-clip">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-44 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--landing-aurora)_0%,transparent_72%)] opacity-60 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-28 hidden h-80 w-80 rounded-full bg-[radial-gradient(circle,#14b8a6_0%,transparent_74%)] opacity-20 blur-2xl sm:block"
      />

      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 pb-6 pt-4 sm:px-6 sm:pb-8 sm:pt-6">
        <header className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
          <Button
            variant="ghost"
            size="lg"
            className="rounded-full"
            render={
              <Link to="/" className="inline-flex items-center gap-1.5">
                <ArrowLeft className="size-4" />
                Back to home
              </Link>
            }
          />
          <Button
            variant="outline"
            size="lg"
            className="rounded-full"
            render={<Link to="/login">I already have an account</Link>}
          />
        </header>

        <div className="grid flex-1 items-stretch gap-5 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-6">
          <section className="landing-glass-panel order-2 hidden rounded-3xl border border-border/60 p-6 lg:flex lg:flex-col lg:justify-between xl:p-8">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/6 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                <Sparkles className="size-3.5" />
                Build Your Money System
              </p>
              <h2 className="mt-5 text-balance text-3xl font-semibold leading-tight xl:text-4xl">
                Start with a faster onboarding flow that works on every screen.
              </h2>
              <p className="mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
                Create your account and move from scattered expenses to a single
                operating dashboard.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <dl className="grid gap-3 sm:grid-cols-3">
                {signupStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-border/60 bg-background/80 p-3"
                  >
                    <dt className="text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">
                      {stat.label}
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-foreground">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <ul className="space-y-2">
                {signupHighlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
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
          </section>

          <section className="order-1 flex items-start sm:items-center">
            <div className="w-full rounded-3xl border border-border/70 bg-background/90 p-5 shadow-[0_18px_38px_-32px_rgba(15,23,42,0.55)] sm:p-8">
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/6 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-primary">
                <BadgeCheck className="size-3.5" />
                Create Account
              </p>
              <h1 className="mt-4 text-balance text-2xl font-bold leading-tight sm:text-3xl">
                Launch your personal finance workspace
              </h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                It takes less than a minute to set up your account and start
                tracking.
              </p>

              <div className="mt-6">
                <ExternalLogin label="Sign up with Google" />
              </div>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
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
                    <p className="text-sm text-destructive" role="alert">
                      {signupMutation.data?.message ||
                        "An error occurred. Please try again."}
                    </p>
                  ) : null
                }
              />
            </div>
          </section>

          <section className="order-3 rounded-2xl border border-border/60 bg-background/80 p-4 lg:hidden">
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-primary">
              What you get
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
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
