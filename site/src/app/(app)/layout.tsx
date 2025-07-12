import { Toaster } from "@/components/ui/sonner";
import Modals from "@/modules/modals";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      {children}

      <Toaster />
      <Modals />
    </>
  );
};

export default Layout;
