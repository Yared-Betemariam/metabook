import { cn } from "@/lib/utils";
import {
  ScrollArea,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@radix-ui/react-scroll-area";
// import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export const ScrollAreaWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <ScrollArea>
      <ScrollAreaViewport className={cn(className)}>
        {children}
      </ScrollAreaViewport>
      <ScrollAreaScrollbar orientation="horizontal">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
      <ScrollAreaScrollbar orientation="vertical">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
      <ScrollAreaCorner />
    </ScrollArea>
    // <ScrollArea className={cn(className)}>
    //   {children}
    //   <ScrollBar />
    // </ScrollArea>
  );
};
