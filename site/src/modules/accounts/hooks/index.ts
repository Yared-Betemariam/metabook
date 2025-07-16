"use client";

import { trpc } from "@/trpc/client";
import { useParams } from "next/navigation";

export const useUserAccounts = () => {
  const { data, isLoading } = trpc.accounts.user.useQuery();

  return {
    data,
    isLoading,
  };
};

export const useActiveAccount = () => {
  const { data } = useUserAccounts();
  const params = useParams<{ id: string | undefined }>();

  if (!data || !data.data.length || data.data.length < 1) {
    return null;
  }

  if (!params.id) return null;

  const foundAccount = data.data.find((item) => item.id == Number(params.id));

  return foundAccount || null;
};

export const useAccountId = () => {
  const params = useParams<{ id: string }>();

  return Number(params.id);
};
