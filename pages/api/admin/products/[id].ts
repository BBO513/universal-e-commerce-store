
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { updateProduct, deleteProduct } from '../../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session || session.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  const productId = parseInt(id, 10);

  if (req.method === 'PUT') {
    const { title, description, price, sku, condition, categoryId, stock, images, brand } = req.body;

    if (!title || !price || !sku || !condition || !categoryId || stock === undefined || !images) {
      return res.status(400).json({ message: 'Missing required product fields' });
    }

    try {
      const updatedProduct = await updateProduct(
        productId,
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
      if (updatedProduct) {
        res.status(200).json(updatedProduct);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const success = await deleteProduct(productId);
      if (success) {
        res.status(200).json({ message: 'Product deleted' });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
