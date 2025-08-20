import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { DataNotFoundPlaceholder } from "~/components/data-not-found-placeholder";
import { Label } from "~/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { Switch } from "~/components/ui/switch";
import { SidebarRouteUrl } from "~/constants/sidebar-routes";
import { TransactionHoverProvider } from "~/context/transaction-hover-provider";
import { useRouteUser } from "~/hooks/use-route-user";
import { useTransactionHoverContext } from "~/hooks/use-transaction-hover-context";
import { getTransactionByEmailServer } from "~/lib/api/transaction/get-transaction-by-email.server";
import { queryDictionary } from "~/queries/dictionary";

import Card from "../../card";
import AddTransactionButton from "./add-transaction-button";
import TransactionItem from "./transaction-item";

const PAGE_SIZE = 6;

export default function TransactionsList() {
  const userEmail = useRouteUser();
  const [page, setPage] = useState<number>(1);
  const location = useLocation().pathname;
  const isOnTransactionsPage = location.includes(SidebarRouteUrl.TRANSACTIONS);

  const { data, isPending, error } = useQuery({
    queryKey: [queryDictionary.transactions, userEmail, page],
    queryFn: () =>
      getTransactionByEmailServer({
        data: {
          email: userEmail,
          page,
          pageSize: PAGE_SIZE,
        },
      }),
    enabled: !!userEmail,
  });

  // Safe defaults if data is undefined
  const transactions = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const pagesArray = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  return (
    <TransactionHoverProvider>
      <Card
        title={
          <div className="flex items-center gap-2 justify-between">
            <p>Transactions</p>
            <div className="flex items-center gap-6">
              <DisableHoverInfo />
              {isOnTransactionsPage ? null : <AddTransactionButton />}
            </div>
          </div>
        }
        subtitle={`You made ${total} transactions`}
        className="h-[600px]"
        cardContentProps={{
          className: "h-full",
        }}
      >
        <div className="flex flex-col h-full justify-between">
          {isPending && <div>Loading...</div>}
          {error && <div>Error: {error.message}</div>}
          {transactions.length > 0 ? (
            <div className="flex flex-col gap-4">
              {transactions.map((transaction) => (
                <div key={transaction.id}>
                  <TransactionItem transaction={transaction} />
                </div>
              ))}
            </div>
          ) : (
            !isPending && (
              <DataNotFoundPlaceholder>
                No transactions found.
              </DataNotFoundPlaceholder>
            )
          )}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  aria-disabled={page === 1}
                  tabIndex={page === 1 ? -1 : 0}
                />
              </PaginationItem>
              {pagesArray.map((pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    isActive={pageNum === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(pageNum);
                    }}
                    href="#"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {totalPages > 5 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) setPage(page + 1);
                  }}
                  aria-disabled={page === totalPages}
                  tabIndex={page === totalPages ? -1 : 0}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>
    </TransactionHoverProvider>
  );
}

const id = "disable-hover";
function DisableHoverInfo() {
  const { disableHover, setDisableHover } = useTransactionHoverContext();

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={id}
        checked={disableHover}
        onCheckedChange={(checked) => {
          setDisableHover(checked);
          localStorage.setItem(id, String(checked));
        }}
      />
      <Label htmlFor={id}>Transaction Details</Label>
    </div>
  );
}
