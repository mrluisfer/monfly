import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { DefaultCatchBoundary } from "~/components/shared/DefaultCatchBoundary";
import Layout from "~/components/shared/Layout";
import { getUserSession } from "~/server/db/users/get-user-session";

export const Route = createFileRoute("/_authed")({
  beforeLoad: async () => {
    const session = await getUserSession();
    if (!session.success || !session.data) {
      throw redirect({
        to: "/login",
      });
    }

    return { user: session.data };
  },
  errorComponent: (props) => <DefaultCatchBoundary {...props} />,
  component: () => {
    return (
      <Layout>
        <Outlet />
      </Layout>
    );
  },
});
