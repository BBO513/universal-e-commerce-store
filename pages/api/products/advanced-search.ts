import { NextApiRequest, NextApiResponse } from 'next';
import { filterProducts, getTotalProductCount } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const {
        brand,
        condition,
        minPrice,
        maxPrice,
        minStock,
        maxStock,
        category_id,
        searchQuery,
        page,
        limit,
        sortBy,
      } = req.query;

      const filters: { [key: string]: any } = {};
      if (brand) filters.brand = brand as string;
      if (condition) filters.condition = condition as 'new' | 'used';
      if (minPrice) filters.minPrice = parseFloat(minPrice as string);
      if (maxPrice) filters.maxPrice = parseFloat(maxPrice as string);
      if (minStock) filters.minStock = parseInt(minStock as string, 10);
      if (maxStock) filters.maxStock = parseInt(maxStock as string, 10);
      if (category_id) filters.category_id = parseInt(category_id as string, 10);
      if (searchQuery) filters.searchQuery = searchQuery as string;
      if (page) filters.page = parseInt(page as string, 10);
      if (limit) filters.limit = parseInt(limit as string, 10);
      if (sortBy) filters.sortBy = sortBy as 'newest' | 'price_low_high' | 'price_high_low';

      const products = await filterProducts(filters);
      const totalProducts = await getTotalProductCount(filters);

      res.status(200).json({ products, totalProducts, page: filters.page || 1, limit: filters.limit || 20 });
    } catch (error) {
      console.error('Error fetching advanced search products:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
