import { ClientOnly, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { Button } from "./ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const actions = {
	login: "Login",
	signup: "Sign Up",
};

type ActionText = (typeof actions)[keyof typeof actions];

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type AuthProps<T extends z.ZodType<any, any, any>> = {
	actionText: ActionText;
	onSubmit: (data: z.infer<T>) => void;
	status: "pending" | "idle" | "success" | "error";
	afterSubmit?: ReactNode;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	form: UseFormReturn<any>;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function Auth<T extends z.ZodType<any, any, any>>({
	actionText,
	onSubmit,
	status,
	afterSubmit,
	form,
}: AuthProps<T>) {
	return (
		<ClientOnly>
			<div className="fixed inset-0 bg-white dark:bg-black flex items-start justify-center p-8">
				<div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
					<h1 className="text-2xl font-bold mb-4 w-full text-center">
						{actionText}
					</h1>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor="email">Email</FormLabel>
										<FormControl>
											<Input
												id="email"
												className="px-2 py-1 w-full rounded border border-gray-500/20 bg-white dark:bg-gray-800"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											This is your email address. We will send you a
											confirmation email.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor="password">Password</FormLabel>
										<FormControl>
											<Input
												type="password"
												className="px-2 py-1 w-full rounded border border-gray-500/20 bg-white dark:bg-gray-800"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{actionText === actions.signup && (
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="name">Username</FormLabel>
											<FormControl>
												<Input
													className="px-2 py-1 w-full rounded border border-gray-500/20 bg-white dark:bg-gray-800"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
							<Button
								type="submit"
								className="w-full cursor-pointer font-black uppercase"
								disabled={status === "pending"}
							>
								{status === "pending" ? "..." : actionText}
							</Button>
							{afterSubmit ? afterSubmit : null}
							{actionText === actions.login && (
								<div>
									<Button asChild className="w-full" variant="secondary">
										<Link to="/signup" type="button">
											Sign up
										</Link>
									</Button>
								</div>
							)}
							{actionText === actions.signup && (
								<div>
									<Button asChild className="w-full" variant="secondary">
										<Link to="/login" type="button">
											Login
										</Link>
									</Button>
								</div>
							)}
						</form>
					</Form>
				</div>
			</div>
		</ClientOnly>
	);
}
