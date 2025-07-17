"use client";

import TradingCalendar from "@/modules/trades/components/TradeCalendar";
import { useCalendarTrades } from "@/modules/trades/hooks";

const Page = () => {
  const { data, isLoading, timeString, setTimeString } = useCalendarTrades();

  return (
    <TradingCalendar
      trades={data?.data || []}
      isLoading={isLoading}
      timeString={timeString}
      setTimeString={setTimeString}
    />
  );
};

export default Page;
