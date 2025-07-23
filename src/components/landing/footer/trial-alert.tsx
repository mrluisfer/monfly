import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { ChevronRight } from "lucide-react";

export const TrialAlert = () => {
  return (
    <div className="items-center justify-center p-16 border border-primary-foreground flex flex-col gap-4 rounded-[1rem] bg-gray-100/50 dark:bg-zinc-800/50">
      <p className="font-semibold text-3xl max-w-md text-center">
        Start your free trial today. Your future won't wait.
      </p>
      <span className="text-muted-foreground">
        Join thousands of users already leveraging our platform to achieve more.
      </span>
      <Button asChild>
        <Link to="/signup">
          Start Your Journey With Monfly
          <ChevronRight />
        </Link>
      </Button>
    </div>
  );
};
