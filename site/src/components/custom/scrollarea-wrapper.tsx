import { cn } from "@/lib/utils";
import {
  Corner,
  Root,
  Scrollbar,
  Thumb,
  Viewport,
} from "@radix-ui/react-scroll-area";

export const ScrollAreaWrapper = ({
  children,
  className,
  scrollRef,
}: {
  children: React.ReactNode;
  className?: string;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <Root className="ScrollAreaRoot">
      <Viewport ref={scrollRef} className={cn("ScrollAreaViewport", className)}>
        {children}
      </Viewport>
      <Scrollbar
        className="ScrollAreaScrollbar rounded-full w-[10px] bg-zinc-900/10 p-[1.5px] py-[2.5px] mr-[1px]"
        orientation="vertical"
      >
        <Thumb className="ScrollAreaThumb bg-zinc-900/25 rounded-full" />
      </Scrollbar>
      <Scrollbar
        className="ScrollAreaScrollbar rounded-full h-[8px] bg-zinc-900/5 p-[1.5px] px-[2.5px]"
        orientation="horizontal"
      >
        <Thumb className="ScrollAreaThumb bg-zinc-900 rounded-full" />
      </Scrollbar>
      <Corner className="ScrollAreaCorner" />
    </Root>
  );
};
