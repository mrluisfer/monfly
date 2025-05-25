import clsx from "clsx";
import { ReactNode } from "react";

const Title = ({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) => {
	return <h1 className={clsx("font-bold text-2xl", className)}>{children}</h1>;
};

export default Title;
