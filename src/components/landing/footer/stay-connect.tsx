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
import { sileo } from "~/lib/toaster";
import { AtSignIcon } from "lucide-react";
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
      form.reset();
    } catch {
      sileo.error({ title: "Failed to subscribe. Please try again." });
    }
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <Label htmlFor={id} className="space-y-2 text-base md:max-w-md">
        <span className="text-base font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Stay connected
        </span>
        <span className="block text-sm text-muted-foreground sm:text-base">
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
                      className="peer h-10 rounded-full border-border/70 bg-background/90 ps-9"
                      placeholder="you@company.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                    <AtSignIcon size={16} aria-hidden="true" />
                  </div>
                  <FormDescription />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="lg" className="h-10 rounded-full px-5">
            Subscribe
          </Button>
        </form>
      </Form>
    </div>
  );
}
