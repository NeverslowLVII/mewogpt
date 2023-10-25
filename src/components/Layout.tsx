import NavBar from '@/components/NavBar';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen w-screen text-gray-200">
      <NavBar />
      {children}
    </div>
  );
}
