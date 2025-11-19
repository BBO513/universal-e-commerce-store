import { NextApiRequest, NextApiResponse } from 'next';
import { updateProductStock, updateStockManyProducts } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    // Update stock for a single product
    try {
      const { productId, change, reason } = req.body;
      if (typeof productId !== 'number' || typeof change !== 'number' || typeof reason !== 'string') {
        return res.status(400).json({ message: 'Invalid request body for single stock update' });
      }
      const newStock = await updateProductStock(productId, change, reason);
      res.status(200).json({ productId, newStock });
    } catch (error) {
      console.error('Error updating single product stock:', error);
      res.status(500).json({ message: 'Error updating single product stock' });
    }
  } else if (req.method === 'PUT') {
    // Bulk update stock for multiple products
    try {
      const { productIds, stockChange } = req.body;
      if (!Array.isArray(productIds) || typeof stockChange !== 'number') {
        return res.status(400).json({ message: 'Invalid request body for bulk stock update' });
      }
      const updatedCount = await updateStockManyProducts(productIds, stockChange);
      res.status(200).json({ updatedCount, message: `Successfully updated stock for ${updatedCount} products` });
    } catch (error) {
      console.error('Error updating bulk product stock:', error);
      res.status(500).json({ message: 'Error updating bulk product stock' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
