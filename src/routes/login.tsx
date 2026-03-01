import { zodResolver } from "@hookform/resolvers/zod";
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { Auth, authActions } from "~/components/auth";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { useMutation } from "~/hooks/use-mutation";
import { loginFn } from "~/utils/auth/loginfn";
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

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const loginStats = [
  { label: "Secure sessions", value: "99.99%" },
  { label: "Monthly entries", value: "120K+" },
  { label: "Actionable insights", value: "24/7" },
];

const loginHighlights = [
  "Instant overview of spending and saving trends",
  "Fast navigation between transactions, reports, and goals",
  "Session protection with modern authentication flow",
];

export const Route = createFileRoute("/login")({
  head: () => ({
    title: "Login | Monfly",
    meta: [
      {
        name: "description",
        content:
          "Log in to Monfly and continue managing budgets, cashflow, and financial goals from one secure dashboard.",
      },
      {
        name: "robots",
        content: "noindex, nofollow",
      },
    ],
  }),
  component: Login,
  beforeLoad: async () => {
    const { data: userEmail } = await getUserSession();

    if (userEmail) {
      throw redirect({
        to: "/home",
      });
    }
  },
});

function Login() {
  const navigate = useNavigate();

  const loginMutation = useMutation({
    fn: loginFn,
    onSuccess: async ({ data }) => {
      if (!data?.error) {
        await navigate({
          to: "/home",
        });
      }
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await loginMutation.mutate({
      data: {
        email: data.email,
        password: data.password,
      },
    });
  };

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const shouldSuggestSignup = Boolean(loginMutation.data?.userNotFound);

  return (
    <div className="landing-shell relative min-h-dvh overflow-x-clip">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--landing-aurora)_0%,transparent_72%)] opacity-60 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-36 hidden h-80 w-80 rounded-full bg-[radial-gradient(circle,#22d3ee_0%,transparent_72%)] opacity-20 blur-2xl sm:block"
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
            render={<Link to="/signup">Create account</Link>}
          />
        </header>

        <div className="grid flex-1 items-stretch gap-5 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-6">
          <section className="landing-glass-panel order-2 hidden rounded-3xl border border-border/60 p-6 lg:flex lg:flex-col lg:justify-between xl:p-8">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/6 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                <Sparkles className="size-3.5" />
                Smart Money Control
              </p>
              <h2 className="mt-5 text-balance text-3xl font-semibold leading-tight xl:text-4xl">
                Keep your financial workflow focused and secure.
              </h2>
              <p className="mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
                Log in to continue tracking your expenses, income, and budget
                health with real-time clarity.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <dl className="grid gap-3 sm:grid-cols-3">
                {loginStats.map((stat) => (
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
                {loginHighlights.map((item) => (
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
                Protected by secure session management
              </Badge>
            </div>
          </section>

          <section className="order-1 flex items-start sm:items-center">
            <div className="w-full rounded-3xl border border-border/70 bg-background/90 p-5 shadow-[0_18px_38px_-32px_rgba(15,23,42,0.55)] sm:p-8">
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/6 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-primary">
                <BadgeCheck className="size-3.5" />
                Sign In
              </p>
              <h1 className="mt-4 text-balance text-2xl font-bold leading-tight sm:text-3xl">
                Access your Monfly workspace
              </h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Continue where you left off and keep your finances under
                control.
              </p>

              <div className="mt-7">
                <Auth<LoginFormValues>
                  form={form}
                  actionText={authActions.login}
                  status={loginMutation.status}
                  onSubmit={onSubmit}
                  withCard={false}
                  showActionTitle={false}
                  afterSubmit={
                    loginMutation.data ? (
                      <div className="space-y-2 text-sm" role="status">
                        <p
                          className={
                            loginMutation.data.error
                              ? "text-destructive"
                              : "text-emerald-600"
                          }
                        >
                          {loginMutation.data.message}
                        </p>
                        {shouldSuggestSignup ? (
                          <p className="text-muted-foreground">
                            This email is not registered yet. You can create an
                            account in under a minute.
                          </p>
                        ) : null}
                      </div>
                    ) : null
                  }
                />
              </div>
            </div>
          </section>

          <section className="order-3 rounded-2xl border border-border/60 bg-background/80 p-4 lg:hidden">
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-primary">
              Why Monfly
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {loginHighlights.slice(0, 2).map((item) => (
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
