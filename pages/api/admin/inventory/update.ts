
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { updateProductStock } from '../../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session || session.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (req.method === 'POST') {
    const { productId, change, reason } = req.body;

    if (!productId || typeof change !== 'number' || !reason) {
      return res.status(400).json({ message: 'Missing productId, change, or reason' });
    }

    try {
      const newStock = await updateProductStock(productId, change, reason);
      res.status(200).json({ newStock });
    } catch (error: any) {
      console.error('Error updating product stock:', error);
      res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
