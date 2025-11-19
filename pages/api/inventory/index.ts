import { NextApiRequest, NextApiResponse } from 'next';
import { getProductsWithInventory, createProduct } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const products = await getProductsWithInventory();
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products with inventory:', error);
      res.status(500).json({ message: 'Error fetching products with inventory' });
    }
  } else if (req.method === 'POST') {
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

      const newProduct = await createProduct(
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

      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Error creating product' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
