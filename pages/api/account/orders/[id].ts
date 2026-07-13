
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getUserOrderDetail } from '../../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const { id } = req.query;

    if (typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    try {
      const userId = parseInt(session.user.id as string, 10);
      const orderId = parseInt(id, 10);
      const order = await getUserOrderDetail(userId, orderId);

      if (order) {
        res.status(200).json(order);
      } else {
        res.status(404).json({ message: 'Order not found or does not belong to user' });
      }
    } catch (error) {
      console.error('Error fetching user order detail:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
