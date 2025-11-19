import { NextApiRequest, NextApiResponse } from 'next';
import { getModelsByMake } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { make } = req.query;

    if (!make || typeof make !== 'string') {
      return res.status(400).json({ message: 'Make is required.' });
    }

    try {
      const models = await getModelsByMake(make);
      res.status(200).json({ models: models || [] });
    } catch (error) {
      console.error('Error fetching models by make:', error);
      // Return empty array instead of error when database is not available
      res.status(200).json({ models: [] });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
