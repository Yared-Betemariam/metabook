import { trpc } from "@/trpc/client";
import { useParams } from "next/navigation";
import { useTimeRangeStore } from "../store";
import { useState } from "react";
import { format } from "date-fns";

export const useUserTrades = () => {
  const { id } = useParams<{ id: string }>();
  const { timeRange, setTimeRange } = useTimeRangeStore();
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.trades.user.useQuery({
    account_id: Number(id),
    timeRange,
  });

  const invalidate = () =>
    utils.trades.user.invalidate({ account_id: Number(id), timeRange });

  return {
    data,
    isLoading,
    invalidate,
    timeRange,
    setTimeRange,
  };
};

export const useCalendarTrades = () => {
  const { id } = useParams<{ id: string }>();
  const [timeString, setTimeString] = useState(
    format(new Date(), "MMM-yyyy").toLowerCase()
  );
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.trades.calendar.useQuery({
    account_id: Number(id),
    timeString,
  });

  const invalidate = () =>
    utils.trades.calendar.invalidate({ account_id: Number(id), timeString });

  return {
    data,
    isLoading,
    invalidate,
    timeString,
    setTimeString,
  };
};
