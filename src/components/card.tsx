import clsx from "clsx";
import type { ReactNode } from "react";

const Card = ({
	children,
	className,
	variant = "primary",
}: {
	children: ReactNode;
	className?: string;
	variant?: "primary" | "secondary";
}) => {
	const cardStyles = {
		primary: "bg-neutral-100",
		secondary: "bg-neutral-900 text-white",
	};

	return (
		<div
			className={clsx(
				"p-6 rounded-[1rem] shadow-xs border-2 border-transparent transition duration-200 ease-in-out hover:scale-105 hover:brightness-105",
				cardStyles[variant],
				className,
			)}
		>
			{children}
		</div>
	);
};

export default Card;
