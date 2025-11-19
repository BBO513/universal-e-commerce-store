
import { NextApiRequest, NextApiResponse } from 'next';
import { getCategoryBySlug } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;

  if (req.method === 'GET') {
    if (typeof slug !== 'string') {
      return res.status(400).json({ message: 'Invalid slug' });
    }

    try {
      const category = await getCategoryBySlug(slug);
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
