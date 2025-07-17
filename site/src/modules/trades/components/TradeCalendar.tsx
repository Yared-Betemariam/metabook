"use client";

import TimeChevron from "@/components/custom/time-chevron";
import { Trade } from "@/db/schema";
import { useTimeStringDate } from "@/hooks/use-timestring-date";
import { formatCurrency } from "@/lib/utils";
import { useMemo } from "react";

interface TradingCalendarProps {
  trades: Trade[];
  isLoading: boolean;
  timeString: string;
  setTimeString: (timeString: string) => void;
}

interface DayStats {
  date: number;
  trades: Trade[];
  totalPnl: number;
  winRate: number;
  longCount: number;
  shortCount: number;
  hasData: boolean;
}

interface WeekStats {
  weekNumber: number;
  totalPnl: number;
  tradingDays: number;
  totalTrades: number;
}

export default function TradingCalendar({
  trades,
  isLoading,
  timeString,
  setTimeString,
}: TradingCalendarProps) {
  // Parse timeString (e.g., "feb-2025" -> February 2025)
  const currentDate = useTimeStringDate(timeString);

  // Filter trades for current month
  const monthTrades = useMemo(() => {
    return trades.filter((trade) => {
      const tradeDate = new Date(trade.date);
      return (
        tradeDate.getMonth() === currentDate.getMonth() &&
        tradeDate.getFullYear() === currentDate.getFullYear()
      );
    });
  }, [trades, currentDate]);

  // Calculate monthly stats
  const monthlyStats = useMemo(() => {
    const totalPnl = monthTrades.reduce(
      (sum, trade) => sum + (trade.pnl || 0),
      0
    );
    const tradingDays = new Set(
      monthTrades.map((trade) => new Date(trade.date).toDateString())
    ).size;

    return { totalPnl, tradingDays };
  }, [monthTrades]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

    const days: (DayStats | null)[] = [];
    const current = new Date(startDate);

    // Generate 6 weeks (42 days)
    for (let i = 0; i < 42; i++) {
      if (current.getMonth() === month) {
        const dayTrades = monthTrades.filter(
          (trade) => new Date(trade.date).getDate() === current.getDate()
        );

        const totalPnl = dayTrades.reduce(
          (sum, trade) => sum + (trade.pnl || 0),
          0
        );
        const wins = dayTrades.filter(
          (trade) => trade.outcome === "win"
        ).length;
        const winRate =
          dayTrades.length > 0 ? (wins / dayTrades.length) * 100 : 0;
        const longCount = dayTrades.filter(
          (trade) => trade.position === "long"
        ).length;
        const shortCount = dayTrades.filter(
          (trade) => trade.position === "short"
        ).length;

        days.push({
          date: current.getDate(),
          trades: dayTrades,
          totalPnl,
          winRate,
          longCount,
          shortCount,
          hasData: dayTrades.length > 0,
        });
      } else {
        days.push(null);
      }
      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [monthTrades, currentDate]);

  // Calculate weekly stats - only for weeks that have days in current month
  const weeklyStats = useMemo(() => {
    const weeks: (WeekStats | null)[] = [];

    for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
      const weekDays = calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7);
      const validDays = weekDays.filter((day) => day !== null) as DayStats[];

      if (validDays.length === 0) {
        weeks.push(null); // No days in this week for current month
        continue;
      }

      const totalPnl = validDays.reduce((sum, day) => sum + day.totalPnl, 0);
      const tradingDays = validDays.filter((day) => day.hasData).length;
      const totalTrades = validDays.reduce(
        (sum, day) => sum + day.trades.length,
        0
      );

      weeks.push({
        weekNumber: weekIndex + 1,
        totalPnl,
        tradingDays,
        totalTrades,
      });
    }

    return weeks;
  }, [calendarDays]);

  return (
    <div className="w-full flex-1 flex flex-col mx-auto bg-white">
      <div className="flex items-center justify-between px-4 pb-1">
        <TimeChevron
          timeString={timeString}
          setTimeString={setTimeString}
          currentDate={currentDate}
        />

        <div className="flex items-center gap-8">
          <div className="text-right flex flex-col -space-y-0.5">
            <div className="text-sm text-gray-500">Net Pnl</div>
            <div className="text-lg font-semibold">
              <span
                className={
                  monthlyStats.totalPnl == 0
                    ? "text-zinc-600"
                    : monthlyStats.totalPnl > 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {formatCurrency(monthlyStats.totalPnl)}
              </span>
            </div>
          </div>

          <div className="text-right flex flex-col -space-y-0.5">
            <div className="text-sm text-gray-500">Trading days</div>
            <div className="text-lg font-semibold text-gray-900">
              {monthlyStats.tradingDays} days
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[7fr_1fr] gap-2 px-4">
        <div className="flex flex-col w-full">
          <div className="grid grid-cols-7 gap-2 not-checked:h-10">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => (
              <div key={index} className="h-fit">
                {day ? (
                  <div
                    className={`min-h-20 h-20 p-1 px-2 rounded-lg border transition-all
                    ${
                      day.hasData
                        ? day.totalPnl >= 0
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                        : "bg-gray-50 border-gray-200"
                    }
                    ${isLoading ? "animate-pulse" : ""}
                  `}
                  >
                    <div className="flex flex-col">
                      <div className="text-sm ml-auto opacity-40 font-medium text-gray-900">
                        {day.date}
                      </div>

                      {day.hasData && !isLoading && (
                        <>
                          <div
                            className={`text-sm font-medium ${
                              day.totalPnl >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {formatCurrency(day.totalPnl)}
                          </div>

                          <div className="text-xs text-gray-600">
                            {day.trades.length} trade
                            {day.trades.length !== 1 ? "s" : ""}
                          </div>

                          {/* <div className="text-xs text-gray-500 mt-auto">
                            {day.winRate.toFixed(0)}% WR
                          </div> */}

                          {/* <div className="text-xs text-gray-500">
                            L:{day.longCount} S:{day.shortCount}
                          </div> */}
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <span />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Analytics Sidebar */}
        <div className="space-y-2 mt-10">
          {weeklyStats.map((week, weekIndex) => {
            if (!week) return null;

            return (
              <div
                key={weekIndex + 1}
                className="min-h-20 h-20 flex flex-col justify-center w-full"
              >
                <div className="text-xs font-medium text-gray-900 mb-1 text-center">
                  Week {week.weekNumber}
                </div>
                {week.totalTrades > 0 ? (
                  <>
                    <div
                      className={`text-lg font-semibold text-center ${
                        week.totalPnl >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(week.totalPnl)}
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      {week.tradingDays} day
                      {week.tradingDays !== 1 ? "s" : ""}
                    </div>
                  </>
                ) : (
                  <div className="text-xs opacity-50 text-center">
                    No trades
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
