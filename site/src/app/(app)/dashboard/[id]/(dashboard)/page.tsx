"use client";

import TimeChevron from "@/components/custom/time-chevron";
import { useTimeStringDate } from "@/hooks/use-timestring-date";
import {
  calculateHistoricalBalances,
  calculateNetPnL,
  calculateWinRate,
  formatCurrency,
  getWinningPair,
} from "@/lib/utils";
import { useActiveAccount } from "@/modules/accounts/hooks";
import DPage from "@/modules/dashboard/components/DPage";
import StatCard from "@/modules/dashboard/components/StatCard";
import AdvancedBalanceGraph from "@/modules/dashboard/graphs/balance-graph";
import PnlGraphComponent from "@/modules/dashboard/graphs/pnl-graph";
import { useCalendarTrades } from "@/modules/trades/hooks";
import { useMemo } from "react";

const Dashboard = () => {
  const { timeString, setTimeString, data, isLoading } = useCalendarTrades();
  const date = useTimeStringDate(timeString);
  const account = useActiveAccount();

  const historicalBalance = useMemo(
    () => calculateHistoricalBalances(data?.data || [], account?.balance || 0),
    [account, data]
  );

  const stats = useMemo(() => {
    if (!data?.data) {
      return null;
    }

    const netpnl = calculateNetPnL(data.data);
    const {
      pair,
      wins: pairWins,
      losses: pairLosses,
    } = getWinningPair(data.data);
    const { winRate, wins, losses } = calculateWinRate(data.data);

    return {
      netpnl,
      pair,
      pairWins,
      pairLosses,
      wins,
      losses,
      winRate,
      historicalBalance,
    };
  }, [data]);

  return (
    <DPage className="px-6 pb-6" title="Analytics dashboard">
      <div className="flex items-end mb-2 justify-between">
        <span>Performace stats</span>
        <TimeChevron
          timeString={timeString}
          setTimeString={setTimeString}
          currentDate={date}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {/* stat cards */}
        <StatCard
          label="Win Rate (WR)"
          isLoading={isLoading}
          value={stats?.winRate ? `${stats.winRate}%` : "0%"}
          cpts={
            <span className="text-sm">{data?.data.length || 0} trades</span>
          }
        />
        <StatCard
          label="Net Pnl"
          className={
            stats?.netpnl && stats.netpnl !== 0
              ? stats.netpnl > 0
                ? "text-green-700"
                : "text-red-700"
              : undefined
          }
          isLoading={isLoading}
          value={stats?.netpnl ? formatCurrency(stats.netpnl) : "$0"}
          cpts={
            <p className="text-sm">
              <span className="text-green-700 font-medium">
                {stats?.wins || 0}
              </span>{" "}
              wins,{" "}
              <span className="text-red-700 font-medium">
                {stats?.losses || 0}
              </span>{" "}
              losses
            </p>
          }
        />
        <StatCard
          label="Winning pair"
          isLoading={isLoading}
          value={stats?.pair || "None"}
          cpts={
            <p className="text-sm">
              <span className="text-green-700 font-medium">
                {stats?.pairWins || 0}
              </span>{" "}
              wins,{" "}
              <span className="text-red-700 font-medium">
                {stats?.pairLosses || 0}
              </span>{" "}
              losses
            </p>
          }
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <PnlGraphComponent data={data?.data || []} isLoading={isLoading} />
        <AdvancedBalanceGraph data={historicalBalance} isLoading={isLoading} />
      </div>
    </DPage>
  );
};

export default Dashboard;
