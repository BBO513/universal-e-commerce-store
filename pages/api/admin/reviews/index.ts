import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getAllReviews, getTotalReviewCount, getUserRole } from '../../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const session = await getSession({ req });

    if (!session || !session.user || !session.user.id) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const userRole = await getUserRole(parseInt(session.user.id, 10));
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required.' });
    }

    const { productId, userId, isApproved, page, limit } = req.query;

    const filters = {
      productId: productId ? String(productId) : undefined,
      userId: userId ? String(userId) : undefined,
      isApproved: isApproved ? (isApproved === 'true') : undefined,
      page: page ? parseInt(String(page), 10) : 1,
      limit: limit ? parseInt(String(limit), 10) : 10,
    };

    try {
      const reviews = await getAllReviews(filters);
      const totalReviews = await getTotalReviewCount(filters);

      res.status(200).json({ reviews, totalReviews, page: filters.page, limit: filters.limit });
    } catch (error) {
      console.error('Error fetching all reviews:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
