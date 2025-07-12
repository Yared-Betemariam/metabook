"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModalStore } from "@/modules/modals/store";
import { LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useUser } from "../hooks";

const UserButton = () => {
  const { user, isLoading } = useUser();
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    setSigningOut(true);

    await signOut({
      redirectTo: "/signin",
    });

    setSigningOut(false);
  };

  if (isLoading) {
    return (
      <div className="p-1">
        <Avatar className="animate-pulse">
          <AvatarFallback className="bg-zinc-800/30" />
        </Avatar>
      </div>
    );
  }

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-fit flex items-center gap-2 p-1 ring-2 ring-transparent hover:ring-zinc-300/25 duration-100 transition-all rounded-full">
        <Avatar className="ring-2 ring-transparent duration-300 transition-all hover:ring-border/25 cursor-pointer bg-gradient-to-tr from-primary brightness-110 to-secondary text-white grid place-content-center">
          <span className="uppercase font-medium">
            {user.name?.slice(0, 2)}
          </span>
        </Avatar>
        <span className="group-data-[collapsible=icon]:hidden mr-2 whitespace-nowrap hidden sm:flex">
          {user.name}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={12}
        align="start"
        className="max-w-[16rem] mx-2 px-0 flex flex-col"
      >
        <div className="flex flex-col px-3 pt-2 border-b">
          <span className="text-sm opacity-70">User Info</span>
          <span className="text-base font-medium">{user.name} </span>
          <span className="opacity-50 text-sm mb-2">&lt;{user.email}&gt;</span>
        </div>

        <DropdownMenuItem
          onClick={() =>
            useModalStore.getState().openModal({ open: "settings" })
          }
          className="h-10 px-4"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={signingOut}
          onClick={() => handleLogout()}
          className="h-10 px-4 text-destructive! hover:text-destructive!"
        >
          <LogOut className="mr-2 h-4 w-4 text-destructive! hover:text-destructive!" />
          <span>{signingOut ? "logging out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserButton;
