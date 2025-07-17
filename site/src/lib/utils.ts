import { Trade } from "@/db/schema";
import { BalanceByDate, TimeRange } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getReadableDateRange(range: TimeRange): string {
  const now = new Date();

  const formatFull = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatShort = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  if (range === "today") {
    return `For today ${formatFull(now)}`;
  }

  if (range === "week") {
    const day = now.getDay(); // 0 (Sun) - 6 (Sat)
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const diffToSunday = day === 0 ? 0 : 7 - day;

    const start = new Date(now);
    const end = new Date(now);
    start.setDate(now.getDate() + diffToMonday);
    end.setDate(now.getDate() + diffToSunday);

    return `This Week, from ${formatShort(start)} to ${formatShort(
      end
    )}, ${start.getFullYear()}`;
  }

  if (range === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return `This Month, from ${formatShort(start)} to ${formatShort(
      end
    )}, ${start.getFullYear()}`;
  }

  return "Showing all available datas";
}

export const truncateString = (str: string, num: number) => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
};

export const monthsList = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

export function convertToUniversalDate(localDate: Date): Date {
  const year = localDate.getFullYear();
  const month = localDate.getMonth();
  const day = localDate.getDate();

  const utcTimeValue = Date.UTC(year, month, day);

  return new Date(utcTimeValue);
}

export function calculateNetPnL(trades: Trade[]): number {
  return trades.reduce((total, trade) => {
    return total + (trade.pnl ?? 0); // Add 0 if pnl is null
  }, 0);
}

export function calculateWinRate(trades: Trade[]) {
  let wins = 0;
  let losses = 0;

  for (const trade of trades) {
    if (trade.outcome === "win") wins++;
    else if (trade.outcome === "loss") losses++;
  }

  const total = wins + losses;
  const winRate = total > 0 ? parseFloat(((wins / total) * 100).toFixed(2)) : 0;

  return {
    winRate,
    wins,
    losses,
  };
}

export function getWinningPair(trades: Trade[]) {
  const stats: Record<string, { wins: number; losses: number }> = {};

  for (const trade of trades) {
    if (!trade.outcome || !trade.pair) continue;

    if (!stats[trade.pair]) {
      stats[trade.pair] = { wins: 0, losses: 0 };
    }

    if (trade.outcome === "win") {
      stats[trade.pair].wins++;
    } else if (trade.outcome === "loss") {
      stats[trade.pair].losses++;
    }
  }

  let winningPair: string | null = null;
  let maxWins = -1;

  for (const pair in stats) {
    if (stats[pair].wins > maxWins) {
      maxWins = stats[pair].wins;
      winningPair = pair;
    }
  }

  if (winningPair) {
    return {
      pair: winningPair,
      wins: stats[winningPair].wins,
      losses: stats[winningPair].losses,
    };
  }

  return {
    pair: undefined,
    wins: 0,
    losses: 0,
  }; // No trades with wins
}

export const formatCurrency = (amount: number) => {
  const absAmount = Math.abs(amount);
  const sign = amount > 0 ? "+" : amount < 0 ? "-" : "";

  if (absAmount < 1000) {
    // 2-3 digits: show as is
    return `${sign}$${absAmount}`;
  } else if (absAmount < 1_000_000) {
    // 4-6 digits: show in K format
    const kValue = absAmount / 1000;
    return `${sign}$${kValue.toFixed(1)}K`;
  } else if (absAmount < 1_000_000_000) {
    // 7-9 digits: show in M format
    const mValue = absAmount / 1_000_000;
    return `${sign}$${mValue.toFixed(1)}M`;
  } else {
    // 10+ digits: show in B format
    const bValue = absAmount / 1_000_000_000;
    return `${sign}$${bValue.toFixed(1)}B`;
  }
};

export function calculateHistoricalBalances(
  trades: Trade[],
  currentBalance: number
): BalanceByDate[] {
  // 1. Group PnL by date
  const pnlByDate: Record<string, number> = {};

  for (const trade of trades) {
    if (trade.pnl === null || isNaN(trade.pnl)) continue;
    const dateKey = trade.date.toISOString().split("T")[0];
    pnlByDate[dateKey] = (pnlByDate[dateKey] ?? 0) + trade.pnl;
  }

  // 2. Sort dates ascending (oldest to newest)
  const sortedDates = Object.keys(pnlByDate).sort();

  // 3. Walk from newest to oldest and compute balances
  const result: BalanceByDate[] = [];
  let balance = currentBalance;

  for (let i = sortedDates.length - 1; i >= 0; i--) {
    const dateStr = sortedDates[i];
    const date = new Date(dateStr);
    result.unshift({ date, balance }); // Insert at start
    balance -= pnlByDate[dateStr]; // Subtract PnL for that day
  }

  return result;
}
