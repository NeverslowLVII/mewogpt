import NavBar from '@/components/NavBar';
import { Conversation } from '@/types/Conversation';

type LayoutProps = {
  conversations: Conversation[];
  loading: boolean;
  error: Error | null;
  children: React.ReactNode;
  removeConversation: (_id: string) => void;
};

export default function Layout({
  conversations,
  loading,
  error,
  children,
  removeConversation,
}: LayoutProps) {
  return (
    <div className="flex h-screen bg-[#343541] text-white overflow-hidden">
      <div className="hidden md:flex bg-[#202123] w-[260px] flex-shrink-0">
        <NavBar
          conversations={conversations}
          loading={loading}
          error={error}
          removeConversation={removeConversation}
        />
      </div>
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
