"use client";

import DPage from "@/modules/dashboard/components/DPage";
import TradingCalendar from "@/modules/trades/components/TradeCalendar";
import { useCalendarTrades } from "@/modules/trades/hooks";

const Page = () => {
  const { data, isLoading, timeString, setTimeString } = useCalendarTrades();

  return (
    <DPage title="Calendar view">
      <TradingCalendar
        trades={data?.data || []}
        isLoading={isLoading}
        timeString={timeString}
        setTimeString={setTimeString}
      />
    </DPage>
  );
};

export default Page;
