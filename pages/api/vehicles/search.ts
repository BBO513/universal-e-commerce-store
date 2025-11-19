import { NextApiRequest, NextApiResponse } from 'next';
import { searchVehicles } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { make, model, year } = req.query;

    try {
      const vehicles = await searchVehicles(
        make as string,
        model as string,
        year ? parseInt(year as string, 10) : undefined
      );
      res.status(200).json(vehicles);
    } catch (error) {
      console.error('Error searching vehicles:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
