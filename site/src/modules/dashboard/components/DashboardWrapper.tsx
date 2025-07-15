"use client";

import Loader from "@/components/custom/loader";
import { useActiveAccount, useUserAccounts } from "@/modules/accounts/hooks";
import { useModalStore } from "@/modules/modals/store";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

const DashboardWrapper = ({ children }: Props) => {
  const { data, isLoading } = useUserAccounts();
  const activeAccount = useActiveAccount();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!data?.data.length || data?.data.length <= 0)) {
      useModalStore.getState().openModal({ open: "account" });
    }

    if (pathname === "/dashboard" && data?.data && data.data.length > 0) {
      router.push(`/dashboard/${data.data[0].id}`);
    }

    if (!activeAccount && data?.data && data.data.length > 0) {
      router.push(`/dashboard/${data.data[0].id}`);
    }
  }, [data, isLoading, pathname]);

  return (
    <main id="wrapper" className="flex flex-col flex-1 h-full">
      {isLoading ? <Loader /> : children}
    </main>
  );
};

export default DashboardWrapper;
