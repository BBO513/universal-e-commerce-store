import { NextApiRequest, NextApiResponse } from 'next';
import { getAllUniqueBrands } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const brands = await getAllUniqueBrands();
      res.status(200).json({ brands });
    } catch (error) {
      console.error('Error fetching unique brands:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
