import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface DialogWrapperProps {
  open: boolean;
  onOpen: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const DialogWrapper: React.FC<DialogWrapperProps> = ({
  open,
  onOpen,
  title,
  description,
  className,
  children,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogContent className={cn("space-y-0 gap-4 p-0", className)}>
        <DialogHeader className="border-b p-6">
          <DialogTitle className="text-3xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="overflow-auto px-6 pb-6">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogWrapper;
