"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useRef } from "react";
import { useRouteUser } from "~/hooks/use-route-user";
import { useMutation } from "~/hooks/useMutation";
import { getMonthlySummaryByEmail } from "~/utils/getMonthlySummaryByEmail";
import Card from "./card";

export const description = "A linear area chart";

const chartData = [
	{ month: "January", desktop: 186 },
	{ month: "February", desktop: 305 },
	{ month: "March", desktop: 237 },
	{ month: "April", desktop: 73 },
	{ month: "May", desktop: 209 },
	{ month: "June", desktop: 214 },
];

const chartConfig = {
	desktop: {
		label: "Desktop",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

function IncomeChart() {
	const { email } = useRouteUser();
	const emailRef = useRef(email);

	const putUserTotalBalanceMutation = useMutation({
		fn: getMonthlySummaryByEmail,
		onSuccess: async (ctx) => {
			if (ctx.data?.error) {
				console.log(ctx.data);
			}
			console.log(ctx.data);
		},
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!emailRef.current) return;
		putUserTotalBalanceMutation.mutate({
			data: { email: emailRef.current },
		});
	}, []);

	return (
		<Card
			title={<div>Income Chart</div>}
			subtitle="Showing total income for the last 6 months"
			Footer={
				<div className="flex w-full items-start gap-2 text-sm">
					<div className="grid gap-2">
						<div className="flex items-center gap-2 leading-none font-medium">
							Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
						</div>
						<div className="text-muted-foreground flex items-center gap-2 leading-none">
							January - June {new Date().getFullYear()}
						</div>
					</div>
				</div>
			}
		>
			<ChartContainer config={chartConfig}>
				<AreaChart
					accessibilityLayer
					data={chartData}
					margin={{
						left: 12,
						right: 12,
					}}
				>
					<CartesianGrid vertical={false} />
					<XAxis
						dataKey="month"
						tickLine={false}
						axisLine={false}
						tickMargin={8}
						tickFormatter={(value) => value.slice(0, 3)}
					/>
					<ChartTooltip
						cursor={false}
						content={<ChartTooltipContent indicator="dot" hideLabel />}
					/>
					<Area
						dataKey="desktop"
						type="linear"
						fill="var(--color-desktop)"
						fillOpacity={0.4}
						stroke="var(--color-desktop)"
					/>
				</AreaChart>
			</ChartContainer>
		</Card>
	);
}

export default IncomeChart;
