import { useQuery } from "@tanstack/react-query";
import { Check, DollarSign, Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouteUser } from "~/hooks/use-route-user";
import { useMutation } from "~/hooks/useMutation";
import { userByEmailQueryOptions } from "~/queries/usersByEmail";
import { formatCurrency } from "~/utils/formatCurrency";
import { putUserTotalBalance } from "~/utils/user/putUserTotalBalance";
import Card from "./card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";

const TotalBalance = () => {
	const [isEditing, setIsEditing] = useState(false);
	const [totalBalance, setTotalBalance] = useState(0);

	const user = useRouteUser();
	if (!user.email) return <div>No user email</div>;

	const { isPending, data, error } = useQuery(
		userByEmailQueryOptions(user.email),
	);

	const putUserTotalBalanceMutation = useMutation({
		fn: putUserTotalBalance,
		onSuccess: async (ctx) => {
			if (ctx.data?.error) {
				toast.error(ctx.data.message);
				return;
			}
			toast.success(ctx.data.message);
			setIsEditing(false);
		},
	});

	const handleEditClick = () => {
		setIsEditing(true);
	};

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
				email: user.email,
			},
		});
	};

	useEffect(() => {
		if (data) setTotalBalance(data.totalBalance);
	}, [data]);

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
						<form onSubmit={handleSubmit} className="flex items-center gap-2">
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
						<p className="text-2xl font-bold flex items-center justify-between gap-2">
							{formatCurrency(totalBalance ?? 0, "MXN")}
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
