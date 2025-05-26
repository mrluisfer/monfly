import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Auth } from "~/components/auth";
import { Button } from "~/components/ui/button";
import { fetchUser } from "~/utils/auth/fetch-user";
import { loginFn } from "~/utils/auth/loginfn";
import { useMutation } from "../hooks/useMutation";

export const Route = createFileRoute("/login")({
	component: Login,
	beforeLoad: async () => {
		const user = await fetchUser();
		if (user?.email) {
			// This means the user is authenticated
			return redirect({
				to: "/home",
			});
		}
	},
});

const rawSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

function Login() {
	const navigate = useNavigate();
	const FormSchema = useMemo(() => rawSchema, []);

	const loginMutation = useMutation({
		fn: loginFn,
		onSuccess: async (ctx) => {
			if (!ctx.data?.error) {
				await navigate({
					to: "/home",
				});
				return;
			}

			console.log("Login error", ctx.data);
		},
	});

	const onSubmit = async (data: z.infer<typeof FormSchema>) => {
		await loginMutation.mutate({
			data: {
				email: data.email,
				password: data.password,
			},
		});
	};

	const form = useForm({
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		resolver: zodResolver(FormSchema as any),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	return (
		<Auth
			form={form}
			actionText="Login"
			status={loginMutation.status}
			onSubmit={onSubmit}
			afterSubmit={
				loginMutation.data ? (
					<>
						<div className="text-red-400">{loginMutation.data.message}</div>
						{loginMutation.data.userNotFound ? (
							<div>
								<div>User not found, but you can sign up!</div>
							</div>
						) : null}
					</>
				) : null
			}
		/>
	);
}
