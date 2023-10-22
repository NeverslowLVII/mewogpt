import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/db';
import { askGPT } from '@/lib/gpt';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed, please use POST' });
    return;
  }

  const timestamp = new Date();

  // Check if conversation exists
  const conversation = (await prisma.conversation.findUnique({
    where: {
      id: Number(req.query.conversationId),
    },
    include: {
      messages: {
        select: {
          content: true,
          role: true,
        },
      },
    },
  })) as {
    id: number;
    userId: number | null;
    messages: {
      content: string;
      role: 'user' | 'assistant';
    }[];
  } | null;

  if (!conversation) {
    res.status(404).json({ error: 'conversation not found' });
    return;
  }

  // Check if conversation is owned by user
  if (conversation.userId !== null) {
    const userAuth = await getAuthUser(req);
    if (!userAuth) {
      res.status(404).json({ error: 'conversation not found' });
      return;
    }

    if (conversation.userId !== userAuth.id) {
      res.status(404).json({ error: 'conversation not found' });
      return;
    }
  }

  const { content } = req.body;

  const messageGPT = await askGPT(conversation.messages);

  await prisma.conversation.update({
    where: {
      id: conversation.id,
    },
    data: {
      messages: {
        create: [
          {
            role: 'user',
            content,
            timestamp,
          },
          messageGPT,
        ],
      },
    },
  });

  res.status(200).json({ content: messageGPT.content });
}
