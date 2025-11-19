import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { isProductInWishlist } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const session = await getSession({ req });

    if (!session || !session.user || !session.user.id) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const userId = parseInt(session.user.id, 10);
    const { productId } = req.query;

    if (!productId || typeof productId !== 'string') {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    try {
      const inWishlist = await isProductInWishlist(userId, parseInt(productId, 10));
      res.status(200).json({ inWishlist });
    } catch (error) {
      console.error('Error checking if product is in wishlist:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
