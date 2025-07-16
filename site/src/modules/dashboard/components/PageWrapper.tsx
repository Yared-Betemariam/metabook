"use client";

import Logo from "@/components/Logo";
import UserButton from "@/modules/auth/components/UserButton";
import React from "react";
import HeaderWrapper from "./HeaderWrapper";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
  title: string;
  description?: string;
  backButton?: boolean;
  headerCpts?: React.ReactNode;
};

const PageWrapper = ({
  children,
  title,
  description,
  backButton,
  headerCpts,
}: Props) => {
  const router = useRouter();

  return (
    <main className="flex flex-col">
      <HeaderWrapper className="px-6 h-12 items-end gap-6 border-b-0">
        <Logo logo />
        <span className="border-r h-[50%]" />
        {backButton && (
          <span
            onClick={() => router.back()}
            className="flex items-center -space-x-1 cursor-pointer hover:underline hover:opacity-80 duration-200 transition-all"
          >
            <ChevronLeft className="size-7 text-sky-900" />
            <span>Back</span>
          </span>
        )}
        <div className="flex ml-auto">
          <UserButton />
        </div>
      </HeaderWrapper>
      <div className="bg-white z-50 flex items-center py-6 border-b sticky top-0 px-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-medium tracking-tight">{title}</h1>
          <p>{description}</p>
        </div>
        {headerCpts && <div className="ml-auto">{headerCpts}</div>}
      </div>
      <main className="flex flex-col h-full pt-4 overflow-y-auto">
        {children}
      </main>
    </main>
  );
};
export default PageWrapper;
