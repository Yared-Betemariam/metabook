"use client";

import { ScrollAreaWrapper } from "@/components/custom/scrollarea-wrapper";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Trade } from "@/db/schema";
import { createColumns } from "@/lib/createColumns";
import { getReadableDateRange, truncateString } from "@/lib/utils";
import DPage from "@/modules/dashboard/components/DPage";
import { useConfirmationModalStore } from "@/modules/modals/store";
import { useUserTrades } from "@/modules/trades/hooks";
import { useActiveTradeStore } from "@/modules/trades/store";
import { trpc } from "@/trpc/client";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

const Page = () => {
  const { data, invalidate, isLoading, timeRange, setTimeRange } =
    useUserTrades();
  const pathname = usePathname();
  const router = useRouter();

  const deleteMutation = trpc.trades.delete.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);

        invalidate();

        useConfirmationModalStore.getState().closeModal();
      }
    },
    onError: () => {
      toast.error("Something went wrong! Please try again");

      useConfirmationModalStore.getState().closeModal();
    },
  });

  const columns = createColumns<Trade>({
    includeActions: true,
    extraColumns: [
      {
        accessorKey: "date",
        header: "Date",
        isDate: true,
      },
      { accessorKey: "pair", header: "Pair" },
      {
        accessorKey: "position",
        header: "Position",
        coloring: {
          long: "green",
          short: "red",
        },
      },
      {
        accessorKey: "outcome",
        header: "Outcome",
        coloring: {
          win: "green",
          loss: "red",
        },
      },
      { accessorKey: "pnl", header: "PnL", isPnl: true },
      {
        accessorKey: "chart",
        header: "Chart",
        isLink: true,
      },
      {
        accessorKey: "tags",
        header: "Tags",
        onRender: (tags: string[] | null) =>
          tags?.length ? (
            <ScrollAreaWrapper className="max-w-40 space-x-0.5">
              {tags.map((tag, i) => (
                <Badge className="bg-zinc-300! text-black!" key={i}>
                  {truncateString(tag, 8)}
                </Badge>
              ))}
            </ScrollAreaWrapper>
          ) : (
            <span className="opacity-50">None</span>
          ),
      },
    ],
    actionsItems: [
      {
        title: "Edit",
        onClick: (item) => {
          useActiveTradeStore.getState().updateTrade({ trade: item.original });

          router.push(`${pathname}/edit`);
        },
      },
      {
        title: "View",
        onClick: (item) => {
          useActiveTradeStore.getState().updateTrade({ trade: item.original });

          router.push(`${pathname}/view`);
        },
      },
      {
        title: "Delete",
        onClick: (item) => {
          useConfirmationModalStore.getState().openModal({
            title: "delete this account",
            description: "delete the current account",
            variant: "destructive",
            onClick: async () => {
              deleteMutation.mutate({ id: item.original.id });
              return {
                ok: true,
              };
            },
          });
        },
      },
    ],
  });

  return (
    <DPage subheader={getReadableDateRange(timeRange)} title="Trades List">
      <DataTable
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        onRefresh={() => invalidate()}
        loading={isLoading}
        columns={columns}
        dropdowns={[
          {
            id: "outcome",
            label: "Outcome",
            options: [
              { value: "win", label: "Win" },
              { value: "loss", label: "Loss" },
            ],
          },
          {
            id: "position",
            label: "Position",
            options: [
              { value: "long", label: "Long" },
              { value: "short", label: "Short" },
            ],
          },
        ]}
        data={data?.data || []}
      />
    </DPage>
  );
};

export default Page;
