import Link from 'next/link';
import ConversationItem from '@/components/NavBar/ConversationItem';
import { Conversation } from '@/types/Conversation';

type NavBarProps = {
  conversations: Conversation[];
  loading: boolean;
  error: Error | null;
};

export default function NavBar({ conversations, loading, error }: NavBarProps) {
  return (
    <nav className="bg-gray-100 dark:bg-gray-900 w-[260px] overflow-y-auto">
      <h1 className="text-2xl font-bold p-4">
        <Link href="/">mewoGPT</Link>
      </h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <ul>
        {conversations.map((conversation) => (
          <li key={conversation.id}>
            <ConversationItem
              className={
                'flex p-3 items-center gap-3 rounded-md break-all pr-14'
              }
              conversation={conversation}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
