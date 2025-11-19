import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { mapProductToVehicle, unmapProductFromVehicle, getUserRole } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session || session.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required.' });
  }

  const { productId, vehicleId } = req.body;

  if (!productId || !vehicleId) {
    return res.status(400).json({ message: 'Product ID and Vehicle ID are required.' });
  }

  const parsedProductId = parseInt(productId, 10);
  const parsedVehicleId = parseInt(vehicleId, 10);

  if (req.method === 'POST') {
    try {
      const mapping = await mapProductToVehicle(parsedProductId, parsedVehicleId);
      if (mapping) {
        res.status(201).json({ message: 'Product mapped to vehicle successfully.', mapping });
      } else {
        res.status(200).json({ message: 'Product already mapped to this vehicle.' });
      }
    } catch (error) {
      console.error('Error mapping product to vehicle:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const success = await unmapProductFromVehicle(parsedProductId, parsedVehicleId);
      if (success) {
        res.status(200).json({ message: 'Product unmapped from vehicle successfully.' });
      } else {
        res.status(404).json({ message: 'Mapping not found.' });
      }
    } catch (error) {
      console.error('Error unmapping product from vehicle:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
