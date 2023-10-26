import NavBar from '@/components/NavBar';
import { Conversation } from '@/types/Conversation';

type LayoutProps = {
  conversations: Conversation[];
  loading: boolean;
  error: Error | null;
  children: React.ReactNode;
};

export default function Layout({
  conversations,
  loading,
  error,
  children,
}: LayoutProps) {
  return (
    <div className="flex h-screen w-screen text-gray-800 dark:text-gray-200">
      <NavBar conversations={conversations} loading={loading} error={error} />
      {children}
    </div>
  );
}
