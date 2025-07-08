import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import Card from "~/components/card";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import UserAvatar from "~/components/user-avatar";
import { userFormNames } from "~/constants/forms/user-form-names";
import { getUserByIdServer } from "~/lib/api/user/get-user-by-id.server";
import { queryDictionary } from "~/queries/dictionary";
import { formatToTwoDecimals } from "~/utils/formatTwoDecimals";
import { userFormSchema } from "~/zod-schemas/user-schema";
import { User2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute("/_authed/user/$userId")({
  component: RouteComponent,
  params: z.object({
    userId: z.string(),
  }),
  loader: async ({ params: { userId } }) => {
    return {
      userId,
    };
  },
});

function RouteComponent() {
  const loaderData = Route.useLoaderData();

  const { data, error, isLoading } = useQuery({
    queryKey: [queryDictionary.user, loaderData.userId],
    queryFn: () => getUserByIdServer({ data: { userId: loaderData.userId } }),
    enabled: !!loaderData.userId,
  });

  const defaultTotalBalanceFormatted = formatToTwoDecimals(
    data?.data?.totalBalance ?? 0
  ).numberValue;
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      [userFormNames.email]: data?.data?.email ?? "",
      [userFormNames.name]: data?.data?.name ?? "",
      [userFormNames.password]: "",
      [userFormNames.totalBalance]: defaultTotalBalanceFormatted,
    },
    values: data?.data
      ? {
          [userFormNames.email]: data.data.email ?? "",
          [userFormNames.name]: data.data.name ?? "",
          [userFormNames.password]: "",
          [userFormNames.totalBalance]: defaultTotalBalanceFormatted,
        }
      : undefined,
  });

  if (isLoading) return <div className="p-12 text-center">Loading...</div>;
  if (error)
    return (
      <div className="p-12 text-center text-red-500">
        Error: {error.message}
      </div>
    );

  function onSubmit(values: z.infer<typeof userFormSchema>) {
    // Actualización de usuario aquí
    console.log(values);
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background py-8 px-4">
      <Card
        className="w-full max-w-3xl shadow-xl rounded-2xl p-0 overflow-hidden"
        title={null}
        subtitle={null}
        cardContentProps={{ className: "p-0" }}
      >
        {/* Header visual atractivo */}
        <div className="bg-primary/90 p-6 flex flex-col md:flex-row gap-4 items-center">
          <div>
            {data?.data?.name ? (
              <UserAvatar
                alt={data?.data?.name}
                name={data?.data?.name}
                size={15}
              />
            ) : (
              <div className="bg-background rounded-full p-3 shadow-md">
                <User2 className="w-8 h-8 text-primary" />
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-primary-foreground">
              Update Profile
            </h2>
            <p className="text-primary-foreground/80 text-sm">
              Manage your account and profile information.
            </p>
          </div>
        </div>
        {/* Formulario en dos columnas */}
        <div className="p-8 bg-card">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Primera columna */}
                <div className="flex flex-col gap-6">
                  <FormField
                    control={form.control}
                    name={userFormNames.email}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            disabled
                            className="opacity-80"
                            placeholder="you@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Your registered email (not editable).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={userFormNames.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Segunda columna */}
                <div className="flex flex-col gap-6">
                  <FormField
                    control={form.control}
                    name={userFormNames.password}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="New password"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Leave blank if you don’t want to change your password.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={userFormNames.totalBalance}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Balance</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step="any"
                            placeholder="0"
                            {...field}
                            onBlur={(e) => {
                              const { numberValue, stringValue } =
                                formatToTwoDecimals(e.target.value);
                              form.setValue(
                                userFormNames.totalBalance,
                                numberValue,
                                {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                }
                              );
                              e.target.value = stringValue;
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Your current balance (MXN).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex justify-end pt-8">
                <Tooltip>
                  <TooltipTrigger>
                    <Button type="submit" className="px-8 py-2" disabled>
                      Save changes
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      This feature is not available yet. Stay tuned for updates!
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
}
