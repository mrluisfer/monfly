import { notionists } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import clsx from "clsx";
import { useMemo } from "react";
import { transactionTypes } from "~/constants/transactionTypes";
import type { TTransaction } from "~/lib/api/transactionByEmail";
import { formatCurrency } from "~/utils/formatCurrency";

export default function TransactionItem({
	transaction,
}: { transaction: TTransaction }) {
	const avatar = useMemo(() => {
		return createAvatar(notionists, {
			seed: transaction.user.name ?? "",
			backgroundColor: ["#b6e3f4", "#c0aede", "#d1d4f9", "#ffd5dc", "#ffdfbf"],
			radius: 100,
		}).toDataUri();
	}, [transaction.user.name]);

	const textBase = "text-base font-medium";
	const textMuted = "text-sm opacity-50";

	return (
		<div className="flex items-center gap-2">
			<Avatar className="w-10 h-10">
				<AvatarImage
					src={avatar}
					alt={`Avatar of ${transaction.user.name}`}
					className="bg-neutral-500/30 aspect-square shrink-0 rounded-full"
				/>
				<AvatarFallback>
					{transaction.user.name?.charAt(0).toUpperCase()}
				</AvatarFallback>
			</Avatar>
			<div className="flex justify-between w-full">
				<div>
					<p className={clsx(textBase, "capitalize")}>
						{transaction.user.name}
					</p>
					<span className={textMuted}>{transaction.user.email}</span>
				</div>
				<div>
					<p className={textBase}>
						{transaction.type === transactionTypes.INCOME ? "+" : "-"}
						{formatCurrency(transaction.amount, "MXN")}
					</p>
					<span className={textMuted}>
						{new Date(transaction.createdAt).toLocaleDateString()}
					</span>
				</div>
			</div>
		</div>
	);
}
