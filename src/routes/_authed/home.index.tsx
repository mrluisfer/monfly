import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import Charts from "~/components/charts";
import { PageTitle } from "~/components/page-title";
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
    <div>
      <header className="mb-6 flex justify-between items-center">
        <PageTitle description="This is your overview dashboard">
          Welcome back
          {isPending ? (
            <Skeleton className="w-20 h-4" />
          ) : (
            <span className="capitalize">, {data?.data?.name}!</span>
          )}
        </PageTitle>
      </header>
      <section className="flex flex-col gap-4">
        <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="order-2 space-y-4 xl:order-1 items-start justify-between w-full grid grid-cols-2 gap-4">
            <TotalBalance />
            <Charts />
          </div>

          <div className="order-1 md:order-2 md:col-span-2 xl:col-span-2">
            <TransactionsList />
          </div>
        </div>
      </section>
    </div>
  );
}
