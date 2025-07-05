import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutation } from "~/hooks/use-mutation";
import { useRouteUser } from "~/hooks/use-route-user";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email.server";
import { putUserTotalBalanceServer } from "~/lib/api/user/put-user-total-balance.server";
import { queryDictionary } from "~/queries/dictionary";
import { formatCurrency } from "~/utils/format-currency";
import { Check, DollarSign, Edit2 } from "lucide-react";
import { toast } from "sonner";

import Card from "./card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";

const TotalBalance = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const queryClient = useQueryClient();
  const userEmail = useRouteUser();

  const { error, isPending, data } = useQuery({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
  });

  useEffect(() => {
    if (data?.data?.totalBalance !== undefined) {
      setTotalBalance(data.data.totalBalance);
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
        setTotalBalance(ctx.data.data.totalBalance);
        await queryClient.invalidateQueries({
          queryKey: [queryDictionary.user, userEmail],
        });
      }
    },
  });

  const handleEditClick = () => setIsEditing(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (val >= 0 || e.target.value === "") {
      setTotalBalance(val);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    putUserTotalBalanceMutation.mutate({
      data: {
        totalBalance: Number(totalBalance),
        email: userEmail,
      },
    });
  };

  if (error) return <div>Error</div>;

  return (
    <Card className="group">
      {isPending ? (
        <Skeleton className="w-24 h-4" />
      ) : (
        <>
          <div className="flex items-center justify-between">
            Current Balance <DollarSign className="w-4 h-4 opacity-50" />
          </div>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="flex items-center gap-4">
              <Input
                value={totalBalance.toString()}
                onChange={handleInputChange}
                type="number"
                min={0}
              />
              <Button variant="outline" size="icon" type="submit">
                <Check size={12} />
              </Button>
            </form>
          ) : (
            <p className="text-2xl font-bold flex items-center justify-between gap-4">
              <span>
                {formatCurrency(totalBalance ?? 0, "MXN")}{" "}
                <span className="text-muted-foreground text-sm">MXN</span>
              </span>
              <Button
                variant="outline"
                size="icon"
                className="group-hover:opacity-100 opacity-0"
                onClick={handleEditClick}
              >
                <Edit2 size={12} />
              </Button>
            </p>
          )}
        </>
      )}
    </Card>
  );
};

export default TotalBalance;
