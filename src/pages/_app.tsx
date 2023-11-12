import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '@/components/Layout';
import { useEffect, useState } from 'react';
import { Conversation } from '@/types/Conversation';
import { Auth, AuthContext } from '@/context/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
  const [auth, setAuth] = useState<Auth>({
    user: null,
    token: null,
  });
  const isAuthenticated = !!auth.user;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch /api/conversations
    fetch('/api/conversations', {
      ...(auth.token && {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }),
    })
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
  }, [auth.token]);

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        token: auth.token,
        setAuth: (auth: Auth) => {
          setAuth(auth);
        },
        isAuthenticated,
        logout: () => {
          setAuth({ user: null, token: null });
        },
      }}
    >
      <Layout conversations={conversations} loading={loading} error={error}>
        <Component
          {...pageProps}
          addConversation={(conversation: Conversation) =>
            setConversations((conversations) => [
              ...conversations,
              conversation,
            ])
          }
        />
      </Layout>
    </AuthContext.Provider>
  );
}
