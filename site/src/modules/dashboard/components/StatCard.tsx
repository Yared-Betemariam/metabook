import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  isLoading?: boolean;
  cpts?: React.ReactNode;
  className?: string;
};

const StatCard = ({ label, value, isLoading, cpts, className }: Props) => {
  if (isLoading) {
    return <div className="bg-zinc-100 h-24 animate-pulse p-4" />;
  }

  return (
    <div className="p-4 flex border flex-col bg-zinc-100 gap-1">
      <span>{label}</span>
      <p className={cn("text-2xl font-medium tracking-tight", className)}>
        {value}
      </p>
      {cpts && cpts}
    </div>
  );
};
export default StatCard;
