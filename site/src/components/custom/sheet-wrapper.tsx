import { useIsMobile } from "@/hooks/use-mobile";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface SheetWrapperProps {
  side?: "bottom" | "left" | "right";
  open: boolean;
  onOpen: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

const SheetWrapper: React.FC<SheetWrapperProps> = ({
  side = "right",
  open,
  onOpen,
  title,
  description,
  children,
}) => {
  const isMobile = useIsMobile();
  return (
    <Sheet open={open} onOpenChange={onOpen}>
      <SheetContent
        side={isMobile ? "bottom" : side}
        className={cn("space-y-0 gap-4", isMobile && "max-h-[90vh]")}
      >
        <SheetHeader className="border-b p-8">
          <SheetTitle className="text-xl">{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="px-8 pb-10 md:pb-12 overflow-auto">{children}</div>
      </SheetContent>
    </Sheet>
  );
};

export default SheetWrapper;
