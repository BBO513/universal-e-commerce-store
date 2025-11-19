import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { clearCart } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = parseInt(session.user.id as string, 10);

  if (req.method === 'POST') {
    try {
      const cleared = await clearCart(userId);
      if (cleared) {
        res.status(200).json({ message: 'Cart cleared successfully' });
      } else {
        res.status(404).json({ message: 'Cart not found or already empty' });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ message: 'Error clearing cart' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}