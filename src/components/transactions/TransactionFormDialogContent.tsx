import type { ReactNode } from "react";
import { cn } from "~/lib/utils";
import { XIcon } from "lucide-react";

import { Button } from "../ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

export const transactionFormDialogContentClassName =
  "top-auto bottom-0 w-[calc(100vw-0.75rem)] !max-w-[calc(100vw-0.75rem)] -translate-y-0 rounded-t-3xl rounded-b-none p-0 sm:top-1/2 sm:bottom-auto sm:w-[calc(100vw-2rem)] sm:!max-w-2xl sm:-translate-y-1/2 sm:rounded-2xl md:!max-w-3xl lg:!max-w-[58rem] xl:!max-w-[66rem]";

type TransactionFormDialogContentProps = {
  title: string;
  description: string;
  children: ReactNode;
  showCancelButton?: boolean;
  cancelLabel?: string;
  className?: string;
  bodyClassName?: string;
  isLoading?: boolean | undefined;
};

export function TransactionFormDialogContent({
  title,
  description,
  children,
  showCancelButton = true,
  cancelLabel = "Cancel",
  className,
  bodyClassName,
  isLoading,
}: TransactionFormDialogContentProps) {
  return (
    <DialogContent
      showCloseButton={true}
      className={cn(transactionFormDialogContentClassName, className)}
    >
      <div className="flex max-h-[92dvh] flex-col overflow-hidden">
        <div className="mx-auto mt-3 h-1.5 w-14 rounded-full bg-border/80 sm:hidden" />
        <DialogHeader className="border-b border-border/60 px-5 pt-4 pb-4 text-left sm:px-6">
          <DialogTitle className="text-lg font-semibold tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm leading-6">
            {description}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="min-h-0 flex-1 overscroll-contain">
          <div className={cn("px-4 py-4 sm:px-6", bodyClassName)}>
            {children}
          </div>

          {showCancelButton ? (
            <div className="border-t border-border/60 px-4 py-3 sm:px-6">
              <DialogClose
                className="w-full"
                disabled={isLoading}
                render={
                  <Button
                    variant="outline"
                    className="h-11 w-full rounded-full"
                    disabled={isLoading}
                  >
                    <XIcon className="h-5 w-5" />
                    {cancelLabel}
                  </Button>
                }
              />
            </div>
          ) : null}
        </ScrollArea>
      </div>
    </DialogContent>
  );
}
