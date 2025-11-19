import { NextApiRequest, NextApiResponse } from 'next';
import { getProductById } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  try {
    const product = await getProductById(id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    res.status(500).json({ message: `Error fetching product ${id}` });
  }
}