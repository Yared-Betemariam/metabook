import { cn } from "@/lib/utils";
import { RiLoader5Fill } from "react-icons/ri";

type SimpleLoaderProps = {
  className?: string;
};

const SimpleLoader = ({ className }: SimpleLoaderProps) => {
  return (
    <span
      className={cn(
        "flex items-center gap-2 opacity-60 my-auto mx-auto",
        className
      )}
    >
      <RiLoader5Fill className="size-5 animate-spin" /> Loading...
    </span>
  );
};
export default SimpleLoader;
