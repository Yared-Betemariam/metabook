import { TimeRange } from "@/types";
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
