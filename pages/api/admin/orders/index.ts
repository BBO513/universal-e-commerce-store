
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { filterOrders, getTotalOrderCount } from '../../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session || session.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (req.method === 'GET') {
    try {
      const { page, limit, status, startDate, endDate, sortBy } = req.query;

      const filters: { [key: string]: any } = {};
      if (page) filters.page = parseInt(page as string, 10);
      if (limit) filters.limit = parseInt(limit as string, 10);
      if (status) filters.status = status as string;
      if (startDate) filters.startDate = startDate as string;
      if (endDate) filters.endDate = endDate as string;
      if (sortBy) filters.sortBy = sortBy as 'newest' | 'total_asc' | 'total_desc';

      const orders = await filterOrders(filters);
      const totalOrders = await getTotalOrderCount(filters);

      res.status(200).json({ orders, totalOrders });
    } catch (error) {
      console.error('Error fetching admin orders:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
