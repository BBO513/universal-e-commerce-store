import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { updateCartQuantity } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'PUT') {
    try {
      const { cartItemId, quantity } = req.body;
      if (typeof cartItemId !== 'number' || typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid cart item ID or quantity' });
      }

      const updatedCartItem = await updateCartQuantity(cartItemId, quantity);
      if (updatedCartItem) {
        res.status(200).json(updatedCartItem);
      } else {
        res.status(404).json({ message: 'Cart item not found' });
      }
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      res.status(500).json({ message: 'Error updating cart item quantity' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}