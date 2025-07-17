import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  children: React.ReactNode;
  title: string;
  desc?: string;
  headerCpts?: React.ReactNode;
  className?: string;
  subheader?: string;
};

const DPage = ({
  children,
  title,
  desc,
  headerCpts,
  subheader,
  className,
}: Props) => {
  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "flex flex-row items-center justify-between px-6",
          desc ? "h-22" : "h-16"
        )}
      >
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subheader && <span className="text-sm">{subheader}</span>}
          </div>
          {desc && <p className="text-muted-foreground text-sm">{desc}</p>}
        </div>
        {headerCpts}
      </div>
      <div className={cn("flex flex-col h-full flex-1", className)}>
        {children}
      </div>
    </div>
  );
};
export default DPage;
