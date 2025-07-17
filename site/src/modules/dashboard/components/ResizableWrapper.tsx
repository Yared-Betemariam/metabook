"use client";

import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import AccountsButton from "@/modules/accounts/components/AccountsButton";
import { useActiveAccount } from "@/modules/accounts/hooks";
import UserButton from "@/modules/auth/components/UserButton";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import HeaderWrapper from "./HeaderWrapper";

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
  const activeAccount = useActiveAccount();

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
          <div className="flex flex-col -space-y-0.5">
            <span className="opacity-70 text-sm">Balance</span>
            <p className="text-xl tracking-tight font-medium">
              ${activeAccount?.balance.toLocaleString() || 0}
            </p>
          </div>
          <div className="flex gap-4 ml-auto">
            <Link href={`/dashboard/${activeAccount?.id}/trades/create`}>
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
