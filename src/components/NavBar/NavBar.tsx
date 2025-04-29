import { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ConversationItem from '@/components/NavBar/ConversationItem';
import { Conversation } from '@/types/Conversation';
import { AuthContext } from '@/context/AuthContext';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

type NavBarProps = {
  conversations: Conversation[];
  loading: boolean;
  error: Error | null;
  removeConversation: (_id: string) => void;
};

export default function NavBar({
  conversations,
  loading,
  error,
  removeConversation,
}: NavBarProps) {
  const { isAuthenticated, logout, token } = useContext(AuthContext);
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<Error | null>(null);
  const [localConversations, setLocalConversations] =
    useState<Conversation[]>(conversations);

  useEffect(() => {
    setLocalConversations(conversations);
  }, [conversations]);

  const handleDeleteConversation = async (id: string) => {
    setDeletingId(id);
    setDeleteError(null);

    setLocalConversations((prevConversations) =>
      prevConversations.filter((conv) => conv.id !== id)
    );

    try {
      await performDeletion(id);
      removeConversation(id);

      const isCurrentConversation = router.query.conversationId === String(id);

      if (isCurrentConversation) {
        router.push('/');
      }
    } catch (err) {
      console.error('Error deleting conversation:', err);
      setDeleteError(err as Error);

      setLocalConversations(conversations);
    } finally {
      setDeletingId(null);
    }
  };

  const performDeletion = async (id: string) => {
    const response = await fetch(`/api/conversations/${id}/delete`, {
      method: 'DELETE',
      headers: {
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData.error || 'Failed to delete conversation');
    }
  };

  return (
    <nav className="flex flex-col h-full w-full bg-[#202123] text-white">
      <div className="px-3 py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/chatratp.png"
            alt="Logo ChatRATP"
            width={120}
            height={36}
            priority
          />
        </Link>
      </div>

      {deleteError && (
        <div className="px-3 py-2 text-xs text-red-400 bg-red-900/20 mx-2 rounded-md">
          Erreur : {deleteError.message}
          <button
            onClick={() => setDeleteError(null)}
            className="float-right text-gray-400 hover:text-white"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto mb-2">
        {loading && (
          <p className="text-sm py-2 px-3 text-gray-400">Chargement...</p>
        )}
        {error && (
          <p className="text-sm py-2 px-3 text-red-400">
            Erreur : {error.message}
          </p>
        )}
        {!loading && !error && localConversations.length === 0 && (
          <p className="text-sm py-2 px-3 text-gray-400">
            Aucune conversation pour le moment
          </p>
        )}
        <ul className="space-y-[1px]">
          {localConversations.map((conversation) => (
            <li key={conversation.id} className="relative">
              {deletingId === conversation.id && (
                <div className="absolute inset-0 bg-gray-800/50 flex items-center justify-center z-10">
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                </div>
              )}
              <ConversationItem
                className="flex items-center gap-3 px-3 py-3 text-sm hover:bg-[#2A2B32] cursor-pointer truncate"
                conversation={conversation}
                onDelete={handleDeleteConversation}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-white/20 pt-2 pb-4 mt-auto">
        <div className="flex flex-col">
          <div className="px-3 text-sm text-gray-300">
            {!isAuthenticated ? (
              <div className="flex gap-2">
                <Link
                  href="/auth/login"
                  className="hover:text-white transition-colors"
                >
                  Connexion
                </Link>
                <span>/</span>
                <Link
                  href="/auth/signup"
                  className="hover:text-white transition-colors"
                >
                  Inscription
                </Link>
              </div>
            ) : (
              <button
                onClick={() => logout()}
                className="hover:text-white transition-colors"
              >
                Déconnexion
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
