import { NextApiRequest, NextApiResponse } from 'next';
import { filterProducts, getTotalProductCount } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, page = '1', limit = '20', sortBy, minPrice, maxPrice, condition } = req.query;

  if (req.method === 'GET') {
    if (typeof query !== 'string' || !query) {
      return res.status(400).json({ message: 'Missing or invalid search query' });
    }

    try {
      const filters: { [key: string]: any } = { searchQuery: query };
      if (minPrice) filters.minPrice = parseFloat(minPrice as string);
      if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);
      if (condition) filters.condition = condition as 'new' | 'used';
      if (page) filters.page = parseInt(page as string, 10);
      if (limit) filters.limit = parseInt(limit as string, 10);
      if (sortBy) filters.sortBy = sortBy as 'newest' | 'price_low_high' | 'price_high_low';

      const products = await filterProducts(filters);
      const totalProducts = await getTotalProductCount(filters);

      res.status(200).json({ products, totalProducts });
    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}