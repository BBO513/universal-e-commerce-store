
import { NextApiRequest, NextApiResponse } from 'next';
import { getOrderById } from '../../../lib/db';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = parseInt(session.user.id as string, 10);
  const { id } = req.query;

  if (req.method === 'GET') {
    if (typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    try {
      const order = await getOrderById(parseInt(id, 10));

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Ensure the user owns the order
      if (order.user_id !== userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      res.status(200).json(order);
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
