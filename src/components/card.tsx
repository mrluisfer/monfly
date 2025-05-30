import type { ReactNode } from "react";
import {
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Card as CardUI,
} from "./ui/card";

const Card = ({
	children,
	className,
	title,
	subtitle,
	Footer,
}: {
	children: ReactNode;
	className?: string;
	title?: string | ReactNode;
	subtitle?: string | ReactNode;
	Footer?: ReactNode;
}) => {
	return (
		<CardUI className={className}>
			{title && (
				<CardHeader>
					<CardTitle>
						{title}
						<CardDescription>{subtitle}</CardDescription>
					</CardTitle>
				</CardHeader>
			)}
			<CardContent>{children}</CardContent>
			{Footer && <CardFooter>{Footer}</CardFooter>}
		</CardUI>
	);
};

export default Card;
