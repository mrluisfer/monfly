import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Home,
});

import {
	BarChart2,
	Percent,
	ShieldCheck,
	Star,
	TrendingUp,
} from "lucide-react";
import type { ReactNode } from "react";
import Card from "~/components/card";
import { GlobalHeader } from "~/components/header";
import { Button } from "~/components/ui/button";

const partners: { name: string; image: string | ReactNode }[] = [
	{
		name: "Visa",
		image: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png",
	},
	{
		name: "Stripe",
		image:
			"https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png",
	},
	{
		name: "Paypal",
		image: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
	},
	{
		name: "Apple Pay",
		image:
			"https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
	},
];

export default function Home() {
	return (
		<div className="h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950">
			<div className="pt-4 max-w-5xl mx-auto px-4">
				<GlobalHeader />
			</div>
			<section className="max-w-5xl mx-auto pb-12 px-4 flex flex-col md:flex-row gap-10 items-center justify-between">
				<div className="flex-1 space-y-6">
					<span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-2">
						Smarter Finances Start Here
					</span>
					<h1 className="text-4xl md:text-5xl font-bold tracking-tight">
						Empower Your <span className="text-primary">Financial Journey</span>
						<br />
						with <span className="text-primary">Monfly</span>
					</h1>
					<p className="text-lg text-muted-foreground max-w-md">
						Take control of your income, expenses, budgets and goals, all in one
						place. Modern technology, expert insights, and limitless potential.
					</p>
					<div className="flex flex-col gap-4">
						<Button size="lg" className="mt-4 font-semibold" asChild>
							<Link to="/signup">Get Started</Link>
						</Button>
						<div className="flex items-center gap-2">
							<span className="text-sm text-muted-foreground">
								Already have an account?
							</span>
							<Button asChild size="sm" variant="outline">
								<Link to="/login">Login</Link>
							</Button>
						</div>
					</div>
					<div className="flex gap-4 mt-6 items-center">
						<span className="text-xs text-muted-foreground">
							Our Trusted Partners:
						</span>
						<div className="flex gap-4">
							{partners.map((partner) => (
								<img
									key={partner.name}
									src={partner.image as string}
									alt={partner.name}
									className="h-5 grayscale hover:grayscale-0 transition-all duration-300"
								/>
							))}
						</div>
					</div>
				</div>
				<div className="flex-1 flex justify-center md:justify-end">
					<section className="max-w-5xl mx-auto flex flex-col gap-4">
						<FeatureCard
							icon={<ShieldCheck className="text-primary w-8 h-8" />}
							title="Secure Your Future"
							description="We prioritize world-class security to safeguard your assets and ensure peace of mind."
						/>
						<FeatureCard
							icon={<TrendingUp className="text-primary w-8 h-8" />}
							title="Empower with Speed"
							description="Get instant, adaptable solutions to stay ahead and manage your finances easily."
						/>
						<FeatureCard
							icon={<BarChart2 className="text-primary w-8 h-8" />}
							title="Advanced Analytics"
							description="Visualize and analyze your spending, set goals, and make smarter decisions."
						/>
					</section>
				</div>
			</section>

			<Card className="max-w-4xl mx-auto px-4 flex flex-col gap-4">
				<div className="flex flex-col md:flex-row items-center justify-between gap-6">
					<div>
						<h3 className="font-semibold text-xl">
							Join <span className="text-primary">200K+</span> users
						</h3>
						<p className="text-muted-foreground">
							Managing their finances with Monfly.
						</p>
					</div>
					<div className="flex gap-10">
						<div>
							<span className="text-2xl font-bold flex items-center gap-1">
								4.9
								<span className="text-primary">
									<Star className="w-4 h-4" />
								</span>
							</span>
							<p className="text-xs text-muted-foreground">Avg. Rating</p>
						</div>
						<div>
							<span className="text-2xl font-bold flex items-center gap-1">
								98
								<span className="text-primary">
									<Percent className="w-4 h-4" />
								</span>
							</span>
							<p className="text-xs text-muted-foreground">User Satisfaction</p>
						</div>
					</div>
					<div className="italic text-sm text-right max-w-xs text-zinc-700 dark:text-zinc-300">
						“Monfly makes tracking my spending effortless. I feel confident
						knowing my data is secure.”
						<br />
						<span className="not-italic font-bold text-primary">
							– Jane Doe
						</span>
					</div>
				</div>
			</Card>
			<footer className="w-full mt-10 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-8 absolute bottom-0 left-0 right-0">
				<div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-2">
						<span className="font-bold text-primary text-lg">Monfly</span>
						<span className="text-sm text-zinc-500">
							© {new Date().getFullYear()}
						</span>
					</div>
					<p className="text-xs text-zinc-500 text-center md:text-right max-w-xl">
						This project is for personal use and educational purposes only.
						Monfly is not a commercial product or financial service, and is not
						intended for public release. No responsibility is accepted for any
						misuse or reliance on this platform. All product names, logos, and
						brands are property of their respective owners.
					</p>
				</div>
			</footer>
		</div>
	);
}

function FeatureCard({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<Card className="flex flex-col items-center text-center gap-2">
			<h3 className="font-semibold text-lg flex items-center justify-center gap-4">
				{icon}
				{title}
			</h3>
			<p className="text-muted-foreground text-sm">{description}</p>
		</Card>
	);
}
