import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutation } from "~/hooks/use-mutation";
import { useRouteUser } from "~/hooks/use-route-user";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email.server";
import { putUserTotalBalanceServer } from "~/lib/api/user/put-user-total-balance.server";
import { queryDictionary } from "~/queries/dictionary";
import { formatCurrency } from "~/utils/format-currency";
import { Check, DollarSign, Edit2, X } from "lucide-react";
import { toast } from "sonner";

import Card from "./card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";

const TotalBalance = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [totalBalance, setTotalBalance] = useState<string>("0");
  const queryClient = useQueryClient();
  const userEmail = useRouteUser();

  const { error, isPending, data } = useQuery({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
  });

  useEffect(() => {
    if (data?.data?.totalBalance !== undefined) {
      setTotalBalance(data.data.totalBalance.toString());
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
        await queryClient.invalidateQueries({
          queryKey: [queryDictionary.user, userEmail],
        });
      }
    },
  });

  const handleEditClick = () => setIsEditing(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*\.?\d*$/.test(val) || val === "") {
      setTotalBalance(val);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

  if (error) return <div>Error</div>;

  return (
    <Card className="group">
      {isPending ? (
        <Skeleton className="w-24 h-4" />
      ) : (
        <>
          <div className="flex items-center justify-between">
            Current Balance{" "}
            <DollarSign className="w-4 h-4 opacity-50 text-primary" />
          </div>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="flex items-center gap-4">
              <Input
                value={totalBalance}
                onChange={handleInputChange}
                type="number"
                step="any"
                min={0}
                inputMode="decimal"
                pattern="^\d*\.?\d*$"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" type="submit">
                  <Check size={12} />
                </Button>
                <Button onClick={() => setIsEditing(false)}>
                  <X size={12} />
                </Button>
              </div>
            </form>
          ) : (
            <p className="text-2xl font-bold flex items-center justify-between gap-4">
              <span>
                {formatCurrency(Number(totalBalance) || 0, "MXN")}{" "}
                <span className="text-primary text-sm">MXN</span>
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
