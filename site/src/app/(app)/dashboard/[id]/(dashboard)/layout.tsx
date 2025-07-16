import ResizableWrapper from "@/modules/dashboard/components/ResizableWrapper";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return <ResizableWrapper>{children}</ResizableWrapper>;
};

export default Layout;
