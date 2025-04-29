import { useState } from 'react';
import ChatBubble from './Message';

export default function LoadingIndicator() {
  const [points, setPoints] = useState(0);

  setTimeout(() => {
    setPoints(points + 1);
  }, 1000);

  return (
    <ChatBubble
      role="assistant"
      content={`Chargement${'.'.repeat(points % 4)}`}
    />
  );
}
