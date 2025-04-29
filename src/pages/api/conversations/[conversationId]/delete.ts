import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/db';

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const { conversationId } = req.query;

  if (!conversationId || typeof conversationId !== 'string') {
    res.status(400).json({ error: 'conversation ID is required' });
    return;
  }

  const conversationIdInt = parseInt(conversationId, 10);

  if (isNaN(conversationIdInt)) {
    res.status(400).json({ error: 'invalid conversation ID format' });
    return;
  }

  const userAuth = await getAuthUser(req);

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationIdInt,
    },
  });

  if (!conversation) {
    res.status(404).json({ error: 'conversation not found' });
    return;
  }

  if (
    conversation.userId &&
    (!userAuth || conversation.userId !== userAuth.id)
  ) {
    res.status(403).json({ error: 'unauthorized' });
    return;
  }

  try {
    await prisma.message.deleteMany({
      where: {
        conversationId: conversationIdInt,
      },
    });

    await prisma.conversation.delete({
      where: {
        id: conversationIdInt,
      },
    });

    res.status(200).json({ success: true });
  } catch (deleteError) {
    console.error('Error while deleting:', deleteError);
    throw deleteError;
  }
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    res.status(405).json({ error: 'method not allowed, please use DELETE' });
    return;
  }

  try {
    await DELETE(req, res);
  } catch (error) {
    console.error('Delete handler error:', error);
    res.status(500).json({ error: 'internal server error' });
  }
}
