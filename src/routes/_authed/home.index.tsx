import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import Charts from "~/components/charts";
import TotalBalance from "~/components/total-balance";
import TransactionsList from "~/components/transactions/list";
import { Skeleton } from "~/components/ui/skeleton";
import { useRouteUser } from "~/hooks/use-route-user";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email.server";
import { queryDictionary } from "~/queries/dictionary";

export const Route = createFileRoute("/_authed/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  const userEmail = useRouteUser();

  const { data, isPending, error } = useQuery({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
  });

  if (error) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <section>
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium">
            Welcome back
            {isPending ? (
              <Skeleton className="w-20 h-4" />
            ) : (
              <span className="capitalize">, {data?.data?.name}!</span>
            )}
          </h1>
          <span className="opacity-50">This is your overview dashboard</span>
        </div>
      </header>
      <section className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="space-y-4">
            <TotalBalance />
            <Charts />
          </div>
          <div className="col-span-2">
            <TransactionsList />
          </div>
        </div>
      </section>
    </section>
  );
}
