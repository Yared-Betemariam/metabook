interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      {children}
    </main>
  );
};

export default Layout;
