"use client";

import { Info } from "lucide-react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

interface Trade {
  id: number;
  user_id: number;
  account_id: number;
  pair: string;
  date: Date;
  position: string;
  outcome: string | null;
  pnl: number | null;
  chart: string | null;
  notes: string | null;
  tags: string[] | null;
}

interface PnlGraphComponentProps {
  data: Trade[];
  isLoading: boolean;
}

interface DailyPnl {
  date: string;
  pnl: number;
  formattedDate: string;
  fill: string;
}

export default function PnlGraphComponent({
  data,
  isLoading,
}: PnlGraphComponentProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Group trades by date and sum PnL
    const dailyPnlMap = new Map<string, number>();

    data.forEach((trade) => {
      if (trade.pnl !== null) {
        const dateKey = trade.date.toISOString().split("T")[0]; // YYYY-MM-DD format
        const currentPnl = dailyPnlMap.get(dateKey) || 0;
        dailyPnlMap.set(dateKey, currentPnl + trade.pnl);
      }
    });

    // Convert to array and sort by date
    const dailyPnlArray: DailyPnl[] = Array.from(dailyPnlMap.entries())
      .map(([dateStr, pnl]) => ({
        date: dateStr,
        pnl: pnl,
        formattedDate: new Date(dateStr).toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        }),
        fill: pnl >= 0 ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)",
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return dailyPnlArray;
  }, [data]);

  const maxAbsValue = useMemo(() => {
    if (chartData.length === 0) return 100;
    const maxPnl = Math.max(...chartData.map((d) => Math.abs(d.pnl)));
    return Math.ceil(maxPnl / 50) * 50; // Round up to nearest 50
  }, [chartData]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            Net Daily P&L
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            Net Daily P&L
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No trading data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full pb-0">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          Net Daily P&L
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={{
            pnl: {
              label: "P&L",
            },
          }}
          className="h-[300px] max-w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="formattedDate"
                className="w-4 rounded-none!"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: "hsl(var(--muted-foreground))",
                }}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: "hsl(var(--muted-foreground))",
                }}
                domain={[-maxAbsValue, maxAbsValue]}
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as DailyPnl;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
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
                              P&L
                            </span>
                            <span
                              className={`font-bold ${
                                data.pnl >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              ${data.pnl.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="pnl"
                className=" brightness-90"
                maxBarSize={16}
                radius={[0, 0, 0, 0]}
                fill={(entry) => entry.fill}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
