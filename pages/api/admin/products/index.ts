
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { filterProducts, getTotalProductCount, createProduct } from '../../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session || session.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (req.method === 'GET') {
    try {
      const { page, limit, sortBy, searchQuery, category_id, condition } = req.query;

      const filters: { [key: string]: any } = {};
      if (page) filters.page = parseInt(page as string, 10);
      if (limit) filters.limit = parseInt(limit as string, 10);
      if (sortBy) filters.sortBy = sortBy as 'newest' | 'price_low_high' | 'price_high_low';
      if (searchQuery) filters.searchQuery = searchQuery as string;
      if (category_id) filters.category_id = parseInt(category_id as string, 10);
      if (condition) filters.condition = condition as 'new' | 'used';

      const products = await filterProducts(filters);
      const totalProducts = await getTotalProductCount(filters);

      res.status(200).json({ products, totalProducts });
    } catch (error) {
      console.error('Error fetching admin products:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    const { title, description, price, sku, condition, categoryId, stock, images, brand } = req.body;

    if (!title || !price || !sku || !condition || !categoryId || stock === undefined || !images) {
      return res.status(400).json({ message: 'Missing required product fields' });
    }

    try {
      const newProduct = await createProduct(
        title,
        description,
        price,
        sku,
        condition,
        categoryId,
        stock,
        images,
        brand
      );
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
