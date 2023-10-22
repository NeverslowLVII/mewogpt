import { NextApiRequest } from 'next';
import { verify } from 'jsonwebtoken';

export const getAuthUser = async (req: NextApiRequest) => {
  const authorization = req.headers?.authorization;
  const token = authorization?.split(' ')[1];

  if (token) {
    return verify(token as string, process.env.JWT_SECRET as string) as {
      id: number;
    };
  }
};
