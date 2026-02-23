import { Button } from "~/components/ui/button";
import { Check, CornerRightUpIcon, Loader2, X } from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "~/components/ui/tooltip";
import AddTransactionButton from "~/components/transactions/list/add-transaction-button";

interface BalanceEditorActionsProps {

}

export function BalanceActions({}: BalanceEditorActionsProps) {
  return (
  <div className={'flex justify-center items-center gap-2 mt-4'}>

    <AddTransactionButton customTrigger={
        <Button size={'icon'} className={'rounded-full'}>
          <CornerRightUpIcon />
        </Button>
    } />
  </div>
  );
}
