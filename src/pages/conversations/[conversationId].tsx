import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Message from '@/components/Message';
import MessageLoading from '@/components/MessageLoading';
import FormInput from '@/components/FormInput';
import { AuthContext } from '@/context/AuthContext';

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
};

export default function ConversationPage() {
  const router = useRouter();
  const { conversationId } = router.query;

  const { token } = useContext(AuthContext);

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingInit, setLoadingInit] = useState<boolean>(true);
  const [errorInit, setErrorInit] = useState<Error | null>(null);
  const [loadingResponse, setLoadingResponse] = useState<boolean>(false);
  const [errorResponse, setErrorResponse] = useState<Error | null>(null);

  useEffect(() => {
    if (!router.isReady) return;
    // Fetch /api/conversations
    setLoadingInit(true);
    setErrorInit(null);
    fetch(`/api/conversations/${conversationId}`, {
      ...(token && {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);

        setMessages(data.messages);
        setLoadingInit(false);
      })
      .catch((err) => {
        setErrorInit(err);
        setLoadingInit(false);
      });
  }, [router.isReady, conversationId, token]);

  const disabledForm = loadingResponse || !!errorResponse;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input || disabledForm) return;

    setLoadingResponse(true);
    setErrorResponse(null);

    // POST /api/conversations/:conversationId
    fetch(`/api/conversations/${conversationId}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
      body: JSON.stringify({ content: input }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);

        setLoadingResponse(false);
        setMessages((messagesPrev) => [...messagesPrev, ...data.messages]);
        setInput('');
      })
      .catch((err) => {
        setLoadingResponse(false);
        setErrorResponse(err);
      });
  };

  return (
    <main className="flex flex-col h-full w-full bg-gray-200 dark:bg-gray-800">
      <div className="flex-1 overflow-y-auto">
        {loadingInit && <p>Loading...</p>}
        {errorInit && <p>Error: {errorInit.message}</p>}
        {messages.map((message) => (
          <Message
            key={message.id}
            content={message.content}
            role={message.role}
          />
        ))}
        {loadingResponse && <MessageLoading />}
        {errorResponse && (
          <Message
            role="assistant"
            content={`Error: ${errorResponse.message}`}
          />
        )}
      </div>
      <FormInput
        disabled={disabledForm}
        handleSubmit={onSubmit}
        text={input}
        handleTextChange={setInput}
      />
    </main>
  );
}
