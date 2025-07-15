"use client";

import { useEffect, useState } from "react";
import { SettingsModal } from "../auth/components/SettingsModal";
import { AccountsModal } from "../accounts/components/AccountModal";
import { ConfirmationModal } from "./components/ConfirmationModal";

const Modals = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
  }, []);

  if (!mounted) return null;

  return (
    <>
      <SettingsModal />
      <ConfirmationModal />
      <AccountsModal />
    </>
  );
};
export default Modals;
