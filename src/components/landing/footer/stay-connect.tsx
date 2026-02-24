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
    } catch (error) {
      sileo.error({ title: "Failed to subscribe. Please try again." });
    }
  };

  return (
    <div className="*:not-first:mt-2 flex flex-col md:flex-row items-start justify-between gap-4">
      <Label htmlFor={id} className="flex flex-col items-start gap-2 text-lg">
        Stay connected
        <span className="text-sm text-muted-foreground">
          Subscribe to our newsletter for the latest updates, resources, and
          exclusive offers.
        </span>
      </Label>
      <Form {...form}>
        <form
          className="flex items-start gap-2"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <FormControl>
                    <Input
                      id={id}
                      className="peer ps-9 bg-white w-full sm:w-[300px]"
                      placeholder="Email"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                    <AtSignIcon size={16} aria-hidden="true" />
                  </div>
                  <FormDescription />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Subscribe</Button>
        </form>
      </Form>
    </div>
  );
}
