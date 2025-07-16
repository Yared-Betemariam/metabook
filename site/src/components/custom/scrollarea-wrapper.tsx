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
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Root className="ScrollAreaRoot">
      <Viewport className={cn("ScrollAreaViewport", className)}>
        {children}
      </Viewport>
      <Scrollbar
        className="ScrollAreaScrollbar rounded-full w-[8px] bg-zinc-900/5 p-[1px] py-[2.5px]"
        orientation="vertical"
      >
        <Thumb className="ScrollAreaThumb bg-zinc-900/25 rounded-full" />
      </Scrollbar>
      <Scrollbar
        className="ScrollAreaScrollbar rounded-full h-[8px] bg-zinc-900/5 p-[1px] px-[2.5px]"
        orientation="horizontal"
      >
        <Thumb className="ScrollAreaThumb bg-zinc-900 rounded-full" />
      </Scrollbar>
      <Corner className="ScrollAreaCorner" />
    </Root>
  );
};
