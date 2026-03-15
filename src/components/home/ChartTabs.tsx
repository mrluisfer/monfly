import { transactionTypes } from "~/constants/transaction-types";
import { BanknoteArrowDownIcon, BanknoteArrowUpIcon } from "lucide-react";

import ChartByCategoryRadar from "../charts/ChartByCategoryRadar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export const ChartTabs = () => {
  return (
    <Tabs defaultValue={transactionTypes.EXPENSE}>
      <TabsList className="finance-panel grid w-full auto-rows-fr grid-cols-2 rounded-[1.4rem] p-1 group-data-horizontal/tabs:!h-auto">
        <TabsTrigger
          value={transactionTypes.EXPENSE}
          className="h-auto min-h-11 gap-2 rounded-[1.1rem] px-3 py-2.5 capitalize"
        >
          <BanknoteArrowDownIcon className="text-destructive" />
          {transactionTypes.EXPENSE}
        </TabsTrigger>
        <TabsTrigger
          value={transactionTypes.INCOME}
          className="h-auto min-h-11 gap-2 rounded-[1.1rem] px-3 py-2.5 capitalize"
        >
          <BanknoteArrowUpIcon className="text-primary" />
          {transactionTypes.INCOME}
        </TabsTrigger>
      </TabsList>
      <TabsContent value={transactionTypes.EXPENSE}>
        <ChartByCategoryRadar type={transactionTypes.EXPENSE} />
      </TabsContent>
      <TabsContent value={transactionTypes.INCOME}>
        <ChartByCategoryRadar type={transactionTypes.INCOME} />
      </TabsContent>
    </Tabs>
  );
};
