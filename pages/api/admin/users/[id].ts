
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { updateUserRole, updateUserBanStatus } from '../../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session || session.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  const userId = parseInt(id, 10);

  if (req.method === 'PUT') {
    const { role, banned } = req.body;

    try {
      let updatedUser;
      if (role) {
        updatedUser = await updateUserRole(userId, role);
      } else if (typeof banned === 'boolean') {
        updatedUser = await updateUserBanStatus(userId, banned);
      } else {
        return res.status(400).json({ message: 'Invalid update action' });
      }

      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
