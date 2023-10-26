import { useState } from 'react';
import Message from './Message';

export default function MessageLoading() {
  const [points, setPoints] = useState(0);

  setTimeout(() => {
    setPoints(points + 1);
  }, 1000);

  return (
    <Message role="assistant" content={`Loading${'.'.repeat(points % 4)}`} />
  );
}
