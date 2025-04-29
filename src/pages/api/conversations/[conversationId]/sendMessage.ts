import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/db';
import { askGPT } from '@/lib/gpt';

export const config = {
  maxDuration: 30,
};

type MessageRole = 'user' | 'assistant';

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const timestamp = new Date();

  const conversation = await prisma.conversation.findUnique({
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
  });

  if (!conversation) {
    res.status(404).json({ error: 'conversation not found' });
    return;
  }

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

  const { content, bypassCheck } = req.body;

  const TICKET_CHECK_CHANCE = 0.15;
  const isCheckRequired = Math.random() < TICKET_CHECK_CHANCE;

  if (isCheckRequired && !bypassCheck) {
    return res.status(200).json({
      ticketCheckRequired: true,
      challenge: {
        type: 'button_click',
        message:
          'Attention ! Contrôle des titres de transport. Veuillez valider votre titre pour continuer.',
      },
    });
  }

  const typedMessages = conversation.messages.map((msg) => ({
    role: msg.role as MessageRole,
    content: msg.content,
  }));

  const messageGPT = await askGPT([
    ...typedMessages,
    {
      role: 'user' as MessageRole,
      content,
    },
  ]);

  const conversationUpdated = await prisma.conversation.update({
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
    include: {
      messages: {
        orderBy: {
          id: 'desc',
        },
        select: {
          id: true,
          content: true,
          role: true,
          timestamp: true,
        },
        take: 2,
      },
    },
  });

  conversationUpdated.messages.reverse();

  res.status(200).json({ messages: conversationUpdated.messages });
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed, please use POST' });
    return;
  }

  try {
    await POST(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'internal server error' });
  }
}
