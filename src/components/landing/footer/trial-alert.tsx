import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { ChevronRight } from "lucide-react";

export const TrialAlert = () => {
  return (
    <div className="items-center justify-center p-6 sm:p-10 md:p-16 border border-primary-foreground flex flex-col gap-4 rounded-[1rem] bg-gray-100/50 dark:bg-zinc-800/50">
      <p className="font-semibold text-xl sm:text-2xl md:text-3xl max-w-md text-center">
        Start your free trial today. Your future won't wait.
      </p>
      <span className="text-muted-foreground text-sm sm:text-base text-center">
        Join thousands of users already leveraging our platform to achieve more.
      </span>
      <Button
        render={
          <Link to="/signup">
            Start Your Journey With Monfly
            <ChevronRight />
          </Link>
        }
      />
    </div>
  );
};
