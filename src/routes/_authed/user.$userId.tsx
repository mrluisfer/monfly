import { createFileRoute, notFound } from "@tanstack/react-router";
import { UserProfilePage } from "~/components/user/UserProfilePage";
import { getUserByIdServer } from "~/lib/api/user/get-user-by-id";
import { z } from "zod";

export const Route = createFileRoute("/_authed/user/$userId")({
  component: RouteComponent,
  params: z.object({ userId: z.string() }),
  loader: async ({ params: { userId } }) => {
    const res = await getUserByIdServer({ data: { userId } });
    const user = res?.data;
    if (!user) {
      throw notFound();
    }
    return { userId, user };
  },
});

function RouteComponent() {
  const { userId, user } = Route.useLoaderData();
  return <UserProfilePage userId={userId} user={user} />;
}
