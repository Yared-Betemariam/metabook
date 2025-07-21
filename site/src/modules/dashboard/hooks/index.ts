import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";
import { create } from "zustand";

interface TabsStore {
  activeTab: number[];
  setActiveTab: (activeTab: number[]) => void;
}

const useTabsStore = create<TabsStore>((set) => ({
  activeTab: [0],
  setActiveTab: (activeTab: number[]) => set({ activeTab }),
}));

export const usePages = () => {
  const { activeTab, setActiveTab } = useTabsStore();

  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile && activeTab.length > 1) {
      setActiveTab([0]);
    }
  }, [isMobile]);

  return {
    activeTab,
    setActiveTab,
  };
};
