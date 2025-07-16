import { cn } from "@/lib/utils";

const HeaderWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn("h-16 border-b flex px-4 gap-4 items-center", className)}
    >
      {children}
    </div>
  );
};

export default HeaderWrapper;
