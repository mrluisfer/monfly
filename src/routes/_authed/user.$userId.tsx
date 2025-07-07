import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import Card from "~/components/card";
import { getUserByIdServer } from "~/lib/api/user/get-user-by-id.server";
import { queryDictionary } from "~/queries/dictionary";
import { z } from "zod";

export const Route = createFileRoute("/_authed/user/$userId")({
  component: RouteComponent,
  params: z.object({
    userId: z.string(),
  }),
  loader: async ({ params: { userId } }) => {
    return {
      userId,
    };
  },
});

function RouteComponent() {
  const loaderData = Route.useLoaderData();

  const { data, error, isLoading } = useQuery({
    queryKey: [queryDictionary.user, loaderData.userId],
    queryFn: () => getUserByIdServer({ data: { userId: loaderData.userId } }),
    enabled: !!loaderData.userId,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Card
      title="Update User"
      className="container mx-auto"
      subtitle="Manage your account and profile information."
    >
      <div></div>
    </Card>
  );
}
