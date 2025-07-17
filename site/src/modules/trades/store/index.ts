import { Trade } from "@/db/schema";
import { TimeRange } from "@/types";
import { format } from "date-fns";
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

interface TimeStringStore {
  timeString: string;
  setTimeString: (timeString: string) => void;
}

export const useTimeStringStore = create<TimeStringStore>((set) => ({
  timeString: format(new Date(), "MMM-yyyy").toLowerCase(),
  setTimeString: (timeString) => {
    set({ timeString });
  },
}));
