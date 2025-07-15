"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModalStore } from "@/modules/modals/store";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { IoPerson } from "react-icons/io5";
import { LuSettings2 } from "react-icons/lu";
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
        <div className="bg-gradient-to-b from-sky-600 to-sky-700 rounded-full size-8 text-white/40 relative overflow-hidden">
          <IoPerson className="absolute -bottom-0.5 -left-0 size-7" />
        </div>
        <div className="group-data-[collapsible=icon]:hidden hidden sm:flex flex-col mr-2 items-start -space-y-0.5">
          <span className="whitespace-nowrap font-medium">{user.name}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={12}
        align="start"
        className="min-w-[14rem] mx-2 px-0 flex flex-col"
      >
        <DropdownMenuItem
          onClick={() =>
            useModalStore.getState().openModal({ open: "settings" })
          }
          className="h-10 px-4"
        >
          <LuSettings2 className="mr-1 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={signingOut}
          onClick={() => handleLogout()}
          className="h-10 px-4 text-destructive! hover:text-destructive!"
        >
          <LogOut className="mr-1 h-4 w-4 text-destructive! hover:text-destructive!" />
          <span>{signingOut ? "logging out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserButton;
