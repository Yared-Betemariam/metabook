"use client";

import Logo from "@/components/Logo";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import AccountsButton from "@/modules/accounts/components/AccountsButton";
import UserButton from "@/modules/auth/components/UserButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import HeaderWrapper from "./HeaderWrapper";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { useAccountId } from "@/modules/accounts/hooks";
import { format } from "date-fns";

const links = [
  {
    name: "Dashboard",
    id: "dashboard",
    path: "/",
  },
  {
    name: "Trades",
    id: "trades",
    path: "/trades",
  },
  {
    name: "Calendar",
    id: "calendar",
    path: "/calendar",
  },
];

type Props = {
  children: React.ReactNode;
};

const ResizableWrapper = ({ children }: Props) => {
  const pathname = usePathname();
  const accountId = useAccountId();

  return (
    <ResizablePanelGroup
      id="wrapper"
      direction="horizontal"
      className="w-full flex-1"
    >
      <ResizablePanel minSize={50} defaultSize={65}>
        <HeaderWrapper>
          <Logo logo />
          <span className="border-r h-full" />
          <AccountsButton />
          <span className="border-r h-full" />
          <div className="flex flex-col">
            <span className="opacity-70 text-sm">Todate</span>
            <p className="flex items-center gap-1.5 font-medium">
              <Calendar className="size-4.5 brightness-90 text-primary" />
              <span>
                {new Date().toLocaleDateString()}{" "}
                {format(new Date(), "h:mm aaa")}
              </span>
            </p>
          </div>
          <div className="flex gap-4 ml-auto">
            <Link href={`/dashboard/${accountId}/trades/create`}>
              <Button size={"sm"}>
                <Plus /> Add Trade
              </Button>
            </Link>
          </div>
        </HeaderWrapper>
        <div className="h-12 border-b w-full px-4 flex">
          {links.map((item) => {
            const idMatch = pathname.match(/^\/dashboard\/(\d+)/);
            const id = idMatch ? idMatch[1] : null;

            const active =
              pathname ===
              `/dashboard/${id || 1}${item.path == "/" ? "" : item.path}`;

            return (
              <Link
                key={item.id}
                className={cn(
                  "h-full flex transition-all duration-200 items-center border-b-2 px-4 text-zinc-600",
                  active
                    ? "text-primary font-medium border-b-primary"
                    : "border-b-transparent"
                )}
                href={`/dashboard/${id || 1}${item.path}`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
        <main className="flex flex-col h-full">{children}</main>
      </ResizablePanel>
      <ResizableHandle withHandle />

      <ResizablePanel className="bg-zinc-100" minSize={20} defaultSize={35}>
        <HeaderWrapper className="justify-end">
          <UserButton />
        </HeaderWrapper>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Sidebar</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ResizableWrapper;
