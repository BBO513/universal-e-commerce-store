
import { NextApiRequest, NextApiResponse } from 'next';
import { updateAddress } from '../../../lib/db';
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

  if (req.method === 'PUT') {
    const { addressId, type, street, city, state, postcode, isDefault } = req.body;

    if (!addressId || !street || !city || !state || !postcode) {
      return res.status(400).json({ message: 'Missing required address fields' });
    }

    try {
      const updatedAddress = await updateAddress(
        addressId,
        userId,
        type || 'shipping',
        street,
        city,
        state,
        postcode,
        isDefault || false
      );
      if (updatedAddress) {
        res.status(200).json(updatedAddress);
      } else {
        res.status(404).json({ message: 'Address not found or not owned by user' });
      }
    } catch (error) {
      console.error('Error updating address:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
