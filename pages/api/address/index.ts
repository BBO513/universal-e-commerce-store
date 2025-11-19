
import { NextApiRequest, NextApiResponse } from 'next';
import { getAddresses, addAddress } from '../../../lib/db';
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

  if (req.method === 'GET') {
    try {
      const addresses = await getAddresses(userId);
      res.status(200).json(addresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    const { type, street, city, state, postcode, isDefault } = req.body;

    if (!street || !city || !state || !postcode) {
      return res.status(400).json({ message: 'Missing required address fields' });
    }

    try {
      const newAddress = await addAddress(userId, type || 'shipping', street, city, state, postcode, isDefault || false);
      res.status(201).json(newAddress);
    } catch (error) {
      console.error('Error adding address:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
