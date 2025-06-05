import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Auth } from "~/components/auth";
import GlobalHeader from "~/components/header/global-header";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { loginFn } from "~/utils/auth/loginfn";
import { getUserSession } from "~/utils/user/get-user-session";
import { BadgeCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod";

import { useMutation } from "../hooks/use-mutation";

export const Route = createFileRoute("/login")({
  component: Login,
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
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-12 md:py-0">
        <div className="pt-2">
          <GlobalHeader />
        </div>
        <div className="max-w-md mx-auto w-full">
          <h1 className="font-extrabold text-2xl mb-2 tracking-tight">
            Monfly
          </h1>
          <p className="mb-10 text-sm text-muted-foreground">
            Welcome to your personal finance platform
          </p>
          <h2 className="text-3xl font-bold mb-3">Hi there!</h2>
          <p className="mb-8 text-base text-muted-foreground">
            Log in to manage your finances
          </p>
          <Button variant="outline" type="button" className="w-full" size="lg">
            <FcGoogle />
            Log in with Google
          </Button>
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-xs text-zinc-400">or</span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>
          <Auth
            form={form}
            actionText="Login"
            status={loginMutation.status}
            onSubmit={onSubmit}
            afterSubmit={
              loginMutation.data ? (
                <>
                  <div className="text-red-400">
                    {loginMutation.data.message}
                  </div>
                  {loginMutation.data.error ? (
                    <div>
                      <div>User not found, but you can sign up!</div>
                    </div>
                  ) : null}
                </>
              ) : null
            }
          />
        </div>
      </div>
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-br from-[#a3bfff] via-[#f8c0f4] to-[#e5e7fa] dark:from-[#1a223a] dark:via-[#362a42] dark:to-[#24304e]">
        <div className="bg-white/30 backdrop-blur-md rounded-2xl p-12 text-center max-w-md shadow-lg dark:bg-black/30">
          <div className="flex items-center justify-center mb-6">
            <span className="font-medium text-lg text-black dark:text-white">
              Manage all your{" "}
              <span className="text-primary font-bold">Funds</span> at one
              place.
            </span>
          </div>
          <p className="text-base text-zinc-700 mb-4 font-medium dark:text-white opacity-60">
            "Unlock your potential: Track, save, and master your finances with
            Monfly —
            <br />
            your one-stop personal finance platform."
          </p>
          <Badge variant="outline">
            <BadgeCheck />
            For personal and educational use only.
          </Badge>
        </div>
      </div>
    </div>
  );
}
