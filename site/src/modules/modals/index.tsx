"use client";

import { useEffect, useState } from "react";
import { SettingsModal } from "../auth/components/SettingsModal";

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
    </>
  );
};
export default Modals;
