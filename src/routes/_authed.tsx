import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import Layout from "~/components/Layout";
import { getUserSession } from "~/utils/user/get-user-session";

export const Route = createFileRoute("/_authed")({
  beforeLoad: async () => {
    const { data: userEmail } = await getUserSession();
    if (!userEmail) {
      // This means the user is not authenticated
      throw redirect({
        to: "/login",
      });
    }

    return { user: userEmail };
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
