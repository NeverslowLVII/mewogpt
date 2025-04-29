import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import MessageInput from '@/components/FormInput';
import type { Conversation } from '@/types/Conversation';
import { AuthContext } from '@/context/AuthContext';

type HomeProps = {
  addConversation: (_conversation: Conversation) => void;
};

export default function Home({ addConversation }: HomeProps) {
  const router = useRouter();

  const { token } = useContext(AuthContext);

  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text) return;

    setLoading(true);
    setError(null);
    fetch('/api/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
      body: JSON.stringify({ content: text }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);

        addConversation(data);
        router.push(`/conversations/${data.id}`);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
      });
  };

  return (
    <main className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1 bg-[#343541]">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center text-sm h-full justify-center">
          <div className="w-full max-w-2xl px-6 py-4 m-auto">
            <div className="p-4 bg-gray-800 rounded-lg shadow-md text-white text-center">
              <p className="font-medium text-lg">
                Attention à la fermeture des portes… La discussion va commencer
                !
              </p>
            </div>
          </div>

          {error && (
            <div className="w-full max-w-2xl px-6 py-2 m-auto">
              <div className="bg-red-500 text-white p-4 rounded-lg shadow-md">
                {error.message}
              </div>
            </div>
          )}
        </div>
      </div>
      <MessageInput
        disabled={loading}
        handleSubmit={onSubmit}
        text={text}
        handleTextChange={setText}
      />
    </main>
  );
}
