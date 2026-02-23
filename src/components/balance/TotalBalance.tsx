import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { useMutation } from "~/hooks/use-mutation";
import { useRouteUser } from "~/hooks/use-route-user";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email.server";
import { putUserTotalBalanceServer } from "~/lib/api/user/put-user-total-balance.server";
import { queryDictionary } from "~/queries/dictionary";
import { formatToTwoDecimals } from "~/utils/formatTwoDecimals";
import { toast } from "sonner";

const TotalBalance = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [totalBalance, setTotalBalance] = useState<string>("0");
  const queryClient = useQueryClient();
  const userEmail = useRouteUser();

  const { error, isPending, data } = useQuery({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 5, // 5-minute cache
    gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
    retry: 1,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (data?.data?.totalBalance !== undefined) {
      setTotalBalance(formatToTwoDecimals(data.data.totalBalance).stringValue);
    }
  }, [data]);

  const putUserTotalBalanceMutation = useMutation({
    fn: putUserTotalBalanceServer,
    onSuccess: async (ctx) => {
      if (ctx.data?.error) {
        toast.error(ctx.data.message);
        return;
      }
      toast.success(ctx.data.message);
      setIsEditing(false);
      if (ctx.data?.data?.totalBalance !== undefined) {
        setTotalBalance(ctx.data.data.totalBalance.toString());
        const { invalidateUserQueries } = await import(
          "~/utils/query-invalidation"
        );
        await invalidateUserQueries(queryClient, userEmail);
      }
    },
  });

  const handleEditClick = () => setIsEditing(true);

  const handleInputChange = (value: string) => {
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setTotalBalance(value);
    }
  };

  const handleSaveEdit = () => {
    const parsed = Number(totalBalance);
    if (isNaN(parsed) || parsed < 0) {
      toast.error("Please enter a valid positive number");
      return;
    }
    putUserTotalBalanceMutation.mutate({
      data: {
        totalBalance: parsed,
        email: userEmail,
      },
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (data?.data?.totalBalance !== undefined) {
      setTotalBalance(formatToTwoDecimals(data.data.totalBalance).stringValue);
    }
  };

  if (error) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">Failed to load balance</p>
        </CardContent>
      </Card>
    );
  }

  if (isPending) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-48" />
        </CardContent>
      </Card>
    );
  }

  // return (
  //   <Card className="w-full max-w-md shadow-md transition-shadow duration-300 hover:shadow-lg lg:max-w-none">
  //     <CardContent className="group space-y-3">
  //       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

  //         {isEditing ? (
  //           <div className="animate-in slide-in-from-bottom-2 duration-300 ease-out sm:ml-auto">
  //             <div className="flex items-center justify-end gap-2">
  //               <BalanceActions
  //                 onSave={handleSaveEdit}
  //                 onCancel={handleCancelEdit}
  //                 isSubmitting={
  //                   putUserTotalBalanceMutation.status === "pending"
  //                 }
  //               />
  //             </div>
  //           </div>
  //         ) : null}
  //       </div>

  //       <div className="flex min-h-10 items-center">
  //         {isEditing ? (
  //           <div className="w-full animate-in fade-in-0 slide-in-from-right-2 duration-300 ease-out">
  //             <BalanceEditor
  //               value={totalBalance}
  //               onChange={handleInputChange}
  //               isSubmitting={putUserTotalBalanceMutation.status === "pending"}
  //             />
  //           </div>
  //         ) : (
  //           <div className="w-full animate-in fade-in-0 slide-in-from-left-2 duration-300 ease-out">
  //             <BalanceDisplay
  //               balance={Number(totalBalance) || 0}
  //               onEdit={handleEditClick}
  //             />
  //           </div>
  //         )}
  //       </div>
  //     </CardContent>
  //   </Card>
  // );

  return (
    <div>
      <p className="flex items-center justify-center text-sm font-medium text-muted-foreground">
        Total Balance
      </p>
      <p className="flex justify-center items-center text-5xl font-bold mt-2">
        ${totalBalance}
      </p>
    </div>
  );
};

export default TotalBalance;
