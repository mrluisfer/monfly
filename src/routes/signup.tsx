import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Auth } from "~/components/auth";
import { useMutation } from "~/hooks/useMutation";
import { signupFn } from "~/utils/auth/signupfn";

const FormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	name: z.string().min(3),
});

export const Route = createFileRoute("/signup")({
	component: SignupComp,
});

function SignupComp() {
	const signupMutation = useMutation({
		fn: useServerFn(signupFn),
	});

	const onSubmit = (data: z.infer<typeof FormSchema>) => {
		signupMutation.mutate({
			data: {
				email: data.email,
				password: data.password,
				name: data.name,
				redirectUrl: "/home",
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
			actionText="Sign Up"
			status={signupMutation.status}
			onSubmit={onSubmit}
			afterSubmit={
				signupMutation.data?.error ? (
					<>
						<div className="text-red-400">{signupMutation.data.message}</div>
					</>
				) : null
			}
		/>
	);
}
