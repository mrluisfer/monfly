import { useId } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { useAppHaptics } from "~/hooks/haptics/useAppHaptics";
import { sileo } from "~/lib/toaster";
import { AtSignIcon, SendIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .max(80, "Email must be 80 characters or less"),
});

function getEmailUsername(email: string) {
  return email.trim().toLowerCase().split("@")[0];
}

export function StayConnect() {
  const id = useId();
  const { success, warning } = useAppHaptics();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    try {
      const emailUsername = getEmailUsername(data.email);
      sileo.success({
        title: "Subscribed successfully!",
        description: `Thank you ${emailUsername} for subscribing to our newsletter!`,
      });
      void success();
      form.reset();
    } catch {
      void warning();
      sileo.error({ title: "Failed to subscribe. Please try again." });
    }
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <Label htmlFor={id} className="space-y-2 text-base md:max-w-md">
        <span className="text-muted-foreground 3xl:inline-block hidden text-base font-semibold tracking-[0.12em] uppercase">
          Stay connected
        </span>
        <span className="text-muted-foreground block text-sm sm:text-base">
          Subscribe for product updates, finance playbooks, and launch offers.
        </span>
      </Label>

      <Form {...form}>
        <form
          className="flex w-full flex-col gap-2 sm:max-w-xl sm:flex-row"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="relative">
                  <FormControl>
                    <Input
                      id={id}
                      className="peer border-border/75 bg-background/92 h-10 rounded-full ps-9"
                      placeholder="you@company.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 inset-s-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                    <AtSignIcon size={16} aria-hidden="true" />
                  </div>
                  <FormDescription />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="lg">
            <SendIcon aria-hidden="true" />
            Subscribe
          </Button>
        </form>
      </Form>
    </div>
  );
}
