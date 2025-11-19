import { NextApiRequest, NextApiResponse } from 'next';
import { getYearsByMakeAndModel } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { make, model } = req.query;

    if (!make || typeof make !== 'string' || !model || typeof model !== 'string') {
      return res.status(400).json({ message: 'Make and Model are required.' });
    }

    try {
      const years = await getYearsByMakeAndModel(make, model);
      res.status(200).json({ years: years || [] });
    } catch (error) {
      console.error('Error fetching years by make and model:', error);
      // Return empty array instead of error when database is not available
      res.status(200).json({ years: [] });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
