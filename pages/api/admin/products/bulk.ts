
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { deleteManyProducts, updateStockManyProducts, updateConditionManyProducts } from '../../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session || session.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (req.method === 'POST') {
    const { action, productIds, value } = req.body;

    if (!action || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    try {
      let result;
      switch (action) {
        case 'delete_many':
          result = await deleteManyProducts(productIds);
          return res.status(200).json({ message: `${result} products deleted.` });
        case 'update_stock_many':
          if (typeof value !== 'number') {
            return res.status(400).json({ message: 'Stock change value is required and must be a number.' });
          }
          result = await updateStockManyProducts(productIds, value);
          return res.status(200).json({ message: `${result} products stock updated.` });
        case 'update_condition_many':
          if (value !== 'new' && value !== 'used') {
            return res.status(400).json({ message: 'Condition must be "new" or "used".' });
          }
          result = await updateConditionManyProducts(productIds, value);
          return res.status(200).json({ message: `${result} products condition updated.` });
        default:
          return res.status(400).json({ message: 'Invalid action.' });
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
