import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Conversation } from '@/components/NavBar/NavBar';

type ConversationItemProps = {
  className?: string;
  conversation: Conversation;
};

export default function ConversationItem({
  className,
  conversation,
}: ConversationItemProps) {
  const { asPath, isReady } = useRouter();
  const [computedClassName, setComputedClassName] = useState(className);

  const activeClassName = 'text-blue-500';
  const href = `/conversations/${conversation.id}`;

  useEffect(() => {
    // Check if the router fields are updated client-side
    if (isReady) {
      // Dynamic route will be matched via props.as
      // Static route will be matched via props.href
      const linkPathname = new URL(href, location.href).pathname;

      // Using URL().pathname to get rid of query and hash
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

  return (
    <Link className={computedClassName} href={href}>
      {conversation.lastMessage}
    </Link>
  );
}
