import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { useRouteUser } from "~/hooks/use-route-user";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email";
import { queryDictionary } from "~/queries/dictionary";
import { formatToTwoDecimals } from "~/utils/formatTwoDecimals";
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
} from "framer-motion";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const TOTAL_BALANCE_VISIBILITY_STORAGE_KEY = "monfly-total-balance-hidden";

const TotalBalance = () => {
  const [totalBalance, setTotalBalance] = useState<string>("0");
  const [isBalanceHidden, setIsBalanceHidden] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const userEmail = useRouteUser();

  const { error, isPending, data } = useQuery({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 5, // 5-minute cache
    gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
    retry: 1,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (data?.data?.totalBalance !== undefined) {
      setTotalBalance(formatToTwoDecimals(data.data.totalBalance).stringValue);
    }
  }, [data]);

  useEffect(() => {
    const storedVisibility = localStorage.getItem(
      TOTAL_BALANCE_VISIBILITY_STORAGE_KEY
    );

    if (storedVisibility === null) {
      setIsBalanceHidden(false);
      return;
    }

    setIsBalanceHidden(storedVisibility === "true");
  }, []);

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden((previousValue) => {
      const nextValue = !previousValue;
      localStorage.setItem(
        TOTAL_BALANCE_VISIBILITY_STORAGE_KEY,
        String(nextValue)
      );
      return nextValue;
    });
  };

  if (error) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">Failed to load balance</p>
        </CardContent>
      </Card>
    );
  }

  if (isPending) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-48" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <p className="flex items-center justify-center text-sm font-medium text-muted-foreground">
        Total Balance
      </p>
      <LazyMotion features={domAnimation}>
        <div className="mt-2 flex items-center justify-center gap-2">
          <div className="flex min-h-14 items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              {isBalanceHidden ? (
                <m.span
                  key="hidden-balance"
                  initial={
                    shouldReduceMotion
                      ? false
                      : { opacity: 0, y: 8, filter: "blur(4px)" }
                  }
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: -8, filter: "blur(4px)" }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.22,
                    ease: "easeOut",
                  }}
                  className="text-5xl font-bold tracking-[0.2em]"
                  aria-label="Total balance hidden"
                >
                  $******
                </m.span>
              ) : (
                <m.span
                  key="visible-balance"
                  initial={
                    shouldReduceMotion
                      ? false
                      : { opacity: 0, y: 8, filter: "blur(4px)" }
                  }
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: -8, filter: "blur(4px)" }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.22,
                    ease: "easeOut",
                  }}
                  className="text-5xl font-bold"
                >
                  ${totalBalance}
                </m.span>
              )}
            </AnimatePresence>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            onClick={toggleBalanceVisibility}
            aria-label={
              isBalanceHidden ? "Show total balance" : "Hide total balance"
            }
            aria-pressed={isBalanceHidden}
            title={isBalanceHidden ? "Show balance" : "Hide balance"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <m.span
                key={isBalanceHidden ? "show-icon" : "hide-icon"}
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0, scale: 0.75, rotate: -15 }
                }
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.75, rotate: 15 }
                }
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.18,
                  ease: "easeOut",
                }}
                className="flex items-center justify-center"
              >
                {isBalanceHidden ? (
                  <EyeIcon aria-hidden="true" />
                ) : (
                  <EyeOffIcon aria-hidden="true" />
                )}
              </m.span>
            </AnimatePresence>
          </Button>
        </div>
      </LazyMotion>
    </div>
  );
};

export default TotalBalance;
