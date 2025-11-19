import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { updateReviewStatus, getUserRole } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const session = await getSession({ req });

    if (!session || !session.user || !session.user.id) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const userRole = await getUserRole(parseInt(session.user.id, 10));
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required.' });
    }

    const { reviewIds, status } = req.body;

    if (!reviewIds || !Array.isArray(reviewIds) || reviewIds.length === 0 || !status) {
      return res.status(400).json({ message: 'Missing or invalid reviewIds or status in request body.' });
    }

    const isApproved = status === 'approve';

    try {
      const updatedReviews = [];
      for (const reviewId of reviewIds) {
        const updatedReview = await updateReviewStatus(reviewId, isApproved);
        updatedReviews.push(updatedReview);
      }
      return res.status(200).json({ message: `Reviews ${reviewIds.join(', ')} ${status}d successfully.`, updatedReviews });
    } catch (error) {
      console.error('Error moderating reviews:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

