interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
};
