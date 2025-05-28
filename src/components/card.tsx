import clsx from "clsx";
import type { ReactNode } from "react";

const Card = ({
	children,
	className,
	variant = "primary",
	title,
}: {
	children: ReactNode;
	className?: string;
	variant?: "primary" | "secondary";
	title?: string;
}) => {
	return (
		<div
			className={clsx(
				"p-4 transition duration-200 ease-in-out hover:brightness-105 border-2 rounded-xl border bg-card text-card-foreground shadow",
				className,
			)}
		>
			<h3 className="text-lg font-bold">{title}</h3>
			{children}
		</div>
	);
};

export default Card;
