import { monthsList } from "@/lib/utils";
import { useMemo } from "react";

export const useTimeStringDate = (timeString: string) => {
  const date = useMemo(() => {
    const [monthStr, yearStr] = timeString.split("-");
    const monthIndex = monthsList.indexOf(monthStr.toLowerCase());
    return new Date(Number.parseInt(yearStr), monthIndex, 1);
  }, [timeString]);

  return date;
};
