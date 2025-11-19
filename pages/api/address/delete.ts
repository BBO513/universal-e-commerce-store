
import { NextApiRequest, NextApiResponse } from 'next';
import { deleteAddress } from '../../../lib/db';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = parseInt(session.user.id as string, 10);

  if (req.method === 'DELETE') {
    const { addressId } = req.body;

    if (!addressId) {
      return res.status(400).json({ message: 'Missing addressId' });
    }

    try {
      const success = await deleteAddress(addressId, userId);
      if (success) {
        res.status(200).json({ message: 'Address deleted' });
      } else {
        res.status(404).json({ message: 'Address not found or not owned by user' });
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
