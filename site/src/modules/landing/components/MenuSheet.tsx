"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { FiMenu } from "react-icons/fi";
import Logo from "@/components/Logo";
import Link from "next/link";
import { navLinks } from "./Header";

const MenuSheet = () => {
  return (
    <Sheet>
      <SheetTrigger
        className="flex items-center justify-center sm:hidden w-full h-full inset-0 rounded hover:bg-primary/5 active:bg-primary px-2 sm:active:bg-white/75 sm:hover:bg-text-gray-900 hover:text-gray-950 duration-300 group/trigger transition-all"
        asChild
      >
        <FiMenu className="text-gray-900 group-hover/trigger:text-gray-800 duration-300 transition-all" />
      </SheetTrigger>
      <SheetContent className="rounded h-full w-72 py-10 pt-14 flex flex-col px-8 gap-2">
        <SheetTitle className="sr-only">This is menu sheet</SheetTitle>
        <Logo />
        <hr className="my-2" />
        {navLinks.map((item) => (
          <SheetClose
            key={item.name}
            className="text-start border-none outline-none focus-visible:outline-none active:ring-0 m-0"
          >
            <Link
              href={item.href}
              className={cn(
                "text-gray-900/90 opacity-80",
                "transition-all duration-300 text-[15px] md:text-[17px]"
              )}
            >
              {item.name}
            </Link>
          </SheetClose>
        ))}
      </SheetContent>
    </Sheet>
  );
};
export default MenuSheet;
