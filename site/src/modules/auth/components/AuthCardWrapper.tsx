"use client";

import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Social from "./Social";
import Heading from "./Heading";

interface CardWrapperProps {
  children?: React.ReactNode;
  headerLabel: string;
  showSocial?: boolean;
  hideChildren?: boolean;
  center?: boolean;
}

const CardWrapper = ({
  children,
  headerLabel,
  center,
  showSocial,
  hideChildren,
}: CardWrapperProps) => {
  return (
    <div className="flex flex-col relative bg-gradient-to-tr max-w-[528px] gap-4 w-full py-4 px-2">
      <CardHeader>
        <Heading center={center} label={headerLabel} />
      </CardHeader>
      {!hideChildren && (
        <CardContent className="flex-1 mb-4">{children}</CardContent>
      )}
      <div className="border-b" />
      {showSocial && (
        <CardFooter className="pb-4">
          <Social />
        </CardFooter>
      )}
    </div>
  );
};
export default CardWrapper;
