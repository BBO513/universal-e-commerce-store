import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { removeCartItem } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'DELETE') {
    try {
      const { cartItemId } = req.body;
      if (typeof cartItemId !== 'number') {
        return res.status(400).json({ message: 'Invalid cart item ID' });
      }

      const removed = await removeCartItem(cartItemId);
      if (removed) {
        res.status(204).end(); // No content for successful deletion
      } else {
        res.status(404).json({ message: 'Cart item not found' });
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
      res.status(500).json({ message: 'Error removing cart item' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}