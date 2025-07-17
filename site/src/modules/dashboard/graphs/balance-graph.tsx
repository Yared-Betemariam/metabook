"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

type BalanceByDate = {
  date: Date;
  balance: number;
};

interface AdvancedBalanceGraphProps {
  data: BalanceByDate[];
  isLoading: boolean;
}

interface ChartDataPoint {
  date: string;
  balance: number;
  formattedDate: string;
  aboveStart: number;
  belowStart: number;
}

export default function AdvancedBalanceGraph({
  data,
  isLoading,
}: AdvancedBalanceGraphProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const sortedData = data
      .map((item) => ({
        date: item.date.toISOString().split("T")[0],
        balance: item.balance,
        formattedDate: item.date.toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        }),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (sortedData.length === 0) return [];

    const startBalance = sortedData[0].balance;

    return sortedData.map((item) => ({
      ...item,
      aboveStart: item.balance >= startBalance ? item.balance : startBalance,
      belowStart: item.balance < startBalance ? item.balance : startBalance,
    }));
  }, [data]);

  const balanceStats = useMemo(() => {
    if (chartData.length === 0) return null;

    const startBalance = chartData[0].balance;
    const endBalance = chartData[chartData.length - 1].balance;
    const change = endBalance - startBalance;
    const changePercent =
      startBalance !== 0 ? (change / startBalance) * 100 : 0;
    const maxBalance = Math.max(...chartData.map((d) => d.balance));
    const minBalance = Math.min(...chartData.map((d) => d.balance));

    return {
      startBalance,
      endBalance,
      change,
      changePercent,
      maxBalance,
      minBalance,
      isPositive: change >= 0,
    };
  }, [chartData]);

  const yAxisDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 1000];

    const balances = chartData.map((d) => d.balance);
    const min = Math.min(...balances);
    const max = Math.max(...balances);
    const padding = (max - min) * 0.1 || 100;

    return [Math.max(0, min - padding), max + padding];
  }, [chartData]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">
            Account Balance
          </CardTitle>
          <Skeleton className="h-4 w-20" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">
            Account Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center text-muted-foreground">
            No balance data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full pb-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Account Balance</CardTitle>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Change</p>
          {balanceStats && (
            <div className="flex items-center gap-2 text-sm">
              {balanceStats.isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span
                className={
                  balanceStats.isPositive ? "text-green-600" : "text-red-600"
                }
              >
                {balanceStats.isPositive ? "+" : ""}$
                {balanceStats.change.toFixed(2)} (
                {balanceStats.changePercent.toFixed(1)}%)
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={{
            balance: {
              label: "Balance",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px] max-w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 0, left: 12, right: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorGain" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(142, 76%, 36%)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(142, 76%, 36%)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(0, 84%, 60%)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(0, 84%, 60%)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="formattedDate"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                domain={yAxisDomain}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              {balanceStats && (
                <ReferenceLine
                  y={balanceStats.startBalance}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="2 2"
                  strokeOpacity={0.7}
                />
              )}
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as ChartDataPoint;
                    const isAboveStart = balanceStats
                      ? data.balance >= balanceStats.startBalance
                      : true;
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Date
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {data.formattedDate}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Balance
                            </span>
                            <span
                              className={`font-bold ${
                                isAboveStart ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              ${data.balance.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Area for gains (above starting balance) */}
              <Area
                type="monotone"
                dataKey="aboveStart"
                stroke={
                  (balanceStats?.endBalance || 0) <
                  (balanceStats?.startBalance || 0)
                    ? "hsl(0, 84%, 60%)"
                    : "hsl(142, 76%, 36%)"
                }
                strokeWidth={2}
                fill="url(#colorGain)"
                fillOpacity={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
