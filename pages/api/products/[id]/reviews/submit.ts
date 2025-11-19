import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { submitReview } from '../../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const session = await getSession({ req });

    if (!session || !session.user || !session.user.id) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const { id: productId } = req.query;
    const { rating, title, comment } = req.body;

    if (typeof productId !== 'string') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    if (!rating || !title || !comment) {
      return res.status(400).json({ message: 'Missing required fields: rating, title, comment' });
    }

    try {
      const newReview = await submitReview({
        productId: parseInt(productId, 10),
        userId: parseInt(session.user.id, 10),
        rating: parseInt(rating, 10),
        title,
        comment,
      });
      res.status(201).json(newReview);
    } catch (error) {
      console.error('Error submitting review:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
