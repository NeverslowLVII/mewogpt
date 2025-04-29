import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Conversation } from '@/types/Conversation';
import { MessageSquare, Trash2 } from 'lucide-react';

type ConversationItemProps = {
  className?: string;
  conversation: Conversation;
  onDelete?: (_id: string) => void;
};

export default function ConversationItem({
  className,
  conversation,
  onDelete,
}: ConversationItemProps) {
  const { asPath, isReady } = useRouter();
  const [computedClassName, setComputedClassName] = useState(className);
  const [isHovering, setIsHovering] = useState(false);

  const activeClassName = 'bg-[#343541]';
  const href = `/conversations/${conversation.id}`;

  useEffect(() => {
    if (isReady) {
      const linkPathname = new URL(href, location.href).pathname;
      const activePathname = new URL(asPath, location.href).pathname;

      const newClassName =
        linkPathname === activePathname
          ? `${className} ${activeClassName}`.trim()
          : className;

      if (newClassName !== computedClassName) {
        setComputedClassName(newClassName);
      }
    }
  }, [asPath, isReady, activeClassName, href, className, computedClassName]);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(conversation.id);
    }
  };

  return (
    <div
      className={`${computedClassName} relative group`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link href={href} className="flex items-center w-full">
        <div className="flex items-center w-full">
          <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="truncate">{conversation.firstMessage}</span>
        </div>
      </Link>

      {(isHovering || onDelete) && onDelete && (
        <button
          onClick={handleDelete}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
          aria-label="Supprimer la conversation"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
