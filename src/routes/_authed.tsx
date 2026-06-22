import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { DefaultCatchBoundary } from "~/components/shared/DefaultCatchBoundary";
import Layout from "~/components/shared/Layout";
import { Spinner } from "~/components/ui/spinner";

export const Route = createFileRoute("/_authed")({
  // The root route already resolved (and DB-validated) the session into the
  // router context, so we just gate on it here — no extra server round-trip.
  beforeLoad: ({ context }) => {
    if (!context.userEmail) {
      throw redirect({
        to: "/login",
      });
    }

    return { user: context.userEmail };
  },
  errorComponent: (props) => <DefaultCatchBoundary {...props} />,
  pendingComponent: AuthPending,
  component: () => {
    return (
      <Layout>
        <Outlet />
      </Layout>
    );
  },
});

function AuthPending() {
  return (
    <div
      role="status"
      aria-label="Verifying your session"
      className="flex min-h-dvh w-full flex-col items-center justify-center gap-3"
    >
      <Spinner className="size-7 text-muted-foreground" />
      <p className="text-muted-foreground text-sm">Verifying your session…</p>
    </div>
  );
}
