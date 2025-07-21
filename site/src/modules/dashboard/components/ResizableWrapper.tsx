"use client";

import { ScrollAreaWrapper } from "@/components/custom/scrollarea-wrapper";
import { Icons } from "@/components/Icons";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import AccountsButton from "@/modules/accounts/components/AccountsButton";
import { useActiveAccount } from "@/modules/accounts/hooks";
import Chat from "@/modules/ai/components/Chat";
import UserButton from "@/modules/auth/components/UserButton";
import { ChevronsRight, Plus, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { usePages } from "../hooks";
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
  const { activeTab, setActiveTab } = usePages();
  const isMobile = useIsMobile();

  return (
    <ResizablePanelGroup
      id="wrapper"
      direction="horizontal"
      className="w-full flex-1"
    >
      {activeTab.includes(0) &&
        (!isMobile || (!activeTab.includes(1) && isMobile)) && (
          <ResizablePanel minSize={50} defaultSize={65}>
            <ScrollAreaWrapper className="max-h-screen">
              <HeaderWrapper>
                <Logo logo />
                <span className="border-r h-full" />
                <AccountsButton />
                <span className="border-r h-full" />
                <div className="flex flex-col -space-y-0.5">
                  <span className="opacity-70 text-sm">Balance</span>
                  <p className="text-xl tracking-tight flex items-center font-medium">
                    <Wallet className="size-4.5 text-primary inline mr-1" /> $
                    {activeAccount?.balance.toLocaleString() || 0}
                  </p>
                </div>
                <div className="flex gap-4 ml-auto h-full items-center">
                  {!activeTab.includes(1) && (
                    <>
                      <Button
                        onClick={() => setActiveTab([0, 1])}
                        className="rounded-full drop-shadow-md drop-shadow-primary/50"
                      >
                        <Icons.metabi className="size-5" />
                        <span className="z-10">Ask Metabi</span>
                      </Button>
                      <span className="border-r h-full" />
                      <UserButton />
                    </>
                  )}
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
                <div className="flex items-center ml-auto">
                  <Link
                    className="w-fit"
                    href={`/dashboard/${activeAccount?.id}/trades/create`}
                  >
                    <Button variant={"secondary"} size={"sm"}>
                      <Plus /> Add Trade
                    </Button>
                  </Link>
                </div>
              </div>
              <main className="flex flex-col h-full">{children}</main>
            </ScrollAreaWrapper>
          </ResizablePanel>
        )}
      <ResizableHandle withHandle />

      {activeTab.includes(1) && (
        <ResizablePanel className="relative flex" minSize={20} defaultSize={35}>
          <div className="flex flex-1 flex-col bg-radial from-white to-zinc-300">
            <HeaderWrapper className="justify-between bg-white">
              <Button
                onClick={() => setActiveTab([0])}
                variant={"outline"}
                className="shadow-none border-dashed rounded-full bg-zinc-900/10"
                size={"icon"}
              >
                <ChevronsRight className="size-6" />
              </Button>
              <UserButton />
            </HeaderWrapper>
            <Chat />
          </div>
        </ResizablePanel>
      )}
    </ResizablePanelGroup>
  );
};

export default ResizableWrapper;
