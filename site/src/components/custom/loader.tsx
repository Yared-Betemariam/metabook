import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";

const Loader = ({ shaded }: { shaded?: boolean }) => {
  return (
    <div
      className={cn(
        "flex flex-col flex-1 items-center text-muted-foreground gap-2 justify-center text-center ",
        {
          "bg-zinc-100": shaded,
          "my-auto mx-auto": !shaded,
        }
      )}
    >
      {/* <Circle className=" absolute inset-0 opacity-25" /> */}
      <LoaderIcon className="size-6 animate-spin duration-[1.5s] transition-all" />
      <span className="text-sm">Loading...</span>
    </div>
  );
};
export default Loader;
