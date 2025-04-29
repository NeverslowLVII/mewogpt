import { useContext, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Message from '@/components/Message';
import MessageLoading from '@/components/MessageLoading';
import FormInput from '@/components/FormInput';
import { AuthContext } from '@/context/AuthContext';
import Link from 'next/link';
import TicketCheckUI from '@/components/TicketCheckUI';
import { Menu } from 'lucide-react';

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
};

type TicketCheckChallenge = {
  type: 'button_click';
  message: string;
  error?: string;
};

export default function ConversationPage() {
  const router = useRouter();
  const { conversationId } = router.query;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { token } = useContext(AuthContext);

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingInit, setLoadingInit] = useState<boolean>(true);
  const [errorInit, setErrorInit] = useState<Error | null>(null);
  const [loadingResponse, setLoadingResponse] = useState<boolean>(false);
  const [errorResponse, setErrorResponse] = useState<Error | null>(null);
  const [conversationNotFound, setConversationNotFound] =
    useState<boolean>(false);

  const [ticketCheckChallenge, setTicketCheckChallenge] =
    useState<TicketCheckChallenge | null>(null);
  const [pendingUserInput, setPendingUserInput] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingResponse]);

  useEffect(() => {
    if (!router.isReady) return;

    setLoadingInit(true);
    setErrorInit(null);
    setConversationNotFound(false);
    setMessages([]);
    setTicketCheckChallenge(null);
    setPendingUserInput(null);

    fetch(`/api/conversations/${conversationId}`, {
      ...(token && {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            setConversationNotFound(true);

            throw new Error('Conversation introuvable ou supprimée');
          }
          return res.text().then((text) => {
            throw new Error(text);
          });
        }
        return res.json();
      })
      .then((data) => {
        setMessages(data.messages);
        setLoadingInit(false);
      })
      .catch((err) => {
        console.error('Erreur chargement conversation:', err);
        setErrorInit(err);
        setLoadingInit(false);
      });
  }, [router.isReady, conversationId, token]);

  const sendMessageToServer = async (
    messageContent: string,
    bypassCheck: boolean = false
  ) => {
    setLoadingResponse(true);
    setErrorResponse(null);
    let success = false;

    try {
      const response = await fetch(
        `/api/conversations/${conversationId}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
          body: JSON.stringify({ content: messageContent, bypassCheck }),
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          setConversationNotFound(true);
          throw new Error(
            "Conversation introuvable ou supprimée lors de l'envoi"
          );
        }
        const errorText = await response.text();
        throw new Error(errorText || 'Erreur lors de la requête');
      }

      const data = await response.json();

      if (data.ticketCheckRequired) {
        setPendingUserInput(messageContent);
        setTicketCheckChallenge(data.challenge);

        return;
      }

      setMessages((messagesPrev) => [...messagesPrev, ...data.messages]);
      setInput('');
      setErrorResponse(null);
      success = true;
    } catch (err: any) {
      console.error('Erreur envoi message:', err);
      setErrorResponse(err);
      success = false;
    } finally {
      setLoadingResponse(false);

      if (success) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input || loadingResponse || ticketCheckChallenge) return;
    sendMessageToServer(input, false);
  };

  const handleTicketCheckSubmit = () => {
    if (!ticketCheckChallenge || !pendingUserInput) return;

    setTicketCheckChallenge(null);
    const originalInput = pendingUserInput;
    setPendingUserInput(null);
    sendMessageToServer(originalInput, true);
  };

  const handleTicketCheckCancel = () => {
    setTicketCheckChallenge(null);
    setPendingUserInput(null);
    setLoadingResponse(false);
  };

  const disabledForm =
    loadingResponse ||
    !!errorResponse ||
    conversationNotFound ||
    !!ticketCheckChallenge;

  if (conversationNotFound) {
    return (
      <div className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1 bg-[#343541]">
        <div className="flex-1 overflow-hidden flex flex-col items-center justify-center text-white">
          <div className="text-center p-6 max-w-md">
            <h2 className="text-2xl font-semibold mb-4">
              Conversation introuvable
            </h2>
            <p className="mb-6">
              Cette conversation a peut-être été supprimée ou n&apos;existe pas.
            </p>
            <Link
              href="/"
              className="px-4 py-2 bg-[#10a37f] hover:bg-[#0d8c6d] rounded-md text-white transition-colors"
            >
              Démarrer une nouvelle discussion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1 bg-[#343541]">
      {ticketCheckChallenge && (
        <TicketCheckUI
          challenge={ticketCheckChallenge}
          onSubmit={handleTicketCheckSubmit}
          onCancel={handleTicketCheckCancel}
        />
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="h-full dark:bg-[#343541]">
          <div className="sticky top-0 z-10 flex items-center border-b border-white/20 bg-[#343541] text-gray-200 sm:pl-6 md:hidden">
            <button
              type="button"
              className="px-3 py-2 -ml-0.5 -mt-0.5 inline-flex"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="flex-1 text-center text-base font-normal">
              ChatRATP
            </h1>
          </div>

          <div className="flex flex-col items-center text-sm">
            {loadingInit && (
              <div className="flex w-full items-center justify-center gap-1 border-b border-white/20 bg-[#343541] p-3 text-gray-300">
                Chargement de la conversation...
              </div>
            )}

            {errorInit && !conversationNotFound && (
              <div className="flex w-full items-center justify-center gap-1 border-b border-white/20 bg-[#343541] p-3 text-red-500">
                Erreur : {errorInit.message}
              </div>
            )}

            {messages.map((message) => (
              <Message
                key={message.id}
                content={message.content}
                role={message.role}
              />
            ))}

            {pendingUserInput && !loadingResponse && (
              <Message
                key="pending-user"
                content={pendingUserInput}
                role="user"
              />
            )}

            {loadingResponse && <MessageLoading />}

            {errorResponse &&
              !conversationNotFound &&
              !ticketCheckChallenge && (
                <Message
                  role="assistant"
                  content={`Erreur : ${errorResponse.message}`}
                />
              )}

            {!loadingInit &&
              !errorInit &&
              messages.length === 0 &&
              !pendingUserInput &&
              !conversationNotFound && (
                <div className="w-full h-32 flex items-center justify-center text-gray-300">
                  Commencez une nouvelle conversation
                </div>
              )}

            <div className="h-32 md:h-48 flex-shrink-0"></div>
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <FormInput
        ref={inputRef}
        disabled={disabledForm}
        handleSubmit={onSubmit}
        text={input}
        handleTextChange={setInput}
      />
    </div>
  );
}
