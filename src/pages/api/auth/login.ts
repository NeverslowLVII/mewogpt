import type { NextApiRequest, NextApiResponse } from 'next';
import { sign } from 'jsonwebtoken';
import prisma from '@/lib/db';
import { User } from '@prisma/client';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed, please use POST' });
    return;
  }

  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || user.password !== password) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const userCopied = { ...user } as Partial<User>;
  delete userCopied.password;

  res.status(200).json({
    user,
    token: sign(userCopied, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    }),
  });
}
