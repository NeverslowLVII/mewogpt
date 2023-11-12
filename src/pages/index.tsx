import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import FormInput from '@/components/FormInput';
import { Conversation } from '@/types/Conversation';
import { AuthContext } from '@/context/AuthContext';

type HomeProps = {
  addConversation: (conversation: Conversation) => void;
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
    <main className="flex flex-col h-full w-full bg-gray-200 dark:bg-gray-800">
      <div className="flex-1 overflow-y-auto">
        {error && (
          <div className="bg-red-500 text-white p-4 mb-4">{error.message}</div>
        )}
      </div>
      <FormInput
        disabled={loading}
        handleSubmit={onSubmit}
        text={text}
        handleTextChange={setText}
      />
    </main>
  );
}
