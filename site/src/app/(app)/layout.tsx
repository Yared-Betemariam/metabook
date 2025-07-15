import { Toaster } from "@/components/ui/sonner";
import DashboardWrapper from "@/modules/dashboard/components/DashboardWrapper";
import Modals from "@/modules/modals";
import { Metadata } from "next";

interface LayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Dashboard",
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <DashboardWrapper>{children}</DashboardWrapper>
      <Toaster />
      <Modals />
    </>
  );
};

export default Layout;
