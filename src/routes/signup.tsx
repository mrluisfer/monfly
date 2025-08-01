import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Auth, authActions } from "~/components/auth";
import { ExternalLogin } from "~/components/auth/external-login";
import { GoToHomeButton } from "~/components/header/go-to-home-button";
import { Badge } from "~/components/ui/badge";
import { useMutation } from "~/hooks/use-mutation";
import { signupFn } from "~/utils/auth/signupfn";
import { getUserSession } from "~/utils/user/get-user-session";
import { BadgeCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(3),
});

export const Route = createFileRoute("/signup")({
  component: SignupComp,
  beforeLoad: async () => {
    const { data: userEmail } = await getUserSession();
    if (userEmail) {
      // This means the user is authenticated
      return redirect({
        to: "/home",
      });
    }
  },
});

function SignupComp() {
  const navigate = useNavigate();

  const signupMutation = useMutation({
    fn: useServerFn(signupFn),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const signupMutationData = await signupMutation.mutate({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        redirectUrl: "/home",
      },
    });
    if (signupMutationData?.success) {
      await navigate({
        to: "/home",
      });
    }
  };

  const form = useForm({
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    resolver: zodResolver(FormSchema as any),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#b6e2ff] via-[#f4d2fb] to-[#e5e7fa] dark:from-[#10162b] dark:via-[#33284c] dark:to-[#19233d]">
      <div className="hidden md:flex md:w-1/2 items-center justify-center relative">
        <GoToHomeButton />
        <div className="absolute inset-0 bg-gradient-to-br from-[#81a5ff] via-[#eebdff] to-[#b8e6fa] dark:from-[#1a223a] dark:via-[#362a42] dark:to-[#24304e] opacity-80 z-0" />
        <div className="relative z-10 text-white flex flex-col items-center px-10">
          <h2 className="text-4xl font-extrabold mb-4 drop-shadow-lg">
            Welcome to Monfly!
          </h2>
          <p className="text-lg font-medium mb-6 max-w-md text-white/90 text-center">
            Take the first step towards smarter money management.
            <br />
            Secure. Simple. Free.
          </p>
          <Badge variant="default">
            <BadgeCheck />
            Personal use only
          </Badge>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-md bg-white/90 dark:bg-zinc-900/90 rounded-3xl shadow-2xl backdrop-blur-lg px-10 py-12 flex flex-col items-center border border-zinc-100 dark:border-zinc-800">
          <h1 className="text-3xl font-extrabold text-primary mt-4 mb-1">
            Create Account
          </h1>
          <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400 text-center">
            Join Monfly and make your money keep flying 🚀
          </p>
          <ExternalLogin />
          <div className="flex items-center gap-3 my-3 w-full">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-xs text-zinc-400">or</span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>
          <Auth
            withCard={false}
            form={form}
            actionText={authActions.signup}
            status={signupMutation.status}
            onSubmit={onSubmit}
            afterSubmit={
              signupMutation?.error ? (
                <div className="text-red-400">
                  {signupMutation.data?.message ||
                    "An error occurred. Please try again."}
                </div>
              ) : null
            }
          />
        </div>
      </div>
    </div>
  );
}
