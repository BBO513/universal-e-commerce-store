import { NextApiRequest, NextApiResponse } from 'next';
import { getVehiclesForProduct } from '../../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { id } = req.query;

    if (typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    try {
      const vehicles = await getVehiclesForProduct(parseInt(id, 10));
      res.status(200).json({ vehicles });
    } catch (error) {
      console.error('Error fetching vehicles for product:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
