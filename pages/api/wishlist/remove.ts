import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { removeFromWishlist } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'DELETE') {
    const session = await getSession({ req });

    if (!session || !session.user || !session.user.id) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const userId = parseInt(session.user.id, 10);
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    try {
      const success = await removeFromWishlist(userId, parseInt(productId, 10));
      if (success) {
        res.status(200).json({ message: 'Product removed from wishlist.' });
      } else {
        res.status(404).json({ message: 'Product not found in wishlist or user not authorized.' });
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
