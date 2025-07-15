"use client";

import { ChevronsUpDown, Plus } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModalStore } from "@/modules/modals/store";
import Link from "next/link";
import { useActiveAccount, useUserAccounts } from "../hooks";

export default function AccountsButton() {
  const { isLoading, data } = useUserAccounts();
  const account = useActiveAccount();

  if (isLoading) {
    return (
      <div className="p-1">
        <div className="animate-pulse rounded-full size-8 bg-zinc-800/30"></div>
      </div>
    );
  }

  if (!data?.data || !account) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="h-11! px-1.5! w-44 rounded-full">
          <Avatar className="ring-2 ring-transparent duration-300 transition-all hover:ring-border/25 cursor-pointer bg-gradient-to-tr from-emerald-800 brightness-110 to-emerald-600 text-white grid place-content-center">
            <span className="text-base tracking-tight">
              {account.name.slice(0, 1)}
            </span>
          </Avatar>
          <span className="truncate font-medium text-base">{account.name}</span>
          <ChevronsUpDown className="ml-auto mr-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 mx-2 rounded-lg p-0 divide-y"
        align="start"
        side={"bottom"}
        sideOffset={4}
      >
        {data.data.map((item) => (
          <Link key={item.name} href={`/dashboard/${item.id}`}>
            <DropdownMenuItem className="p-3 group/item">
              <div className="flex size-5 items-center bg-zinc-100 rounded-full justify-center border border-dashed">
                {account.id === item.id && (
                  <span className="size-2 rounded-full drop-shadow bg-primary" />
                )}
              </div>
              {item.name}
            </DropdownMenuItem>
          </Link>
        ))}
        <DropdownMenuItem
          onClick={() =>
            useModalStore.getState().openModal({ open: "account" })
          }
          className="p-3"
        >
          <div className="flex size-5 items-center justify-center border border-dashed rounded-full bg-zinc-100">
            <Plus className="size-3" />
          </div>
          <div className="text-muted-foreground text-sm!">Add Account</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
