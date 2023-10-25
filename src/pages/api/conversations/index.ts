import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/db';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method not allowed, please use GET' });
    return;
  }

  const userAuth = await getAuthUser(req);

  const conversations = await prisma.conversation
    .findMany({
      where: {
        userId: userAuth?.id,
      },
      include: {
        messages: {
          orderBy: {
            timestamp: 'asc',
          },
          take: 1,
          select: {
            content: true,
          },
        },
      },
    })
    .then((conversations) =>
      conversations.map((conversation) => ({
        ...conversation,
        lastMessage: conversation.messages[0]?.content,
      }))
    );

  res.status(200).json(conversations);
}
