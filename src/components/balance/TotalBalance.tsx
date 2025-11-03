import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { useMutation } from "~/hooks/use-mutation";
import { useRouteUser } from "~/hooks/use-route-user";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email.server";
import { putUserTotalBalanceServer } from "~/lib/api/user/put-user-total-balance.server";
import { queryDictionary } from "~/queries/dictionary";
import { formatToTwoDecimals } from "~/utils/formatTwoDecimals";
import { DollarSign } from "lucide-react";
import { toast } from "sonner";

import { BalanceDisplay } from "./BalanceDisplay";
import { BalanceEditor } from "./BalanceEditor";
import { BalanceEditorActions } from "./BalanceEditorActions";

const TotalBalance = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [totalBalance, setTotalBalance] = useState<string>("0");
  const queryClient = useQueryClient();
  const userEmail = useRouteUser();

  const { error, isPending, data } = useQuery({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
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
      <Card className="max-w-md">
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">Failed to load balance</p>
        </CardContent>
      </Card>
    );
  }

  if (isPending) {
    return (
      <Card className="max-w-md">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-48" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md lg:max-w-none border-t-4 border-t-primary">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <DollarSign className="size-5 text-primary" />
            Current Balance
          </CardTitle>

          {isEditing ? (
            <div className="animate-in slide-in-from-bottom-2 duration-300 ease-out">
              <div className="flex items-center gap-2 justify-end flex-1">
                <BalanceEditorActions
                  onSave={handleSaveEdit}
                  onCancel={handleCancelEdit}
                  isSubmitting={
                    putUserTotalBalanceMutation.status === "pending"
                  }
                />
              </div>
            </div>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="group">
        <div className="min-h-10 flex items-center">
          {isEditing ? (
            <div className="w-full animate-in fade-in-0 slide-in-from-right-2 duration-300 ease-out">
              <BalanceEditor
                value={totalBalance}
                onChange={handleInputChange}
                isSubmitting={putUserTotalBalanceMutation.status === "pending"}
              />
            </div>
          ) : (
            <div className="w-full animate-in fade-in-0 slide-in-from-left-2 duration-300 ease-out">
              <BalanceDisplay
                balance={Number(totalBalance) || 0}
                onEdit={handleEditClick}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalBalance;
