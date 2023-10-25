import Link from 'next/link';
import { useEffect, useState } from 'react';
import ConversationItem from '@/components/NavBar/ConversationItem';

export type Conversation = {
  id: string;
  lastMessage: string;
};

export default function NavBar() {
  const [conversations, setConversation] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch /api/conversations
    fetch('/api/conversations')
      .then((res) => res.json())
      .then((data) => {
        setConversation(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return (
    <nav className="bg-gray-100 dark:bg-gray-900 w-[260px]">
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
