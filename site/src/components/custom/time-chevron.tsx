import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

type Props = {
  timeString: string;
  setTimeString: (timeString: string) => void;
  currentDate: Date;
};

const TimeChevron = ({ timeString, setTimeString, currentDate }: Props) => {
  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const navigateMonth = (direction: "prev" | "next") => {
    const [monthStr, yearStr] = timeString.split("-");
    const monthNames = [
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
    const currentMonthIndex = monthNames.indexOf(monthStr.toLowerCase());
    const currentYear = Number.parseInt(yearStr);

    let newMonthIndex =
      direction === "next" ? currentMonthIndex + 1 : currentMonthIndex - 1;
    let newYear = currentYear;

    if (newMonthIndex > 11) {
      newMonthIndex = 0;
      newYear++;
    } else if (newMonthIndex < 0) {
      newMonthIndex = 11;
      newYear--;
    }

    setTimeString(`${monthNames[newMonthIndex]}-${newYear}`);
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        size={"icon"}
        variant={"outline"}
        onClick={() => navigateMonth("prev")}
        className="size-5 border-dashed rounded-full hover:bg-zinc-100 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <h1 className="text-lg font-medium text-zinc-900 text-center">
        {monthName}
      </h1>

      <Button
        size={"icon"}
        variant={"outline"}
        onClick={() => navigateMonth("next")}
        className="size-5 border-dashed rounded-full hover:bg-zinc-100 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
};
export default TimeChevron;
