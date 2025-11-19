import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getWishlist, addToWishlist } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const userId = parseInt(session.user.id, 10);

  if (req.method === 'GET') {
    try {
      const wishlist = await getWishlist(userId);
      res.status(200).json(wishlist);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    try {
      const item = await addToWishlist(userId, parseInt(productId, 10));
      if (item) {
        res.status(201).json({ message: 'Product added to wishlist.', item });
      } else {
        res.status(200).json({ message: 'Product already in wishlist.' });
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
