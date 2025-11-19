import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getCartItems, addToCart } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = parseInt(session.user.id as string, 10);

  if (req.method === 'GET') {
    try {
      const cartItems = await getCartItems(userId);
      res.status(200).json(cartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).json({ message: 'Error fetching cart items' });
    }
  } else if (req.method === 'POST') {
    try {
      const { productId, quantity } = req.body;
      if (typeof productId !== 'number' || typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid product ID or quantity' });
      }

      const updatedCartItem = await addToCart(userId, productId, quantity);
      res.status(200).json(updatedCartItem);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      res.status(500).json({ message: 'Error adding item to cart' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}