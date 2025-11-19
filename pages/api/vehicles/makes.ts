import { NextApiRequest, NextApiResponse } from 'next';
import { getAllUniqueMakes } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const makes = await getAllUniqueMakes();
      res.status(200).json({ makes: makes || [] });
    } catch (error) {
      console.error('Error fetching unique makes:', error);
      // Return empty array instead of error when database is not available
      res.status(200).json({ makes: [] });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
