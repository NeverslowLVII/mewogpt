import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '@/components/Layout';
import { useEffect, useState } from 'react';
import { Conversation } from '@/types/Conversation';

export default function App({ Component, pageProps }: AppProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch /api/conversations
    fetch('/api/conversations')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);

        setConversations(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return (
    <Layout conversations={conversations} loading={loading} error={error}>
      <Component
        {...pageProps}
        addConversation={(conversation: Conversation) =>
          setConversations((conversations) => [...conversations, conversation])
        }
      />
    </Layout>
  );
}
