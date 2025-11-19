import { NextApiRequest, NextApiResponse } from 'next';
import { getProductById, updateProduct, deleteProduct } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  const productId = parseInt(id, 10);

  if (req.method === 'GET') {
    try {
      const product = await getProductById(id); // getProductById expects string
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      res.status(500).json({ message: `Error fetching product ${id}` });
    }
  } else if (req.method === 'PUT') {
    try {
      const {
        title,
        description,
        price,
        sku,
        condition,
        categoryId,
        stock,
        images,
        brand,
        modelCompatibility,
        vehicleYearStart,
        vehicleYearEnd,
      } = req.body;

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
        brand,
        modelCompatibility,
        vehicleYearStart,
        vehicleYearEnd
      );

      if (updatedProduct) {
        res.status(200).json(updatedProduct);
      } else {
        res.status(404).json({ message: 'Product not found for update' });
      }
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      res.status(500).json({ message: `Error updating product ${id}` });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deleted = await deleteProduct(productId);
      if (deleted) {
        res.status(204).end(); // No content for successful deletion
      } else {
        res.status(404).json({ message: 'Product not found for deletion' });
      }
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      res.status(500).json({ message: `Error deleting product ${id}` });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
