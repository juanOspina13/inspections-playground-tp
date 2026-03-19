interface LayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
};
