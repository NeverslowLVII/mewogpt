import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/db';

const sendError = (res: NextApiResponse) => {
  res.status(404).json({ error: 'conversation not found' });
};

async function GET(req: NextApiRequest, res: NextApiResponse) {
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: Number(req.query.conversationId),
    },
    include: {
      messages: {
        select: {
          id: true,
          content: true,
          role: true,
          timestamp: true,
        },
      },
    },
  });

  if (conversation && conversation.userId !== null) {
    const userAuth = await getAuthUser(req);
    if (!userAuth) {
      sendError(res);
      return;
    }

    if (conversation.userId !== userAuth.id) {
      sendError(res);
      return;
    }

    res.status(200).json(conversation);
    return;
  }

  if (!conversation) {
    sendError(res);
    return;
  }

  res.status(200).json(conversation);
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method not allowed, please use GET' });
    return;
  }

  try {
    await GET(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'internal server error' });
  }
}
