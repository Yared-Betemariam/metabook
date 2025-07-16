import { Trade } from "@/db/schema";
import { TimeRange } from "@/types";
import { create } from "zustand";

interface ActiveTradeStore {
  trade: undefined | Trade;
  updateTrade: (opts: { trade?: Trade }) => void;
}

export const useActiveTradeStore = create<ActiveTradeStore>((set) => ({
  trade: undefined,
  updateTrade: ({ trade }) => {
    set({ trade });
  },
}));

interface TimeRangeStore {
  timeRange: TimeRange;
  setTimeRange: (timeRange: TimeRange) => void;
}

export const useTimeRangeStore = create<TimeRangeStore>((set) => ({
  timeRange: "today",
  setTimeRange: (timeRange) => {
    set({ timeRange });
  },
}));
