import { NextApiRequest, NextApiResponse } from 'next';
import { getApprovedReviewsByProductId, getAverageRatingAndCountByProductId } from '../../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === 'GET') {
    if (typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    try {
      const reviews = await getApprovedReviewsByProductId(id);
      const { averageRating, reviewCount } = await getAverageRatingAndCountByProductId(id);

      res.status(200).json({ reviews, averageRating, reviewCount });
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
