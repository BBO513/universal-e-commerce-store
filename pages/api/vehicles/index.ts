import { NextApiRequest, NextApiResponse } from 'next';
import { getAllVehicles } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const vehicles = await getAllVehicles();
      res.status(200).json(vehicles || []);
    } catch (error) {
      console.error('Error fetching all vehicles:', error);
      // Return empty array instead of error when database is not available
      res.status(200).json([]);
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
