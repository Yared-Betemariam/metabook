"use client";

import Dropdown from "@/components/custom/dropdown";
import FormButton, {
  DatePicker,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAccountId } from "@/modules/accounts/hooks";
import PageWrapper from "@/modules/dashboard/components/PageWrapper";
import { TradeFormValues, tradeSchema } from "@/schemas";
import { trpc } from "@/trpc/client";
import { TradeState } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCalendarTrades, useUserTrades } from "../hooks";
import { useActiveTradeStore } from "../store";
import { PairDropdown } from "./PairDropdown";
import { RichTextEditor } from "./RichTextEditor";
import { TagsEditor } from "./TagsEditor";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { convertToUniversalDate } from "@/lib/utils";

type Props = {
  state: TradeState;
};

export const TradeComponent = ({ state }: Props) => {
  const { invalidate } = useUserTrades();
  const { invalidate: invalidateCalendar } = useCalendarTrades();
  const { trade, updateTrade } = useActiveTradeStore();
  const accountId = useAccountId();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const utils = trpc.useUtils();

  const createMutation = trpc.trades.create.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);

        invalidate();

        router.back();

        if (data.data.pnl) {
          utils.accounts.invalidate();

          invalidateCalendar();
        }

        form.reset();
      }
    },
    onError: () => {
      toast.error("Something went wrong! Please try again");
    },
  });

  const updateMutation = trpc.trades.edit.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);

        invalidate();

        if (data.data.pnl && trade?.pnl && data.data.pnl !== trade.pnl) {
          utils.accounts.invalidate();

          invalidateCalendar();
        }

        updateTrade({ trade: data.data });
      }
    },
    onError: () => {
      toast.error("Something went wrong! Please try again");
    },
  });

  const form = useForm<TradeFormValues>({
    resolver: zodResolver(tradeSchema),
    reValidateMode: "onSubmit",
    defaultValues:
      state !== "create"
        ? {
            account_id: trade?.account_id || accountId || 0,
            pair: trade?.pair || "",
            date: trade?.date
              ? new Date(trade.date)
              : convertToUniversalDate(new Date()),
            position: trade?.position || "",
            outcome: trade?.outcome ?? "",
            pnl: trade?.pnl ? trade.pnl.toString() : undefined,
            chart: trade?.chart ?? "",
            notes: trade?.notes ?? "",
            tags: trade?.tags ?? [],
          }
        : {
            date: convertToUniversalDate(new Date()),
            notes: "",
            outcome: "",
            pnl: "",
            pair: "",
            position: "",
            tags: [],
            chart: "",
          },
  });

  const onSubmit = (values: TradeFormValues) => {
    let pnlValue = values.pnl;

    if (values.outcome === "loss" && pnlValue) {
      const num = Math.abs(Number(pnlValue));
      pnlValue = (-num).toString();
    } else if (values.outcome === "win" && pnlValue) {
      const num = Math.abs(Number(pnlValue));
      pnlValue = num.toString();
    }

    if (trade && state == "edit") {
      updateMutation.mutate({
        ...values,
        id: trade.id,
        chart: values.chart || undefined,
        outcome: values.outcome || undefined,
        pnl: pnlValue || undefined,
        prevPnl: trade?.pnl?.toString() || undefined,
      });
    } else {
      createMutation.mutate({
        ...values,
        chart: values.chart || undefined,
        outcome: values.outcome || undefined,
        pnl: pnlValue || undefined,
      });
    }
  };

  useEffect(() => {
    if (accountId) {
      form.setValue("account_id", accountId);
    }
  }, [accountId]);

  useEffect(() => {
    if (state !== "create" && !trade) {
      router.push(`/dashboard/${accountId}/trades/create`);
    }
  }, [state]);

  return (
    <PageWrapper
      backButton
      title={
        trade && state == "edit"
          ? "Update trade"
          : state == "view"
          ? "Trade details"
          : "Add trade"
      }
      description={
        trade && state == "edit"
          ? "Update trade details"
          : state == "view"
          ? "View details of the current trade"
          : "Add a new trade to your lists"
      }
      headerCpts={
        <>
          {state == "view" && (
            <FormButton
              small
              onClick={() => router.push(`/dashboard/${accountId}/trades/edit`)}
              label={"Edit"}
            />
          )}
          {state !== "view" && (
            <FormButton
              small
              onClick={() => formRef.current?.requestSubmit()}
              label={
                updateMutation.isPending || createMutation.isPending
                  ? trade && state == "edit"
                    ? "Saving"
                    : "Adding"
                  : trade && state == "edit"
                  ? "Save"
                  : "Add"
              }
              loading={updateMutation.isPending || createMutation.isPending}
            />
          )}
        </>
      }
    >
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 py-4 pb-12"
        >
          <div className="px-6 flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div className="grid gap-3 grid-cols-3">
                <FormField
                  control={form.control}
                  name="pair"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pair</FormLabel>
                      <FormControl>
                        <PairDropdown
                          disabled={state == "view"}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Dropdown
                          disabled={state == "view"}
                          options={[
                            { value: "long", label: "Buy" },
                            { value: "short", label: "Sell" },
                          ]}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="outcome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Outcome</FormLabel>
                      <FormControl>
                        <Dropdown
                          options={[
                            { value: "win", label: "Win" },
                            { value: "loss", label: "Loss" },
                          ]}
                          disabled={state == "view"}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-3 grid-cols-2">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          disabled={state == "view"}
                          value={field.value.toISOString()}
                          onChange={(e) => field.onChange(new Date(e as Date))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pnl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PNL ($)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Profit/Loss"
                          disabled={state == "view"}
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="chart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Chart URL{" "}
                      {state == "view" && field.value && (
                        <Link
                          target="_blank"
                          href={field.value}
                          className="underline flex font-medium underline-offset-2 text-blue-600 hover:opacity-80 cursor-pointer duration-200 transition-all items-center gap-0.5"
                        >
                          link
                          <ExternalLink className="size-4" />
                        </Link>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={state == "view"}
                        placeholder="Chart URL"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <TagsEditor
                        disabled={state == "view"}
                        value={field.value || []}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:w-[60%] space-y-4">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">Notes</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        disabled={state == "view"}
                        placeholder="Notes about your trade..."
                        content={field.value || ""}
                        onChange={(e) => field.onChange(e ? e : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </PageWrapper>
  );
};

export default TradeComponent;
